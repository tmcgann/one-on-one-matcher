const fs = require('fs')

function deserializeDataa(data) {
  return JSON.parse(data)
}

function loadData(filePath) {
  const string = fs.readFileSync(filePath, 'utf8')
  return deserializeDataa(string)
}
function serializeData(data) {
  return JSON.stringify(data, null, 2)
}

function writeData(filePath, data) {
  const string = serializeData(data)
  fs.writeFileSync(filePath, string, 'utf8')
}

module.exports = {
  deserializeDataa,
  loadData,
  serializeData,
  writeData,
}
