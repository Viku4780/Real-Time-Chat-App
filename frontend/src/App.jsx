import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
// import { useAuthStore } from './store/useAuthStore'
import PageLoader from './components/PageLoader'
import {Toaster} from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { checkUserAuth } from './store/slices/authSlice'

const App = () => {
  // const {checkAuth, ischeckingAuth, authUser} = useAuthStore();
  const {user, loading} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  },[dispatch]);

  // console.log({authUser});

  if(loading) return <PageLoader />

  return (
    <div className='min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden'>
      {/* DECORATORS - GRID BG & GLOW SHAPES */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px, transparent_1px),linear-gradient(to_bottom, #4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]' />
      <div className='absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]' />
      <div className='absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]' />

      <Routes>
        <Route path='/' element={user ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to={"/"} />} />
      </Routes>
      
      <Toaster />
    </div>
  )
}

export default App
