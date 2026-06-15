import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllContacts, setSelectedUser } from '../../users/userSlice';
import { createConversation } from '../../conversations/conversationSlice';

const useContactList = () => {
    const { allContacts, isUsersLoading, isUsersError } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getAllContacts());
    }, [getAllContacts]);

    const handleFetch = (obj) => {
        dispatch(setSelectedUser(obj));
        dispatch(createConversation({
            userId: obj._id
        }));
    }

    return { allContacts, isUsersLoading, onlineUsers, dispatch, isUsersError, handleFetch };
}

export default useContactList
