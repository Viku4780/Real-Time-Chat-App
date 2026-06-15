import cloudinary from "../../infrastructure/storage/cloudinary.js";
import { wss } from "../realtime/websocket.js";
import Message from "../message/message.model.js";
import User from "../auth/auth.model.js";
import { getSocket } from "../realtime/utils/websocket.utils.js";
import { Conversation } from "../conversation/conversation.model.js";
import { messageQueue } from "../../store/messageQueue.js";


export const getMessagesByConversationId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: conversationId } = req.params;

        // console.log(`myId : ${myId}`, `conversationId: ${conversationId}`)

        const messages = await Message.find({
            conversationId: conversationId, isActive: true, messageDeletedFor: { $ne: myId }
        }).select({ messageDeletedFor: 0, isActive: 0, __v: 0 });

        const findConversation = await Conversation.findById({ _id: conversationId, isConversationActive: true });

        if (findConversation) {
            findConversation.unReadCountPerUser = findConversation.unReadCountPerUser.map(item => {
                if (item.user.toString() === myId.toString()) {
                    item.count = 0
                }

                return item;
            })
        }

        await findConversation.save();

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const sendMessage = async (req, res) => {
    try {
        const { text, image, conversationId, receiverId, temporaryId } = req.body;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: 'Text or image is required' });
        }

        const checkConversation = await Conversation.findOne(
            {
                _id: conversationId,
            }
        )
            .select({
                lastMessagePerUser: 1,
                unReadCountPerUser: 1,
                updatedAt: 1,
                typeOfConversation: 1,
                removedConversationForParticipants: 1,
                participents: 1
            })
            .populate('lastMessagePerUser.message', 'text senderId createdAt');

        if (!checkConversation) return res.status(404).json({ message: 'conversation not allowed' });

        let imageUrl;
        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            conversationId,
            senderId,
            text,
            image: imageUrl,
            status: 'sent'
        });

        await newMessage.save();

        // console.log('checkConversation: ', checkConversation)

        if (
            checkConversation.typeOfConversation === 'single'
            &&
            checkConversation.lastMessagePerUser.length > 0
        ) {
            checkConversation.lastMessagePerUser.map(msg => msg.message = newMessage);
        }
        else if (checkConversation.typeOfConversation === 'single') {
            checkConversation.participents.forEach(userId => {
                checkConversation.lastMessagePerUser.push({
                    user: userId,
                    message: newMessage._id
                })
            })

            checkConversation.isConversationActive = true;
        }

        checkConversation.removedConversationForParticipants.length = 0;

        let unReadMessage;
        let unReadMessageForSender;

        checkConversation.unReadCountPerUser = checkConversation.unReadCountPerUser.map(user => {
            if (String(user.user) === receiverId) {
                user.count++;
                unReadMessage = user;
            } else if (String(user.user) === senderId.toString()) {
                user.count = 0;
                unReadMessageForSender = user;
            }
            return user;
        })

        // console.log('conversation: ', checkConversation);

        await checkConversation.save();

        // todo: send message in real-time if user is online - socket.io
        const receiverSocket = getSocket(receiverId);

        if (receiverSocket) {
            newMessage.status = 'delivered';
            await newMessage.save();
            
            receiverSocket.send(JSON.stringify({
                type: 'newMessage',
                payload: {
                    _id: newMessage._id,
                    conversationId: newMessage.conversationId,
                    createdAt: newMessage.createdAt,
                    senderId: newMessage.senderId,
                    text: newMessage.text,
                    image: newMessage?.image || null,
                    status: newMessage.status,
                },
            }));

            receiverSocket.send(JSON.stringify({
                type: 'update_chatLists',
                payload: {
                    _id: newMessage._id,
                    conversationId: newMessage.conversationId,
                    createdAt: newMessage.createdAt,
                    senderId: newMessage.senderId,
                    text: newMessage.text,
                    unReadMessage,
                    updatedAt: checkConversation.updatedAt
                }
            }))
        } else {
            if (messageQueue.get(receiverId)) {
                messageQueue.get(receiverId).push({
                    _id: newMessage._id,
                    conversationId: newMessage.conversationId,
                    senderId: newMessage.senderId,
                    status: newMessage.status,
                })

            } else {
                messageQueue.set(receiverId, [{
                    _id: newMessage._id,
                    conversationId: newMessage.conversationId,
                    senderId: newMessage.senderId,
                    status: newMessage.status,
                }])
            }
        }

        console.log('messageQueue: ', messageQueue);

        // console.log(senderId, String(senderId)); here is senderId is in new ObjectId i mean in id format thats why i have converted it into string
        const senderSocket = getSocket(String(senderId));

        if (senderSocket) {
            senderSocket.send(JSON.stringify({
                type: 'update_chatLists',
                payload: {
                    _id: newMessage._id,
                    conversationId: newMessage.conversationId,
                    createdAt: newMessage.createdAt,
                    senderId: newMessage.senderId,
                    text: newMessage.text,
                    updatedAt: checkConversation.updatedAt,
                    unReadMessage: unReadMessageForSender
                }
            }))
        }

        res.status(201).json({
            data: {
                _id: newMessage._id,
                conversationId: newMessage.conversationId,
                createdAt: newMessage.createdAt,
                senderId: newMessage.senderId,
                text: newMessage.text,
                image: newMessage?.image || null,
                status: newMessage.status
            },
            temporaryId,
        });
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });

        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString()
                        ? msg.receiverId.toString()
                        : msg.senderId.toString()
                )
            ),
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");

        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error in getChatPartners:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}