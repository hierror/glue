import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const purchaseSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => nanoid(20)
    },
    purchaseCode: {
        type: String,
        required: true
    },
    clientCode: {
        type: Number,
        required: true
    },
    approvedAt: { 
        type: Date, 
        default: Date.now 
    },
    completedAt: {
        type: Date
    }
});

export default mongoose.model('Purchase', purchaseSchema);