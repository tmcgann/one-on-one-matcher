function difference(a, b) {
  const bSet = new Set(b)
  return a.filter(aItem => !bSet.has(aItem))
}

function objectify(array, getKey = item => item.id) {
  return array.reduce((memo, item) => {
    memo[getKey(item)] = item
    return memo
  }, {})
}

function without(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

module.exports = {
  difference,
  objectify,
  without,
}
