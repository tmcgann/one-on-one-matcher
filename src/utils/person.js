const { objectify } = require('./array')

function computeUpdatedQueue(queue, otherPersonIds) {
  const otherPersonIdsNormalized = otherPersonIds.filter(personId => personId != null)
  const newQueue = queue.filter(personId => !otherPersonIdsNormalized.includes(personId))
  newQueue.unshift(...otherPersonIdsNormalized)
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

function updatePersonsQueues(persons, matches) {
  const personsDict = objectify(persons, getId)
  return matches.reduce((memo, match) => {
    const [personIdA, personIdB, personIdC] = match

    const personA = personsDict[personIdA]
    const personB = personsDict[personIdB]
    const newPersonA = {
      ...personA,
      queue: computeUpdatedQueue(personA.queue, [personIdB, personIdC]),
    }
    const newPersonB = {
      ...personB,
      queue: computeUpdatedQueue(personB.queue, [personIdC, personIdA]),
    }
    memo.push(newPersonA, newPersonB)

    if (personIdC) {
      const personC = personsDict[personIdC]
      const newPersonC = {
        ...personC,
        queue: computeUpdatedQueue(personB.queue, [personIdA, personIdB]),
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
  updatePersonsQueues,
}
