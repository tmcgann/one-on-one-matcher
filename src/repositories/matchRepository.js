const { loadData, writeData } = require('../db')

const DATA_PATH = './src/data/matches.json'

function getMatches() {
  return loadData(DATA_PATH)
}

function updateMatches(matches, exclusions) {
  const existingMatches = getMatches()
  const combinedMatches = existingMatches.slice()
  combinedMatches.unshift({
    createdAt: new Date().toISOString(),
    matches,
    exclusions: exclusions,
  })
  writeData(DATA_PATH, combinedMatches)
}

module.exports = {
  getMatches,
  updateMatches,
}
