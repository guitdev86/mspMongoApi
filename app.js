const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const cors = require('cors');
const createError = require('http-errors');
const studentRouter = require('./routes/student');
const paymentRouter = require('./routes/payments');
const lessonRouter = require('./routes/lesson');
const Student = require('./models/Student');


const app = express();

// enable JSON parser
app.use(express.json());

//enable logger
app.use(logger('dev'));

app.use(cors());

//mongoDB keys connected
const db = require('./config/keys').MongoURI;

//connecting DB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));

app.get('/', (req, res, next) => {
  res.send("Mongo DB API");
})

// routers
app.use('/students', studentRouter);
app.use('/payments', paymentRouter);
app.use('/lessons', lessonRouter);

app.get('/name', (req, res, next) => {
  const name = req.query.name;
  const surname = req.query.surname;

  console.log(name);
  console.log(surname);

  Student.find({name: name, surname: surname}, (err, student) => {
    if(err) {
      res.sendStatus(404);
      next();
    } else {
      res.status(200).json({student: student[0]});
      next();
    }
  });

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running on ${PORT}`));