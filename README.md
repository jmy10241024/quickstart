# quickstart
## react native quickstart with rn 0.62
## yarn local
## yarn ios
### 1.AuthLoadingScreen中,目前是userInfo.user为true, 那么到主页, 如果false,那么到登录页, 必须登录才能到主页, 如果要改为打开app总是先到主页,那么改此处逻辑即可
### 2.目前,用户协议在登录页中(如果需要, 改到主页即可)
### 3.护眼模式,休息提醒,音效是否开启(封装TouchableOpacity,连接redux缓存实现),都存在缓存中, dispatch一下, 即可更改
### 4.项目中使用~相对路径,是因为安装了babel-plugin-root-import库, 并且在babel.config.js中配置了(这里面也配置了打包时移除log)
