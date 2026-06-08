import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllContacts } from '../../conversations/chatSlice';

const useContactList = () => {
    const { allContacts, isUsersLoading } = useSelector(state => state.chat);
    const dispatch = useDispatch();
    const { onlineUsers } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getAllContacts());
    }, [getAllContacts]);

    return {allContacts, isUsersLoading, onlineUsers, dispatch}
}

export default useContactList
