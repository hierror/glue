import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const clientSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => nanoid(20)
    },
    name: {
        type: String,
        required: true
    },
    docs: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model('Client', clientSchema);