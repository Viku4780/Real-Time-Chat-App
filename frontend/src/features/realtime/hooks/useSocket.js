import React from 'react'


const useSocket = () => {
    let socket = null

    const connectSocket = () => {
        if (!socket) {
            socket =
                new WebSocket(
                    "ws://localhost:8080"
                )
        }

        return socket
    };

    const getSocket = () => socket;

    return { connectSocket, getSocket };
}

export default useSocket
