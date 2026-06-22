import {Dexie} from 'dexie';

const db = new Dexie("chat");

db.version(1).stores({
    messages: "++_id, conversationId"
})

export {db};
