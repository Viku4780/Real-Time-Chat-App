let socket = null

export const connectSocket = () => {
  if (!socket) {
    socket =
      new WebSocket(
        "ws://localhost:8080"
      )
  }

  return socket
}

export const getSocket = () => socket