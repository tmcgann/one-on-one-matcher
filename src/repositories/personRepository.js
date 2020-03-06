const { loadData, writeData } = require('../db')
const { getId, sortByFirstName } = require('../utils/person')

const DATA_PATH = './src/data/persons.json'
const DATA_BAK_PATH = './src/data/persons.bak.json'

function createPerson(firstName, lastName, email) {
  return {
    firstName,
    lastName,
    email,
    queue: [],
  }
}

function getPersons() {
  return loadData(DATA_PATH)
}

function updatePersons(personsChanged) {
  const existingPersons = getPersons()
  writeData(DATA_BAK_PATH, existingPersons)

  const personsChangedIdSet = new Set(personsChanged.map(person => getId(person)))
  const personsUnchanged = existingPersons.filter(person => !personsChangedIdSet.has(getId(person)))
  const combinedPersons = [...personsChanged, ...personsUnchanged]
  combinedPersons.sort(sortByFirstName)

  writeData(DATA_PATH, combinedPersons)
}

module.exports = {
  createPerson,
  getPersons,
  updatePersons,
}
