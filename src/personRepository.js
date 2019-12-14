const { loadData, writeData } = require('./db')

const DATA_PATH = './src/data/persons.json'

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

function savePersons(persons) {
  writeData(DATA_PATH, persons)
}

module.exports = {
  createPerson,
  getPersons,
  savePersons,
}
