require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const massive = require('massive');
const ac = require('./controllers/authController.js');
const treasureController = require('./controllers/treasureController.js');

const app = express();
const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

app.use(express.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected')
});

//Auth endpoints
app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.get('/auth/logout', ac.logout);

//treasure endpoints
app.get('/api/treasure/dragon', treasureController.dragonTreasure);

app.listen(SERVER_PORT,() => {
    console.log(`Server Listening on port ${SERVER_PORT}`)
} )