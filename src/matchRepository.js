const { loadData, writeData } = require('./db')

const DATA_PATH = './src/data/matches.json'

function getMatches() {
  return loadData(DATA_PATH)
}

function saveMatches(matches) {
  const existingMatches = getMatches()
  const combinedMatches = existingMatches.concat({
    createdAt: new Date().toISOString(),
    matches,
  })
  writeData(DATA_PATH, combinedMatches)
}

module.exports = {
  getMatches,
  saveMatches,
}
