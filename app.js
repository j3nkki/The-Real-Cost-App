const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const cors = require('cors')
const config = require('./utils/config')
const axios = require('axios')
const expensesRouter = require('./controllers/expenses')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

mongoose
  .set('useCreateIndex', true)
  .set('useFindAndModify', false)
  .connect(config.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB!')
  })
  .catch(error => {
    console.log('error connection to MongoDB:', error.message)
  })

const app = express()

app.use(cors())
app.use(express.json()) // no longer need bodyparse, included in express
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.use('/api/expenses', expensesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
