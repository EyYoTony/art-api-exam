const {
  toLower,
  startsWith,
  slice,
  trim,
  replace,
  concat,
  compose
} = require('ramda')

// returns 'painting_persistence_of_memory'
// prefix: "painting_"  name:  "The Persistence of Memory"  =>  'painting_persistence_of_memory'

const removeAorThe = str => {
  str = toLower(str)
  return startsWith('a ', str)
    ? slice(2, Infinity, str)
    : startsWith('the ', str) ? slice(4, Infinity, str) : str
}

module.exports = prefix => name =>
  compose(trim, toLower, replace(/ /g, '_'), concat(prefix), removeAorThe)(name)
