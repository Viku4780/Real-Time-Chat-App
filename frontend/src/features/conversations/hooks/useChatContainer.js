import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesByUserId } from '../chatSlice';

const useChatContainer = () => {
    const { selectedUser, isMessagesLoading, messages } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const messageEndRef = useRef(null);

    useEffect(() => {
        dispatch(getMessagesByUserId(selectedUser._id));
    }, [selectedUser, getMessagesByUserId]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return {user, messages, isMessagesLoading, messageEndRef,selectedUser}
}

export default useChatContainer
