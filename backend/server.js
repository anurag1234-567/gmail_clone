const express = require('express');
const cors = require('cors');
const connect = require('./database/db');
const router = require('./routes/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect(); //connect with database

app.use('/', router);

app.listen(8000, ()=>{
    console.log('server running');
})