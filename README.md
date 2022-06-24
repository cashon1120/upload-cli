### 本地上传打包文件
个人小项目使用， 没有单独的CI/CD环境， 就是单纯的上传打包文件到服务器，自己配置

#### 安装
```
npm i @cashon/uploadcli -g
```

#### 使用
在项目根目录输入以下命令， 按提示配置必要参数
```
uploadcli init
```
##### 上传文件
```
uploadcli push
或
upload push -list
```
注: 默认是直接上传打包文件下的文件，一般为dist目录， 如果带了-list参数会在dist文件夹下再选择目录进行上传，这需要配合打包配置，如每次打包都在dist目录下生成一个新的版本， 上传的时候再去选择对应的版本，可用于回退等操作

##### 查看所有命令
```
uploadcli -h
```

