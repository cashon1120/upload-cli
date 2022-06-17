const path = require('path')
const fs = require('fs')
const fileToObj = (filePath) => {
  filePath = path.resolve(__dirname, filePath)
  return JSON.parse(fs.readFileSync(filePath).toString())
}

const objToFile = (data, filePath) => {
  fs.writeFileSync(path.resolve(__dirname, filePath), JSON.stringify(data))
}

const getFileList = (source) => {
  const currentPath = `${process.cwd()}/${source}`
  const fileNames = fs.readdirSync(currentPath)
  const result = []
  fileNames.forEach((fileName) => {
    const stat = fs.statSync(path.join(`${currentPath}/${fileName}`))
    if (stat.isDirectory()) {
      result.push({name: fileName})
    }
  })
  return result
}


module.exports = {
  fileToObj,
  objToFile,
  getFileList
}