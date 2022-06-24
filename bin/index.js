#!/usr/bin/env node

const chalk = require('chalk'); //命令行输出样式美化
const {Command} = require('commander'); //命令行工具
const inquirer = require('inquirer'); //命令行交互
const {uploadFileToServer} = require('./uploadFile')
const {version} = require('../package.json');
const {fileToObj, objToFile, getFileList, checkFile} = require('./utils')
const projectMap = fileToObj(checkFile())
const program = new Command();

program
  .option('i, init', '初始化项目')
  .option('ls, list', '查看已有项目')
  .option('d, delete', '删除项目')
  .option('up, update', '更新项目配置信息')
  .option('detail', '查看项目详情')
  .option('p, push -list|-ls', '上传包')

const options = [
  {
    type: 'input',
    name: 'host',
    message: '请输入服务器地址'
  }, {
    type: 'input',
    name: 'port',
    value: 22,
    message: '请输入端口号'
  }, {
    type: 'input',
    name: 'username',
    value: root,
    message: '请输入账号'
  }, {
    type: 'input',
    name: 'password',
    message: '请输入密码'
  }, {
    type: 'input',
    name: 'source',
    message: '请输入本地目录'
  }, {
    type: 'input',
    name: 'target',
    message: '请输入目标地址'
  }
]

let settingParams = {
  host: '',
  port: '',
  username: '',
  password: '',
  source: '',
  target: ''
}

async function getUserInput(index, isUpdate = false) {
  const projectName = process.cwd()
  if(!isUpdate && projectMap[projectName]){
    console.log(chalk.red('已添加该项目目'))
    return
  }

  if(isUpdate && !projectMap[projectName]){
    console.log(chalk.red('还没有设置项目信息'))
    return
  }

  let response = await inquirer.prompt({
    ...options[index],
    default: projectMap[projectName]
      ? projectMap[projectName][options[index].name]
      : undefined
  })
  if (!response[options[index].name]) {
    console.log(chalk.red('输入项不能为空,请重新输入'))
    getUserInput(index, isUpdate)
    return
  }
  settingParams[options[index].name] = response[options[index].name]
  if (index < options.length - 1) {
    index++ 
    await getUserInput(index, isUpdate)
  } else {
    if (projectName) {
      settingParams.projectName = projectName
    }
    projectMap[settingParams.projectName] = settingParams
    objToFile(projectMap, './data.json')
    console.log(chalk.green(`设置成功`))
  }
}

program.version(version, '-v, --version')
program
  .command('init')
  .alias('i')
  .action(async() => {
    getUserInput(0)
  });

program
  .command('list')
  .alias('ls')
  .action(() => {
    console.log(`项目列表(共${Object.keys(projectMap).length}个)`)
    Object
      .keys(projectMap)
      .forEach((key) => {
        console.log('* ', chalk.green(key))
      })
  })

program
  .command('delete')
  .alias('d')
  .action(async() => {
    const projectList = []
    Object.keys(projectMap).forEach((key) => {
      projectList.push({name: key})
    })
    inquirer
        .prompt({type: 'list', message: '请选择要删除的项目路径:', name: 'projectName', choices: projectList})
        .then((result) => {
          const {projectName} = result
          if (projectMap[projectName]) {
            delete projectMap[projectName]
            objToFile(projectMap, './data.json')
            console.log(chalk.green(`删除成功`))
          } else {
            console.log(chalk.yellow(`没有该项目 "${projectName}" 目配置信息`))
          }
        })
  })

program
  .command('update')
  .alias('up')
  .action(async() => {
    const projectName = process.cwd()
    if (projectMap[projectName]) {
      getUserInput(0, true)
    } else {
      console.log(chalk.yellow(`没有该项目 "${projectName}" 目配置信息`))
    }
  })

program
  .command('detail')
  .action(async() => {
    const projectName = process.cwd()
    if (projectMap[projectName]) {
      Object
        .keys(projectMap[projectName])
        .forEach((key) => {
          console.log(chalk.green(`${key}: ${projectMap[projectName][key]}`))
        })
    } else {
      console.log(chalk.yellow(`没有该项目 "${projectName}" 目配置信息`))
    }
  })

program
  .command('push')
  .alias('p')
  .option('-list, -ls', '是否选择列表上传')
  .action(async(cmdObj) => {
    const projectName = process.cwd()
    if (projectMap[projectName]) {
      const {source} = projectMap[projectName]
      if(cmdObj.List || cmdObj.Ls){
        const list = getFileList(source)
        if (!list || list.length === 0) {
          console.log(chalk.red('../dist 目录下还没有打包文件, 请先打包'))
        } else {
          inquirer
          .prompt({type: 'list', message: '请选择打包文件:', name: 'bundleName', choices: getFileList(source)})
          .then((result) => {
            const {bundleName} = result
            uploadFileToServer(`${process.cwd()}/${source}/${bundleName}`, projectMap[projectName])
          })
        }
      }else{
        uploadFileToServer(`${process.cwd()}/${source}`, projectMap[projectName])
      }
      
    } else {
      console.log(chalk.yellow(`没有该项目 "${projectName}" 目配置信息`))
    }

  })

program.parse(process.argv);

module.exports = {}
