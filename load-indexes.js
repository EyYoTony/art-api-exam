require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

db
  .createIndex({ index: { fields: ['type'] } })
  .then(() => console.log("Created Index on the 'type' property"))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['movement'] } })
  .then(() => console.log("Created Index on the 'movement' property"))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['artist'] } })
  .then(() => console.log("Created Index on the 'artist' property"))
  .catch(err => console.log(err))

db
  .createIndex({ index: { fields: ['yearCreated'] } })
  .then(() => console.log("Created Index on the 'yearCreated' property"))
  .catch(err => console.log(err))
