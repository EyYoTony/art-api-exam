require('dotenv').config()
const express = require('express')
const app = express()
const dal = require('./dal.js')
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const checkRequiredFields = require('./lib/check-required-fields')
const port = process.env.PORT || 5000
const { pathOr, keys } = require('ramda')

const paintingReqFields = checkRequiredFields([
  'name',
  'movement',
  'artist',
  'yearCreated',
  'museum'
])

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

////////////////////
//  Paintings
////////////////////

// CREATE - POST /art/paintings
app.post('/art/paintings', function(req, res, next) {
  const body = pathOr(null, ['body'], req)
  const checkResults = paintingReqFields(body)

  if (checkResults.length > 0) {
    return next(
      new HTTPError(
        400,
        'Missing required fields in the request body.',
        checkResults
      )
    )
  }

  dal.createPainting(body, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})

// READ - GET /art/paintings/:id
app.get('/art/paintings/:id', function(req, res, next) {
  const paintingId = pathOr(null, ['params', 'id'], req)

  dal.getPainting(paintingId, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// UPDATE - PUT /art/paintings/:id
app.put('/art/paintings/:id', function(req, res, next) {
  const body = pathOr(null, ['body'], req)

  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing data in request body.'))

  dal.updatePainting(body, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

// DELETE - DELETE /art/paintings/:id
app.delete('/art/paintings/:id', function(req, res, next) {
  const paintingId = pathOr(null, ['params', 'id'], req)

  dal.deletePainting(paintingId, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// LIST - GET /art/paintings
app.get('/art/paintings', function(req, res, next) {
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listPaintings(Number(limit), lastItem, filter, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

app.listen(port, () => console.log('API is running on this port: ', port))
