import Message from "../../message/message.model.js";
import { userSocketMap } from "../store/websocket.store.js";

export function getSocket(id) {
    // console.log(userSocketMap)
    return userSocketMap.get(id);
}

export function broadCastOnlineUsers(map) {
    const onlineIds = [...map.keys()];

    console.log('onlineIds: ', onlineIds);
    for (let client of map.values()) {
        client.send(JSON.stringify({ type: "getOnlineUsers", payload: onlineIds }));
    }
}

export async function resolveMessageDelivery(msg, socket) {

    try {
        if (socket) {
            socket.send(JSON.stringify({
                type: 'message_delivered',
                payload: {
                    conversationId: msg.conversationId,
                    messageId: msg._id,
                    status: 'delivered'
                }
            }))

            console.log('send delivered event')
        }
        const message = await Message.findById({ _id: msg._id });
        message.status = 'delivered';

    } catch (error) {
        console.error(error.message);
    }
}