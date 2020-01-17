function printResults(matches, personsMatched, personsUnmatched) {
  const matchesString = matches.map(match => {
    return match.length === 2 ? `${match[0]} -- ${match[1]}` : `${match[0]} -- ${match[1]} -- ${match[2]}`
  }).join('\n')
  console.log(`\nMatches (${matches.length}):`, `\n${matchesString}`)

  const personsMatchedString = personsMatched.join(', ')
  console.log(`\nMatched Persons (${personsMatched.length}):`, personsMatchedString)

  const personsUnmatchedString = personsUnmatched.map(p => p.firstName).join(', ')
  console.log(`\nUnmatched Persons (${personsUnmatched.length}):`, personsUnmatchedString)
}

module.exports = {
  printResults,
}
