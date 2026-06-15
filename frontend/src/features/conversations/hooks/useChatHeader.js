import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../../users/userSlice';
import { deleteConversation } from '../conversationSlice';

const useChatHeader = () => {
    const { selectedUser } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const onlineUsers = useSelector(state => state.auth.onlineUsers);
    const isOnline = onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") dispatch(setSelectedUser(null));
        }
        window.addEventListener("keydown", handleEscKey);

        // cleanup function
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setSelectedUser]);

    const cancelChat = () => {
        dispatch(setSelectedUser(null));
        dispatch(deleteConversation());
    }

    return {isOnline, selectedUser, cancelChat}
}

export default useChatHeader
