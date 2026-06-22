import {Dexie} from 'dexie';

const db = new Dexie("chatify");

db.version(1).stores({
    messages: "++_id, conversationId, senderId, isActive, createdAt"
})

export {db};
