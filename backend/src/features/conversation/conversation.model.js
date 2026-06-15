import mongoose from 'mongoose';


const conversationSchema = new mongoose.Schema({
    participents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    lastMessagePerUser: [
        new mongoose.Schema({ 
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            message: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Message'
            }
        }, { _id: false })
    ],
    unReadCountPerUser: [
        new mongoose.Schema({
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            count: {
                type: Number,
                default: 0
            }
        }, { _id: false })
    ],
    typeOfConversation: {
        type: String,
        enum: ['single', 'group'],
        default: 'single'
    },
    removedConversationForParticipants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    isConversationActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


export const Conversation = mongoose.model("Conversation", conversationSchema);