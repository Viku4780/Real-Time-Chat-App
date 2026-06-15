import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createConversation, findAllConversation } from '../conversationSlice';
import { setSelectedUser } from '../../users/userSlice';

const useChatList = () => {
    const { chatLists, isChatListLoading } = useSelector(state => state.conversation);
    const { onlineUsers } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(findAllConversation());
    }, [findAllConversation]);

     const handleFetch = (obj) => {
        dispatch(setSelectedUser(obj.participents[0]));
        dispatch(createConversation({
          userId: obj.participents[0]._id
        }));
      }

    return {chatLists, isChatListLoading, onlineUsers, dispatch, handleFetch}
}

export default useChatList
