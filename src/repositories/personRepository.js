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
    disabled: false,
  }
}

/**
 * NOT SURE IF THIS WORKS. HAVE NOT TESTED. Deactivate a person and remove them from all other persons' queues.
 *
 * @param {string} email
 */
function deactivatePersonByEmail(email) {
  const persons = getPersons()

  // Deactivate person (mutating person. yuck!)
  const deactivatedPerson = persons.find(person => person.email === email)
  deactivatedPerson.disabled = true

  // Remove deactivated person from all other persons' queues (mutating person. yuck!)
  persons.forEach(person => {
    person.queue = person.queue.filter(firstName => firstName !== deactivatedPerson.firstName)
  })

  updatePersons(persons)
}

function getActivePersons() {
  return getPersons().filter(person => !person.disabled)
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
  deactivatePersonByEmail,
  getActivePersons,
  updatePersons,
}
