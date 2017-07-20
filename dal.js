require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const paintingPKGenerator = require('./lib/build-primary-key')
const { assoc, pathOr, split, last, head } = require('ramda')

////////////////////
//  Paintings
////////////////////

const listPaintings = (limit, lastItem, filter, cb) => {
  var query = {}
  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = isNaN(Number(last(arrFilter)))
      ? last(arrFilter)
      : Number(last(arrFilter))
    const selectorValue = assoc(filterField, filterValue, {})
    query = { selector: selectorValue, limit }
  } else if (lastItem) {
    query = { selector: { _id: { $gt: lastItem }, type: 'painting' }, limit }
  } else {
    query = { selector: { _id: { $gte: null }, type: 'painting' }, limit }
  }

  find(query, function(err, data) {
    if (err) return cb(err)
    cb(null, data.docs)
  })
}

const getPainting = (id, cb) => {
  db.get(id, function(err, doc) {
    if (err) return cb(err)
    cb(null, doc)
  })
}

const createPainting = (painting, cb) => {
  const name = pathOr('', ['name'], painting)
  const pk = paintingPKGenerator('painting_')(name)
  console.log(pk)
  painting = assoc('_id', pk, painting)
  painting = assoc('type', 'painting', painting)
  createDoc(painting, cb)
}

const updatePainting = (painting, cb) => {
  painting = assoc('type', 'painting', painting)
  createDoc(painting, cb)
}

const deletePainting = (id, cb) => {
  deleteDoc(id, cb)
}

////////////////////
//  Helper/Export
////////////////////

function deleteDoc(id, callback) {
  db
    .get(id)
    .then(function(doc) {
      return db.remove(doc)
    })
    .then(function(result) {
      callback(null, result)
    })
    .catch(function(err) {
      callback(err)
    })
}

function createDoc(doc, callback) {
  console.log('createDoc', doc)
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}

function find(query, cb) {
  console.log('query', JSON.stringify(query, null, 2))
  query ? db.find(query, cb) : cb(null, [])
}

const dal = {
  listPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting
}

module.exports = dal
