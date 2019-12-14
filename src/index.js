const { saveMatches } = require('./matchRepository')
const { getPersons, savePersons } = require('./personRepository')
const { objectify } = require('./utils/array')
const { makeMatches } = require('./utils/match')
const { getId, getOldestMatch, updatePersonsQueues } = require('./utils/person')

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
    iteration < persons.length &&
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

  if (personsToMatch.length === 1) {
    const person = personsToMatch.shift()
    const oldestMatch = getOldestMatch(person)
    const match = matches.find(match => match.includes(oldestMatch))
    match.push(getId(person))
  }

  console.log(`Matches (${matches.length}):`, matches)
  console.log(`Matched Persons (${personsMatchedSet.size}):`, Array.from(personsMatchedSet))
  console.log(
    `Unmatched Persons (${personsToMatch.length}):`,
    personsToMatch.map(p => p.firstName),
  )

  const updatedPersons = updatePersonsQueues(personsSorted, matches)
  savePersons(updatedPersons)
  saveMatches(matches)
}

run()
