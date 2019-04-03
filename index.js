const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const nunjucks = require('nunjucks')

VIEWS_DIR = './views/'

const app = new express()

mongoose.connect('mongodb://localhost:27017/xp', { useNewUrlParser: true })
    .then(() => console.log('Connected to Mongo'))
    .catch(e => console.log('Something went wrong', e))

const getUserController = require('./controllers/getUser')
const getUserIdController = require('./controllers/getUserId')
const submitUserController = require('./controllers/submitUser')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

let nunjucksOptions = {
    autoescape: true,
    express: app
};
nunjucks.configure(VIEWS_DIR, nunjucksOptions)

app.get('/', (req, res) => {
    res.render('layouts/base.html')
})

app.get('/users', getUserController)
app.get('/users/id', getUserIdController)
app.post('/users/submit', submitUserController)
app.get('/users/:userId/stats', getUserController)

app.listen(4000, () => {
    console.log('App listening on port 4000...')
})
