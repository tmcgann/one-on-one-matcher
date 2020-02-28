function makePersonsString(persons) {
  return persons
    .slice()
    .sort((a, b) => (a.firstName > b.firstName ? 1 : a.firstName < b.firstName ? -1 : 0))
    .map(person => `  ${person.firstName} (${person.queue.length}) -- ${person.queue.join(', ')}\n`)
    .join('')
}

function printResults(
  personsMatched,
  personsExcluded,
  personsUnmatched,
  matches,
  originalPersons,
  updatedPersons,
) {
  const personsMatchedSorted = personsMatched.slice()
  personsMatchedSorted.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
  const personsMatchedString = personsMatchedSorted.join(', ')
  console.log(`\nMatched Persons (${personsMatched.length}):`, personsMatchedString)

  const personsExcludedSorted = personsExcluded.slice()
  personsExcludedSorted.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))
  const personsExcludedString = personsExcludedSorted.join(', ')
  console.log(`Excluded Persons (${personsExcluded.length}):`, personsExcludedString)

  const personsUnmatchedString = personsUnmatched.map(p => p.firstName).join(', ')
  console.log(`Unmatched Persons (${personsUnmatched.length}):`, personsUnmatchedString)

  const matchesString = matches
    .map(match => {
      return match.length === 2
        ? `${match[0]} -- ${match[1]}`
        : `${match[0]} -- ${match[1]} -- ${match[2]}`
    })
    .join('\n')
  console.log(`\nMatches (${matches.length}):`, `\n${matchesString}`)

  const originalPersonsString = makePersonsString(originalPersons)
  console.log(`\nOriginal Person Queues:\n${originalPersonsString}`)

  const updatedPersonsString = makePersonsString(updatedPersons)
  console.log(`\nUpdated Person Queues:\n${updatedPersonsString}`)
}

module.exports = {
  printResults,
}
