require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const paintingPKGenerator = require('./lib/build-primary-key')
const { assoc, pathOr } = require('ramda')

////////////////////
//  Paintings
////////////////////

const listPaintings = (limit, cb) => {
  var query = {}
  //todo - query conditionals
  query = { selector: { type: 'painting' }, limit }
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
  createDoc(painting, callback)
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
