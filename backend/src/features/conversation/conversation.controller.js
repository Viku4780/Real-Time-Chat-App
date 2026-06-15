import mongoose from "mongoose";
import User from "../auth/auth.model.js";
import { Conversation } from "./conversation.model.js";

export const createConversation = async (req, res) => {
    try {
        // console.log('conversation started')
        const initiaterId = req.user._id;
        // const existingUser = await User.findById(userId); // this line is unneccessary because the middleware already checked that the  token is valid but there is nothing suspisious i have found here through with anyone can make a valid token.

        // console.log('valid initiaterid')

        const otherParticipantId = req.body.userId;
        // console.log('valid otherparticipants');

        const existingParticipant = await User.findById(otherParticipantId);
        // console.log('running through targetuserid')

        if (!existingParticipant) res.status(404).json({ message: 'participant does not exists' });

        const targetUserIds = [initiaterId, otherParticipantId];

        const findConversation = await Conversation.find({
            participents: { $all: targetUserIds },// here  am quering using AND operator to include both the id 
        });

        if (findConversation?.length > 0) return res.status(200).json({ message: 'conversation exists', conversationId: findConversation[0]._id });


        const newConversation = await Conversation.create({
            participents: targetUserIds,
            unReadCountPerUser: [
                {
                    user: initiaterId,
                    count: 0
                },
                {
                    user: otherParticipantId,
                    count: 0
                },
            ]
        });

        res.status(201).json({ message: 'conversation created successfully', conversationId: newConversation._id });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


export const getAllConversation = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // find all the conversation where the logged-in user is participents
        const conversations = await Conversation.find(
            {
                participents: loggedInUserId,
                isConversationActive: true, removedConversationForParticipants: { $ne: loggedInUserId }
            }
        )
            .select({
                lastMessagePerUser: 1,
                unReadCountPerUser: 1,
                updatedAt: 1,
                typeOfConversation: 1
            })
            .sort({ updatedAt: -1 })
            .populate('lastMessagePerUser.message', 'text senderId createdAt')
            .populate('participents', 'fullName profilePic');

        // Instead of `doc.arr[0].populate("path")`, use `doc.populate("arr.0.path")`

        conversations.forEach(conv => {
            conv.lastMessagePerUser = conv.lastMessagePerUser.filter(item => item.user.toString() === loggedInUserId.toString());

            conv.unReadCountPerUser = conv.unReadCountPerUser.filter(item => item.user.toString() === loggedInUserId.toString())[0];

            conv.participents = conv.participents.filter(item => item._id.toString() !== loggedInUserId.toString())
        })

        // console.log(conversations);

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error in getChatPartners:", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}