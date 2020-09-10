const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },

    lessonLength: {
        type: Number,
        required: true
    }
});

const Lesson = mongoose.model('Lesson', LessonSchema);

module.exports = Lesson;