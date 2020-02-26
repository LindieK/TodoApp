const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')
const routes = require('./routes/api');
const path = require('path');
const dbConfig = require('./database/db');
require('./auth/auth');

const app = express();

const port = process.env.PORT || 8080;

//connect to database
mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.db, {useNewUrlParser: true})
.then(() => console.log(`Database connected successfully`))
.catch(() => console.log('Could not connect to database'))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,,X-Requested-With,Content_Type,Accept");
    next();
});

app.use(bodyParser.json());

app.use('/api', routes);

app.use('/user', passport);


app.use((err, req, res, next) => {
    console.log(err)
    next();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});