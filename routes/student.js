const express = require('express');
const studentRouter = express.Router();
const Student = require('../models/Student');
const Payment = require('../models/Payment');
const Lesson = require('../models/Lesson');

//------------- CRUD ------------------//

studentRouter.get('/', async (req, res, next) => {
    const students = await Student.find({});
    if(students) {
        res.status(200).json({students});
    } else {
        res.sendStatus(500);
    }
});

studentRouter.param('studentId', async (req, res, next, studentId) => {
    Student.findById(studentId, (err, student) => {
        if(err) {
            next(err)
        } else {
            req.student = student;
            next();
        }
    });
});

studentRouter.get('/:studentId', (req, res, next) => {
    Student.findById(req.params.studentId, function (err, student) {
        if(err) {
            next(err);
        } else {
            res.status(200).send(student);
        }
    });
})

studentRouter.post('/', (req, res, next) => {
    const name = req.body.student.name;
    const surname = req.body.student.surname;
    const payment_rate = req.body.student.payment_rate;

    const data = {
        name,
        surname,
        payment_rate
    }
    
    var newStudent = new Student(data);
    
    newStudent.save((err, student) => {
        if(err) return console.log(err);
        res.status(201).send(student);
    })
});

studentRouter.put('/:studentId', (req, res, next) => {
    const name = req.body.student.name;
    const surname = req.body.student.surname;
    const payment_rate = req.body.student.payment_rate;

    const updateData = {
        name,
        surname,
        payment_rate
    }

    Student.findByIdAndUpdate(req.student._id, updateData, { returnOriginal: false }, async (err, update) => {
        if(err) {
            next(err);
        } else {
            const checkUpdate = await Student.findById(req.student._id).exec();
            if (JSON.stringify(update) === JSON.stringify(checkUpdate.toJSON())) {
                res.send(update);
            } else {
                res.sendStatus(500);
            }
       }
    })
});

studentRouter.delete('/:studentId', (req, res, next ) => {
    Student.findByIdAndDelete(req.student._id, (err, student) => {
        if(err) {
            next(err);
        } else {
            res.status(204).send(student);
        }
    })
})

//-------------- SPEC REQ -----------------------//

studentRouter.get('/:studentId/total-payments', (req, res, next) => {

    Payment.find({studentId: req.params.studentId}, (err, totalPayments) => {
        if(totalPayments) {
            let total = 0;
            for(let i=0; i<totalPayments.length; i++) {
                total = total + totalPayments[i].paymentAmount;
            }
            res.status(200).json({totalPayments: {
                student_id: req.params.studentId,
                total_payments: total
            }});
        } else {
            res.sendStatus(404);
            next();
        }
    });
    
})

studentRouter.get('/:studentId/total-lessons', (req, res, next) => {

    Lesson.find({studentId: req.params.studentId}, (err, totalLessons) => {
        if(err) {
            res.sendStatus(404);
            next();
        } else {
            let total = totalLessons.length;
            res.status(200).json({totalLessons: {
                student_id: req.params.studentId,
                total_lessons: total
            }});
        }
    })
})


module.exports = studentRouter;