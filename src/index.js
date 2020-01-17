const { saveMatches } = require('./repositories/matchRepository')
const { getPersons, savePersons } = require('./repositories/personRepository')
const { objectify } = require('./utils/array')
const { makeMatches } = require('./utils/match')
const { getId, getOldestMatch, updatePersonsQueues } = require('./utils/person')
const { printResults } = require('./utils/printer')

function run() {
  // Set up matches
  const matches = []
  const personsMatchedSet = new Set()

  // Get person data
  const persons = getPersons()
  const personDict = objectify(persons, getId)

  // Order persons by longest queue descending
  const personsSorted = persons.slice()
  personsSorted.sort((a, b) => b.queue.length - a.queue.length)

  // Make some matches
  let iteration = 1
  let personsToMatch = personsSorted.filter(person => !personsMatchedSet.has(getId(person)))
  while (
    iteration < persons.length && // To prevent infinite iteration in the event of a bug, cap how many times we iterate
    personsMatchedSet.size !== persons.length &&
    personsToMatch.length > 1
  ) {
    console.log(`Iteration ${iteration}: ${personsToMatch.map(p => getId(p))}`)
    const matchData = makeMatches(personDict, personsMatchedSet, personsToMatch)

    matches.push(...matchData.matches)
    matchData.personsMatched.forEach(p => personsMatchedSet.add(p))

    personsToMatch = personsSorted.filter(person => !personsMatchedSet.has(getId(person)))
    iteration++
  }

  // IF there are an odd number of people to match and someone is left out with no match
  // THEN make a threesome and put that person with their oldest match
  if (personsToMatch.length === 1) {
    const person = personsToMatch.shift()
    const oldestMatch = getOldestMatch(person)
    const match = matches.find(match => match.includes(oldestMatch))
    match.push(getId(person))
  }

  printResults(matches, Array.from(personsMatchedSet), personsToMatch)

  const updatedPersons = updatePersonsQueues(personsSorted, matches)
  savePersons(updatedPersons)
  saveMatches(matches)
}

run()
