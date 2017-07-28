const mysql = require('mysql')
const HTTPError = require('node-http-error')
const dalHelper = require('./lib/dal-helper')
const { assoc, prop, compose, omit, pathOr } = require('ramda')

//////////////////////
//     PAINTINGS
//////////////////////

const createPainting = (painting, callback) => {
  dalHelper.create('painting', painting, prepPaintingSQLCreate, callback)
}

const getPainting = (paintingId, callback) => {
  dalHelper.read(
    'painting',
    'ID',
    paintingId,
    formatPaintingSQLtoCouch('painting'),
    callback
  )
}

const updatePainting = (painting, id, callback) => {
  dalHelper.update(
    'painting',
    'ID',
    prepPaintingSQLUpdate(painting),
    id,
    callback
  )
}

const deletePainting = (paintingId, callback) => {
  dalHelper.deleteRow('painting', 'ID', paintingId, callback)
}

const listPaintings = (limit, lastItem, filter, callback) => {
  dalHelper.queryDB(
    'painting',
    lastItem,
    filter,
    limit,
    formatPaintingSQLtoCouch('painting'),
    'ID',
    callback
  )
}

//////////////////////
//     MOVEMENTS
//////////////////////

const createMovement = (movement, callback) => {
  dalHelper.create('movement', movement, returnSelf, callback)
}

const getMovement = (movementId, callback) => {
  dalHelper.read('movement', 'ID', movementId, returnSelf, callback)
}

const updateMovement = (movement, id, callback) => {
  dalHelper.update('movement', 'ID', movement, id, callback)
}

const deleteMovement = (movementId, callback) => {
  dalHelper.deleteRow('movement', 'ID', movementId, callback)
}

const listMovements = (limit, lastItem, filter, callback) => {
  dalHelper.queryDB(
    'movement',
    lastItem,
    filter,
    limit,
    returnSelf,
    'ID',
    callback
  )
}

//////////////////////
//    FORMATTERS
//////////////////////
const returnSelf = data => data

const prepPaintingSQLCreate = data =>
  compose(
    omit('museum'),
    omit('type'),
    omit('movement'),
    x => assoc('museumLocation', pathOr('N/A', ['museum', 'location'], x), x),
    x => assoc('museumName', pathOr('N/A', ['museum', 'name'], x), x),
    x => assoc('movementId', x['movement'], x)
  )(data)
const prepPaintingSQLUpdate = data =>
  compose(
    omit('_id'),
    omit('_rev'),
    omit('type'),
    omit('movement'),
    omit('museum'),
    x => assoc('museumLocation', pathOr('N/A', ['museum', 'location'], x), x),
    x => assoc('museumName', pathOr('N/A', ['museum', 'name'], x), x),
    x => assoc('movementId', x['movement'], x),
    assoc('ID', data['_id'])
  )(data)
const formatPaintingSQLtoCouch = type => data => {
  const museum = { name: data['museumName'], location: data['museumLocation'] }
  const compObj = compose(
    omit('ID'),
    omit('museumName'),
    omit('museumLocation'),
    assoc('_id', data['ID']),
    assoc('_rev', null),
    assoc('type', type)
  )(data)
  return assoc('museum', museum, compObj)
}

//////////////////////
//     REPORTS
//////////////////////

const getReportCBC = callback => {
  const connection = createConnection()
  connection.query(`SELECT * FROM art.vcountbycity`, function(err, result) {
    if (err) return callback(err)
    return callback(null, {
      reportName: 'Painting count by city',
      reportData: result
    })
  })
}

const getReportCBM = callback => {
  const connection = createConnection()
  connection.query(`SELECT * FROM art.vcountbymovement`, function(err, result) {
    if (err) return callback(err)
    return callback(null, {
      reportName: 'Painting count by movement',
      reportData: result
    })
  })
}

const createConnection = () => {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

//////////////////////
//     EXPORT
//////////////////////

const dal = {
  createPainting,
  getPainting,
  updatePainting,
  deletePainting,
  listPaintings,
  createMovement,
  getMovement,
  updateMovement,
  deleteMovement,
  listMovements,
  getReportCBC,
  getReportCBM
}

module.exports = dal
