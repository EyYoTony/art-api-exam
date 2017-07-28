const mysql = require('mysql')
const HTTPError = require('node-http-error')
const dalHelper = require('./lib/dal-helper')
const { assoc, prop, compose, omit, pathOr } = require('ramda')

//////////////////////
//     PAINTINGS
//////////////////////

const createPainting = (painting, callback) => {
  dalHelper.create('painting', painting, prepSQLCreate, callback)
}

const getPainting = (paintingId, callback) => {
  dalHelper.read(
    'painting',
    'ID',
    paintingId,
    formatSQLtoCouch('painting'),
    callback
  )
}

const updatePainting = (painting, id, callback) => {
  dalHelper.update('painting', 'ID', prepSQLUpdate(painting), id, callback)
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
    formatSQLtoCouch('painting'),
    'ID',
    callback
  )
}

//////////////////////
//    FORMATTERS
//////////////////////

const prepSQLCreate = data =>
  compose(
    omit('museum'),
    x => assoc('museumLocation', pathOr('N/A', ['museum', 'location'], x), x),
    x => assoc('museumName', pathOr('N/A', ['museum', 'name'], x), x),
    omit('type')
  )(data)
const prepSQLUpdate = data =>
  compose(
    omit('museum'),
    x => assoc('museumLocation', pathOr('N/A', ['museum', 'location'], x), x),
    x => assoc('museumName', pathOr('N/A', ['museum', 'name'], x), x),
    omit('_id'),
    assoc('ID', data['_id']),
    omit('_rev'),
    omit('type')
  )(data)
const formatSQLtoCouch = type => data =>
  compose(
    omit('ID'),
    assoc('_id', data['ID']),
    assoc('_rev', null),
    assoc('type', type)
  )(data)

//////////////////////
//     EXPORT
//////////////////////

const dal = {
  createPainting,
  getPainting,
  updatePainting,
  deletePainting,
  listPaintings
}

module.exports = dal
