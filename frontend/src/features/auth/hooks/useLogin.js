import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';

const useLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { user, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (user) return null;

    return { loading, user, handleInputChange, handleSubmit, formData }
}

export default useLogin
