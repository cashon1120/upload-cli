
const SftpClient = require('ssh2-sftp-client')
const chalk = require('chalk');

async function uploadFileToServer(src, uploadParams) {
  const {host, port, username, password, source, target} = uploadParams
  const client = new SftpClient();
  try {
    await client.connect({
      host,
      port,
      username,
      password
    });
    console.log('服务器连接成功')
    client.on('upload', info => {
      console.log(`正在上传文件: ${chalk.green(info.source.replace(source, ''))}`);
    });
    let rslt = await client.uploadDir(src, target);
    return rslt;
  } catch (err) {
    console.error(chalk.red('上传出错: ', err));
  } finally {
    client.end();
  }
}


module.exports = {
  uploadFileToServer
}

