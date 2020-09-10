const express = require('express');
const lessonRouter = express.Router();
const Lesson = require('../models/Lesson');


lessonRouter.get('/', async (req, res, next) => {
    const response = await Lesson.find({});
    if(response) {
        res.status(200).json({lessons: response});
    } else {
        res.sendStatus(500);
    }
});

lessonRouter.param('lessonId', async (req, res, next, lessonId) => {
    Lesson.findById(lessonId, (err, lesson) => {
        if(err) {
            next(err)
        } else {
            req.lesson = lesson;
            next();
        }
    });
});

lessonRouter.get('/:lessonId', (req, res, next) => {
    Lesson.findById(req.params.lessonId, function (err, lesson) {
        if(err) {
            next(err);
        } else {
            res.status(200).json({lesson});
        }
    });
});

lessonRouter.post('/', (req, res, next) => {
    const studentId = req.body.lesson.student_id;
    const date = req.body.lesson.date;
    const lessonLength = req.body.lesson.lesson_length;

    const data = {
        studentId,
        date,
        lessonLength
    }

    var newLesson = new Lesson(data);

    newLesson.save((err, lesson) => {
        if(err) {
            next(err);
        } else {
            res.status(201).send(lesson);
        }
    })
});

lessonRouter.put('/:lessonId', (req, res, next) => {
    const studentId = req.body.lesson.student_id;
    const date = req.body.lesson.date;
    const lessonLength = req.body.lesson.lesson_length;

    const updateData = {
        studentId,
        date,
        lessonLength
    }

    Lesson.findByIdAndUpdate(req.lesson._id, updateData, { returnOriginal: false }, async (err, update) => {
        if(err) {
            console.log(err);
            next(err);
        } else {
            const checkUpdate = await Lesson.findById(req.lesson._id).exec();
            if (JSON.stringify(update) === JSON.stringify(checkUpdate.toJSON())) {
                res.send(update);
            } else {
                res.sendStatus(500);
            }
       }
    })
})

lessonRouter.delete('/:lessonId', (req, res, next) => {
    Lesson.findByIdAndDelete(req.lesson._id, (err, lesson) => {
        if(err) {
            next(err);
        } else {
            res.status(204).send(lesson);
        }
    })
})

module.exports = lessonRouter;