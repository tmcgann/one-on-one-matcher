const { difference } = require('./array')
const { getId, getOldestUnmatchedMatch, getPersonWithShortestQueue } = require('./person')

function makeMatches(allPersonsDict, personBlacklistSet, personsToMatch) {
  const newMatches = []
  const newPersonsMatchedSet = new Set()

  personsToMatch.forEach(person => {
    // IF this person was newly matched THEN return
    if (newPersonsMatchedSet.has(getId(person))) {
      return
    }

    // IF this person has never matched with another person who is not already matched
    // THEN match this person with that other person and return
    const allOtherPersonsNotAlreadyMatched = Object.keys(allPersonsDict).filter(
      personId =>
        !personBlacklistSet.has(personId) &&
        !newPersonsMatchedSet.has(personId) &&
        personId !== getId(person),
    )
    const neverMatchedPersonIds = difference(allOtherPersonsNotAlreadyMatched, person.queue)
    if (neverMatchedPersonIds.length) {
      const neverMatchedPersons = neverMatchedPersonIds.map(personId => allPersonsDict[personId])
      const neverMatchedPerson = getPersonWithShortestQueue(neverMatchedPersons)
      updateNewMatches(getId(person), getId(neverMatchedPerson))
      return
    }

    // IF this person does NOT have any kind of unmatched match (i.e. there are no possible matches) THEN return
    const oldestMatch = getOldestUnmatchedMatch(person, personBlacklistSet)
    if (!oldestMatch || newPersonsMatchedSet.has(oldestMatch)) {
      return
    }

    // IF this person's unmatched match also matches them back
    // THEN match them together and return
    const oldestMatchPerson = allPersonsDict[oldestMatch]
    const oldestMatchOfOldestMatch = getOldestUnmatchedMatch(oldestMatchPerson, personBlacklistSet)
    if (
      !newPersonsMatchedSet.has(oldestMatchOfOldestMatch) &&
      getId(person) === oldestMatchOfOldestMatch
    ) {
      updateNewMatches(getId(person), oldestMatch)
      return
    }
  })

  return {
    matches: newMatches,
    personsMatched: Array.from(newPersonsMatchedSet),
  }

  function updateNewMatches(personA, personB) {
    newMatches.push([personA, personB])
    newPersonsMatchedSet.add(personA)
    newPersonsMatchedSet.add(personB)
  }
}

module.exports = {
  makeMatches,
}
