const { objectify } = require('./array')

function computeUpdatedQueue(person, recentlyMatchedPersonIds) {
  // Remove null or undefined entries; also remove self
  const recentlyMatchedPersonIdsNormalized = recentlyMatchedPersonIds.filter(
    personId => personId != null && personId !== getId(person),
  )
  // Reduce the existing queue to those persons with which the person did not recently match with.
  const newQueue = person.queue.filter(
    personId => !recentlyMatchedPersonIdsNormalized.includes(personId),
  )
  // Add the new matches to the front of the queue (doesn't make sense in queue terms, should probably reverse everything to put them at the back of the queue, but is what it is for now.)
  newQueue.unshift(...recentlyMatchedPersonIdsNormalized)

  return newQueue
}

function getId(person) {
  return person.firstName
}

function getOldestMatch(person, offset = 0) {
  const index = person.queue.length - (1 + offset)
  return person.queue[index]
}

function getOldestUnmatchedMatch(person, personBlacklistSet) {
  let offset = 0
  let oldestMatch = getOldestMatch(person, offset)

  while (personBlacklistSet.has(oldestMatch)) {
    oldestMatch = getOldestMatch(person, offset)
    offset++
  }

  return oldestMatch
}

function getPersonWithShortestQueue(persons) {
  return persons.reduce((memo, person) => {
    return memo.queue.length >= person.queue.length ? memo : person
  }, persons[0])
}

function getPersonsToMatch(persons, personBlacklistSet) {
  return persons.filter(person => {
    // const personIsNotAlreadyMatched = !personsMatchedSet.has(getId(person))
    // const personIsNotExcluded = !personsExcludedSet.has(getId(person))
    // return personIsNotAlreadyMatched && personIsNotExcluded
    return !personBlacklistSet.has(getId(person))
  })
}

function sortByFirstName(a, b) {
  return a.firstName > b.firstName ? 1 : a.firstName < b.firstName ? -1 : 0
}

function updatePersonsQueues(persons, matches) {
  const personsDict = objectify(persons, getId)
  return matches.reduce((memo, match) => {
    const [personIdA, personIdB, personIdC] = match

    const personA = personsDict[personIdA]
    const personB = personsDict[personIdB]
    const newPersonA = {
      ...personA,
      queue: computeUpdatedQueue(personA, [personIdB, personIdC]),
    }
    const newPersonB = {
      ...personB,
      queue: computeUpdatedQueue(personB, [personIdC, personIdA]),
    }
    memo.push(newPersonA, newPersonB)

    if (personIdC) {
      const personC = personsDict[personIdC]
      const newPersonC = {
        ...personC,
        queue: computeUpdatedQueue(personC, [personIdA, personIdB]),
      }
      memo.push(newPersonC)
    }

    return memo
  }, [])
}

module.exports = {
  getId,
  getOldestMatch,
  getOldestUnmatchedMatch,
  getPersonWithShortestQueue,
  getPersonsToMatch,
  sortByFirstName,
  updatePersonsQueues,
}
