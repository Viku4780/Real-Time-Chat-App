import SocketService from "../service/socketClass";

export const socketMiddleware =
    (store) =>
        (next) =>
            (action) => {

                if (
                    action.type === "socket/connect"
                ) {
                    const socketService = new SocketService('ws://localhost:3000');
                    const socket = socketService.connect();
                }

                if (
                    action.type === "socket/sendMessage"
                ) {
                    const socket = getSocket()

                    socket?.send(
                        JSON.stringify(
                            action.payload
                        )
                    )
                }

                return next(action)
            }