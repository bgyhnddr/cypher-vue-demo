# vuexp

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

数据库默认用sqlite

使用
npm install sqlite3 安装sqlite(windows环境下请保证安装了framework2.0和python2.7，python2.7需添加到path路径

如果不使用sqlite 请在程序中更改src/db/sequelize.js

ui默认使用vux

首次打开系统请使用localhost:8080/init初始化数据库

管理员账号admin默认密码admin

管理地址localhost:8080/#!/admin

系统默认只有RBAC管理