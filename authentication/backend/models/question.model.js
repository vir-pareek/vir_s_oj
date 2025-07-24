import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    qid:{
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    input: {
        type: String,
        required: true  
    },
    output: {
        type: String,
        required: true
    },
    constraints: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    }
    
});

export const question = mongoose.model('question', questionSchema);