const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },

    date: {
        type: String,
        required: true
    },
    
    paymentAmount: {
        type: Number,
        required: true
    }
});

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;