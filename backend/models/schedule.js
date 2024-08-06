const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    classId: {
        type: [mongoose.Schema.Types.ObjectId],
    },
    scheduleName: {
        type: String,
    },
}, { collection: 'UCSC Schedules' });

module.exports = mongoose.model('Schedule', scheduleSchema);