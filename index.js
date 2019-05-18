const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const nunjucks = require('nunjucks')
const connectMongo = require('connect-mongo')
const expressSession = require('express-session')
const cache = require('./services/cache')
const morgan = require('morgan')
const helmet = require('helmet')

VIEWS_DIR = './views/'
const DEBUG = process.env.DEBUG

const env = process.env.NODE_ENV || 'development'
const mongoConfig = require('./config/mongo')[env]
const envUrl = process.env[mongoConfig.use_env_variable]
const DevUrl = `mongodb://${mongoConfig.host}/${mongoConfig.database}`
const mongoUrl = envUrl ? envUrl : DevUrl

const app = new express()

mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => console.log('Connected to Mongo'))
    .catch(e => console.log('Something went wrong', e))

const mongoStore = connectMongo(expressSession)
app.use(expressSession({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}))


app.use(express.static(path.join(__dirname, 'views/public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(morgan('short'))
app.use(helmet())

app.set('view engine', 'html')
let nunjucksOptions = {
    autoescape: true,
    express: app
}
let envNunjucks = nunjucks.configure(VIEWS_DIR, nunjucksOptions)

app.use('*', (req, res, next) => {
    envNunjucks.addGlobal('isAuthenticated', req.session.userId)
    next()
})

const getUserIdApiController = require('./controllers/api/getUserIdApi')
const getUserStatsApiController = require('./controllers/api/getUserStatsApi')
const createUserStatsApiController = require('./controllers/api/createUserStatsApi')
const createFriendApiController = require('./controllers/api/createFriendApi')
const deleteFriendApiController = require('./controllers/api/deleteFriendApi')

const indexController = require('./controllers/web/indexController')
const getUserStatsController = require('./controllers/web/getUserStats')
const getUserStatsSubmitController = require('./controllers/web/getUserStatsSubmit')
const getChartsController = require('./controllers/web/getChartsController')

const loginController = require('./controllers/auth/loginController')
const loginUserController = require('./controllers/auth/loginUserController')
const createUserController = require('./controllers/auth/createUserController')
const storeUserController = require('./controllers/auth/storeUserController')
const logoutUserController = require('./controllers/auth/logoutUserController')


app.get('/', cache(DEBUG ? 0 : 10 * 60), indexController)

app.get('/api/users/:username/', getUserIdApiController)
app.get('/api/users/:userId/stats/', getUserStatsApiController)
app.post('/api/users/:userId/', createUserStatsApiController)

app.post('/api/users/friends/:accountId/add/', createFriendApiController)
app.delete('/api/users/friends/:accountId/delete/', deleteFriendApiController)

app.get('/users/:username/stats/', getUserStatsController)
app.post('/users/stats/submit/', getUserStatsSubmitController)
app.get('/charts/', cache(DEBUG ? 0 : 3 * 60), getChartsController)

app.get('/auth/login/', loginController)
app.post('/auth/login/', loginUserController)
app.get('/auth/register/', createUserController)
app.post('/auth/register/', storeUserController)
app.get('/auth/logout/', logoutUserController)


let port = process.env.PORT || 4000
app.listen(port, () => {
    console.log(`App listening on port ${port}...`)
})
