import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { signUpUser } from '../authSlice';

const useRegister = () => {
     const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  });

  const { user, loading } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUpUser(formData));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user]);

  if (user) return null;
  return {loading,formData, handleInputChange, handleSubmit}
}

export default useRegister
