import {
  connectSocket,
  getSocket
} from "../../websocket/socket"

export const socketMiddleware =
  (store)=>
  (next)=>
  (action)=>{

    if(
      action.type==="socket/connect"
    ){
      connectSocket()
    }

    if(
      action.type==="socket/sendMessage"
    ){
      const socket = getSocket()

      socket?.send(
        JSON.stringify(
          action.payload
        )
      )
    }

    return next(action)
}