const argv = require('yargs').argv

const { updateMatches } = require('./repositories/matchRepository')
const { getActivePersons, updatePersons } = require('./repositories/personRepository')
const { objectify } = require('./utils/array')
const { makeMatches } = require('./utils/match')
const {
  getId,
  getOldestUnmatchedMatch,
  getPersonsToMatch,
  updatePersonsQueues,
} = require('./utils/person')
const { printResults } = require('./utils/printer')

function makeOptions(args) {
  const exclusions = Array.isArray(args.exclude)
    ? args.exclude
    : typeof args.exclude === 'string'
    ? args.exclude.split(',').map(exclusion => exclusion.trim())
    : []

  return {
    exclusions,
    skipSave: args.dryRun || args.skipSave || false,
  }
}

function run(options = {}) {
  // Set up matches
  const matches = []
  const personsMatchedSet = new Set()
  const personsExcludedSet = new Set(options.exclusions)

  // Get person data
  const persons = getActivePersons()
  const personDict = objectify(persons, getId)

  // Order persons by longest queue descending
  const personsSorted = persons.slice()
  personsSorted.sort((a, b) => b.queue.length - a.queue.length)

  // Make some matches
  let iteration = 1
  let personsToMatch = getPersonsToMatch(
    personsSorted,
    new Set([...personsMatchedSet, ...personsExcludedSet]),
  )

  while (
    iteration < persons.length && // To prevent infinite iteration in the event of a bug, cap how many times we iterate
    personsMatchedSet.size !== persons.length &&
    personsToMatch.length > 1
  ) {
    console.log(`Iteration ${iteration}: ${personsToMatch.map(p => getId(p))}`)
    const matchData = makeMatches(
      personDict,
      new Set([...personsMatchedSet, ...personsExcludedSet]),
      personsToMatch,
    )

    matches.push(...matchData.matches)
    matchData.personsMatched.forEach(p => personsMatchedSet.add(p))

    // personsToMatch = personsSorted.filter(person => !personsMatchedSet.has(getId(person)))
    personsToMatch = getPersonsToMatch(
      personsSorted,
      new Set([...personsMatchedSet, ...personsExcludedSet]),
    )
    iteration++
  }

  // IF there are an odd number of people to match and someone is left out with no match
  // THEN make a threesome and put that person with their oldest match
  if (personsToMatch.length === 1) {
    const person = personsToMatch.shift()
    const oldestMatch = getOldestUnmatchedMatch(person, personsExcludedSet)
    const match = matches.find(match => match.includes(oldestMatch))
    match.push(getId(person))
  }

  const updatedPersons = updatePersonsQueues(personsSorted, matches)
  printResults(
    Array.from(personsMatchedSet),
    Array.from(personsExcludedSet),
    personsToMatch,
    matches,
    persons,
    updatedPersons,
  )

  if (!options.skipSave) {
    const exclusionsSorted = options.exclusions.slice()
    exclusionsSorted.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))

    updatePersons(updatedPersons)
    updateMatches(matches, exclusionsSorted)
  }
}

console.log(`Options:`, makeOptions(argv), `\n`)
run(makeOptions(argv))
