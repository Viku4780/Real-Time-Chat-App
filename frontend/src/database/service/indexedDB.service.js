import { db } from "../config/indexedDB.js";

const createMessage = async(msgData) => {
  const msgId = await db.messages.add(msgData);
  return msgId;
}

const getMessage = async(conversationId) => {
  const messages =  await db.messages
                          .where("conversationId")
                          .equals(conversationId)
                          .reverse() // this puts the newest at the top
                          .toArray();

  return messages;
}

export {createMessage, getMessage};