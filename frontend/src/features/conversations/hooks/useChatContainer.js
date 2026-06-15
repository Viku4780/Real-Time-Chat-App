import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getMessagesByConversationId } from '../chatSlice';

const useChatContainer = () => {
    const { isMessagesLoading, messages, messageSendingLoading } = useSelector(state => state.chat);
    const { selectedUser } = useSelector(state => state.user);
    const { activeConversation } = useSelector(state => state.conversation);
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const containerRef = useRef(null);

    useEffect(() => {
        if (activeConversation) {
            dispatch(getMessagesByConversationId(activeConversation));
        }
    }, [activeConversation, getMessagesByConversationId]);


  // 2. Run the scroll logic inside the component targeting the container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, messageSendingLoading]);

    return { user, messages, isMessagesLoading, containerRef, selectedUser, messageSendingLoading }
}

export default useChatContainer
