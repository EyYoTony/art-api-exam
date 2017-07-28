require('dotenv').config()
const HTTPError = require('node-http-error')
const { propOr, assoc, split, head, last, map, omit } = require('ramda')
const mysql = require('mysql')

//////////////////////
//    HELPER FN'S
//////////////////////

const create = (tableName, data, formatter, callback) => {
  if (data) {
    const connection = createConnection()
    const sql = `INSERT INTO ${connection.escapeId(tableName)} SET ? `
    connection.query(sql, formatter(data), (err, result) => {
      if (err) return callback(err)
      propOr(null, 'insertId', result)
        ? callback(null, { ok: true, id: result.insertId })
        : callback(null, { ok: false, id: null })
    })
    connection.end(err => callback(err))
  }
}

const read = (tableName, columnName, id, formatter, callback) => {
  if (id && tableName) {
    const connection = createConnection()
    connection.query(
      'SELECT * FROM ' +
        connection.escapeId(tableName) +
        ' WHERE ' +
        connection.escapeId(columnName) +
        ' = ? ',
      [id],
      function(err, result) {
        if (err) return callback(err)
        if (propOr(0, 'length', result) > 0) {
          const formattedResult = formatter(head(result))
          console.log('Formatted Result: ', formattedResult)
          return callback(null, formattedResult)
        } else {
          return callback(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
  }
}

const update = (tableName, columnName, data, id, callback) => {
  console.log(data)
  if (data) {
    const connection = createConnection()
    data = omit('ID', data)
    const sql =
      'UPDATE ' +
      connection.escapeId(tableName) +
      ' SET ? ' +
      ' WHERE ' +
      connection.escapeId(columnName) +
      ' =  ?'
    connection.query(sql, [data, id], function(err, result) {
      if (err) return callback(err)
      console.log('Updated result: ', result)
      if (propOr(0, 'affectedRows', result) === 1) {
        return callback(null, { ok: true, id: id })
      } else if (propOr(0, 'affectedRows', result) === 0) {
        return callback(
          new HTTPError(404, 'missing', {
            name: 'not_found',
            error: 'not found',
            reason: 'missing'
          })
        )
      }
    })

    connection.end(function(err) {
      if (err) return err
    })
  } else {
    return callback(new HTTPError(400, 'Missing data for update.'))
  }
}

const deleteRow = (tableName, columnName, id, callback) => {
  if (tableName && id) {
    const connection = createConnection()

    connection.query(
      'DELETE FROM ' +
        connection.escapeId(tableName) +
        ' WHERE ' +
        connection.escapeId(columnName) +
        ' = ?',
      [id],
      function(err, result) {
        if (propOr(null, ['errno'], err) === 1451) {
          callback(
            new HTTPError(
              409,
              'corresponding animal data exists for the breed you are attempting to delete. Delete all animals with this breed to delete this breed.'
            )
          )
        }
        if (err) return callback(err)

        console.log('result', result)

        if (result && result.affectedRows === 1) {
          return callback(null, { ok: true, id: id })
        } else if (result && result.affectedRows === 0) {
          return callback(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
  } else {
    return callback(new HTTPError(400, 'Missing id or entity name.'))
  }
}

const queryDB = (
  tableName,
  lastItem,
  filter,
  limit,
  formatter,
  orderColumn,
  callback
) => {
  limit = limit ? limit : 5

  const connection = createConnection()

  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)
    const sql = `SELECT * FROM ${connection.escapeId(
      tableName
    )} WHERE ${filterField} = ? ORDER BY ${connection.escapeId(
      orderColumn
    )} LIMIT ${limit}`
    console.log('SQL: ', sql)
    connection.query(sql, [filterValue], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else if (lastItem) {
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)} WHERE ${connection.escapeId(
      orderColumn
    )} > ? ORDER BY ${connection.escapeId(orderColumn)} LIMIT ${limit}`
    console.log('SQL: ', sql)
    connection.query(sql, [lastItem], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else {
    const sql = `SELECT * FROM ${connection.escapeId(
      tableName
    )} ORDER BY ${connection.escapeId(orderColumn)} LIMIT ${limit}`
    console.log('SQL: ', sql)
    connection.query(sql, function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  }
}

const createConnection = () => {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

const dalHelper = {
  create,
  read,
  update,
  deleteRow,
  queryDB
}

module.exports = dalHelper
