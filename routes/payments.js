const express = require('express');
const paymentRouter = express.Router();
const Payment = require('../models/Payment');

paymentRouter.get('/', async (req, res, next) => {
    const payments = await Payment.find({});
    if(payments) {
        res.status(200).json({payments});
    } else {
        res.sendStatus(500);
    }
});

paymentRouter.param('paymentId', async (req, res, next, paymentId) => {
    Payment.findById(paymentId, (err, payment) => {
        if(err) {
            next(err)
        } else if (payment) {
            req.payment = payment;
            next();
        } else {
            next(new Error('Failed to identify payment.'));
        }
    });
});

paymentRouter.get('/:paymentId', (req, res, next) => {
    Payment.findById(req.params.paymentId, function (err, payment) {
        if(err) {
            next(err);
        } else {
            res.status(200).json({payment});
        }
    });
});

paymentRouter.post('/', (req, res, next) => {
    const studentId = req.body.payment.student_id;
    const date = req.body.payment.date;
    const paymentAmount = req.body.payment.payment_amount;

    const data = {
        studentId,
        date,
        paymentAmount
    }

    var newPayment = new Payment(data);

    newPayment.save((err, payment) => {
        if(err) {
            next(err);
        } else {
            res.status(201).send(payment);
        }
    })
});

paymentRouter.put('/:paymentId', (req, res, next) => {
    const studentId = req.body.payment.student_id;
    const date = req.body.payment.date;
    const paymentAmount = req.body.payment.payment_amount;

    const updateData = {
        studentId,
        date,
        paymentAmount
    }

    Payment.findByIdAndUpdate(req.payment._id, updateData, { returnOriginal: false }, async (err, update) => {
        if(err) {
            console.log(err);
            next(err);
        } else {
            const checkUpdate = await Payment.findById(req.payment._id).exec();
            if (JSON.stringify(update) === JSON.stringify(checkUpdate.toJSON())) {
                res.send(update);
            } else {
                res.sendStatus(500);
            }
       }
    })
});

paymentRouter.delete('/:paymentId', (req, res, next) => {
    Payment.findByIdAndDelete(req.payment._id, (err, payment) => {
        if(err) {
            next(err);
        } else {
            res.status(204).send(payment);
        }
    })
});


module.exports = paymentRouter;