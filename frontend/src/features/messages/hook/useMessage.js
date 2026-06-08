import React, { useRef, useState } from 'react'
import useKeyboardSound from './useKeyboardSound'
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../conversations/chatSlice';
import toast from 'react-hot-toast';

const useMessage = () => {
    const { playRandomKeyStrokeSound } = useKeyboardSound();
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);

    const fileInputRef = useRef(null);

    const { isSoundEnabled } = useSelector(state => state.chat);
    const dispatch = useDispatch();

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        if (isSoundEnabled) playRandomKeyStrokeSound();

        dispatch(sendMessage({
            text: text.trim(),
            image: imagePreview,
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
