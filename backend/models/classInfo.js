const mongoose = require('mongoose');

const classInfoSchema = new mongoose.Schema({
    classTag: {
        type: String,
    },
    sectionNumber: {
        type: String,
    },
    className: {
        type: String,
    },
    classDays: {
        type: Map,
        of: String
    },
    instructor: {
        type: String,
    },
}, { collection: 'UCSC Class Info' });

module.exports = mongoose.model('ClassInfo', classInfoSchema);