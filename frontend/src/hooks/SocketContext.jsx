import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateOnlineUser } from '../features/auth/authSlice';
import { subscribeToMessages } from '../features/chat/chatSlice';

const SocketContext = createContext(null);


export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const dispatch = useDispatch();

  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const host = window.location.host; // Includes domain and port (e.g., localhost:3000)
  const socketUrl = `${protocol}${host}`; // Adjust path (/ws) to match your backend

  console.log(socketUrl);

  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    // only connect if user exists and there's no active connection
    // readystate 0 = connecting, 1 = open
    if (user && (!socketRef.current || socketRef.current?.readyState >= 2)) {
      const socket = new WebSocket(window.location.protocol === 'https:' ? socketUrl : 'ws://localhost:3000');

      socket.onopen = () => {
        console.log("Connected");
        socketRef.current = socket;
      }

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.type === "getOnlineUsers") {
          dispatch(updateOnlineUser(data.payload));
        }

        if (data.type === "newMessage") {

          dispatch(subscribeToMessages(data.payload));
        }
      }

      socket.onclose = (e) => {
        console.log("Disconnected:", e.reason);
        socketRef.current = null; // reset ref so it can reconnect if needed 
        // setSocketObj(null)
      };

      return () => {
        if (socket.readyState === 1) {
          socket.close();
        }
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook for easy access
export const useSocket = () => useContext(SocketContext);
