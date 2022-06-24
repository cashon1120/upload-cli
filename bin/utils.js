const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const fileToObj = (filePath) => {
  filePath = path.resolve(__dirname, filePath)
  const fileData = fs.readFileSync(filePath).toString()
  if(!fileData){
    return {}
  }
  return JSON.parse(fileData)
}

const objToFile = (data, filePath) => {
  fs.writeFileSync(path.resolve(__dirname, filePath), JSON.stringify(data))
}

const checkFile = () => {
  const dataFilePath = path.join(__dirname, 'data.json')
  const res = fs.existsSync(dataFilePath)
  if(res){
    return dataFilePath
  }
  fs.writeFileSync(dataFilePath, '')
  return dataFilePath
}

const getFileList = (source) => {
  const existFile = fs.existsSync(source)
  if(!existFile){
    console.log(chalk.red(`没有找到该目录: ${source}`))
    return false
  }
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
  checkFile,
  getFileList
}