import React, { useRef, useState } from 'react'
import useKeyboardSound from './useKeyboardSound'
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage,addingNewMessage } from '../../conversations/chatSlice';
import toast from 'react-hot-toast';
import { dateGenerator } from '../../../utils/dateGenerator';
import { updateChatList } from '../../conversations/conversationSlice';

const useMessage = () => {
    const { playRandomKeyStrokeSound } = useKeyboardSound();
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const fileInputRef = useRef(null);

    const { isSoundEnabled } = useSelector(state => state.chat);
    const {activeConversation} = useSelector(state => state.conversation);
    const {selectedUser} = useSelector(state => state.user);
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        if (isSoundEnabled) playRandomKeyStrokeSound();
        
        const uniqueId = crypto.randomUUID();
        dispatch(addingNewMessage({
            _id: uniqueId,
            senderId: user._id,
            conversationId: activeConversation,
            text: text.trim(),
            image: imagePreview,
            status: "pending",
            createdAt: dateGenerator()
        }))

        dispatch(updateChatList({
            _id: uniqueId,
            senderId: user._id,
            conversationId: activeConversation,
            text: text.trim(),
            createdAt: dateGenerator(),
            updatedAt: dateGenerator()
        }))

        dispatch(sendMessage({
            text: text.trim(),
            temporaryId: uniqueId,
            image: imagePreview,
            conversationId: activeConversation,
            receiverId: selectedUser._id
        }));
        setText("");
        setImagePreview("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return {imagePreview, removeImage,handleSendMessage, setText,fileInputRef,isSoundEnabled, playRandomKeyStrokeSound, handleImageChange, text}
}

export default useMessage
