import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMyChatPartners } from '../chatSlice';

const useChatList = () => {
    const { chats, isUsersLoading } = useSelector(state => state.chat);
    const { onlineUsers } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMyChatPartners());
    }, [getMyChatPartners]);

    return {chats, isUsersLoading, onlineUsers, dispatch}
}

export default useChatList
