const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false,        
    },
    startTime: {
        type: Date        
    },
    endTime: {
        type: Date
    },
    amOrPm:{
        type: String        
    },
    endAmOrPm:{
        type: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        //creates a relationship to User
        ref: 'User'
    }
})

module.exports = Task;