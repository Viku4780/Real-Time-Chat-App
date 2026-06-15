import { userSocketMap } from "../store/websocket.store.js";

export function getSocket(id) {
    console.log(userSocketMap)
    return userSocketMap.get(id);
}

export function broadCastOnlineUsers(map) {
    const onlineIds = [...map.keys()];

    console.log('onlineIds: ', onlineIds);
    for (let client of map.values()) {
        client.send(JSON.stringify({ type: "getOnlineUsers", payload: onlineIds }));
    }
}