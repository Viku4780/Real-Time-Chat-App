import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../chatSlice';

const useChatHeader = () => {
    const { selectedUser } = useSelector(state => state.chat);
    const dispatch = useDispatch();
    const onlineUsers = useSelector(state => state.auth.onlineUsers);
    const isOnline = onlineUsers.includes(selectedUser._id);

    // console.log("Running onlineUsers in chat Headers: ", onlineUsers);

    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === "Escape") dispatch(setSelectedUser(null));
        }

        window.addEventListener("keydown", handleEscKey);

        // cleanup function
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [setSelectedUser]);

    const cancelChat = () => dispatch(setSelectedUser(null));

    return {isOnline, selectedUser, cancelChat}
}

export default useChatHeader
