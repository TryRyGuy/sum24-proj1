const mongoose = require('mongoose');

const examTimeSchema = new mongoose.Schema({
    classDate: {
        type: String,
    },
    startTime: {
        type: String,
    },
    examDate: {
        type: String,
    },
    examTimes: {
        type: String,
    },
}, { collection: 'UCSC Exam Times' });

module.exports = mongoose.model('ExamTime', examTimeSchema);