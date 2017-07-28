require('dotenv').config()
const express = require('express')
const app = express()
const dal = require(`./${process.env.DAL}`)
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
const movementReqFields = checkRequiredFields(['name', 'desc'])

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

////////////////////
//   PAINTINGS
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
  const paintingId = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)

  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing data in request body.'))

  dal.updatePainting(body, paintingId, function(err, result) {
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

////////////////////
//    MOVEMENT
////////////////////

// CREATE - POST /art/movements
app.post('/art/movements', function(req, res, next) {
  const body = pathOr(null, ['body'], req)
  const checkResults = movementReqFields(body)
  if (checkResults.length > 0) {
    return next(
      new HTTPError(
        400,
        'Missing required fields in the request body.',
        checkResults
      )
    )
  }

  dal.createMovement(body, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(result)
  })
})

// READ - GET /art/movements/:id
app.get('/art/movements/:id', function(req, res, next) {
  const movementId = pathOr(null, ['params', 'id'], req)

  dal.getMovement(movementId, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// UPDATE - PUT /art/movements/:id
app.put('/art/movements/:id', function(req, res, next) {
  const movementId = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)

  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing data in request body.'))

  dal.updateMovement(body, paintingId, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

// DELETE - DELETE /art/movements/:id
app.delete('/art/movements/:id', function(req, res, next) {
  const movementId = pathOr(null, ['params', 'id'], req)

  dal.deleteMovement(movementId, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

// LIST - GET /art/movements
app.get('/art/movements', function(req, res, next) {
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listMovements(Number(limit), lastItem, filter, function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

////////////////////
//    REPORTS
////////////////////

app.get('/art/reports/countbycity', function(req, res, next) {
  dal.getReportCBC(function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

app.get('/art/reports/countbymovement', function(req, res, next) {
  dal.getReportCBM(function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('API is running on this port: ', port))
