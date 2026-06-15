import { updateMessageStatus } from "../../conversations/chatSlice";

const socketMiddleware = (socket, dispatch, updateOnlineUser, subscribeToMessages, selectedUser, updateChatList, activeConversation) => {

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // console.log('onmessage event handler running')

        if (data.type === 'getOnlineUsers') {
            dispatch(updateOnlineUser(data.payload));
        }
        else if (data.type === 'newMessage') {
            console.log('newMessage arrived');
            dispatch(subscribeToMessages({
                data: data.payload,
                selectedUserId: selectedUser?._id
            }))
        }
        else if (data.type === 'update_chatLists') {
            console.log(data);
            dispatch(updateChatList(data.payload))
        }else if(data.type === 'message_delivered'){
            console.log(data);

            if(data.payload.conversationId === activeConversation){
                console.log('dispatching');
                dispatch(updateMessageStatus(data.payload));
            }
            
        }
    }
}

export default socketMiddleware;