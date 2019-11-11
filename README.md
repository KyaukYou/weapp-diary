### 旅行小柴配置文档

#### 1.克隆项目

#### 2.登录[微信公众平台](https://mp.weixin.qq.com)
如果没有注册需要先注册一个个人小程序
登录完成后 点击左侧 ***开发*** 找到 ***开发设置*** 可以看到你的AppID 复制下来

#### 3.修改项目参数
+ 找到根目录下的 ***project.config.json***，把24行的AppID，修改为你刚才复制的AppID

#### 4.云开发设置
+ 点击微信开发者工具左侧云开发并开通
+ 创建环境：
   - 环境名称：xxx(例如：develop)
   - 环境ID： xxx(例如：develop-0123)
+ 创建集合
   - 左上角 > 数据库 > 点击+号 > 集合名称: control  
   - 添加记录 > 添加字段 
   - 字段1: _openid: xxxxxxxxx (暂时先随便填写)
   - 字段2：showAdd {"showAdd":"block"}

+ 创建集合 bug、travel、users

#### 5.回到项目中去
   + 在***微信开发者工具中***找到根目录下的cloudfunctions文件夹，右键 > 当前环境 > 选择你当前创建的环境
   + 在***微信开发者工具中***找到根目录下的cloudfunctions文件夹下每个文件夹都右键 > 上传并部署(云端安装依赖)
   + 在***微信开发者工具中***找到根目录下的miniprogram文件夹，找到app.js文件，第十行 env: 改成你之前创建的环境ID
   + 微信开发者工具 > 清缓存 > 全部清除 ，编译
   + 小程序中点击 > 我的 > 点击登录 > 注册成功
   + 回到云开发，找到users集合，会多出一条记录，找到这条记录中 _openid 的值并复制 
   + 替换 control 中 _openid 的值

#### 5.修改代码
   + 复制云开发control集合记录的_id值
   + miniprogram > pages > index > index.js 中搜索 W87jRg6qgQy38jbV ***替换*** 刚才复制的_id
   + miniprogram > pages > my > my.js 中搜索 W87jRg6qgQy38jbV ***替换*** 刚才复制的_id
   + miniprogram > pages > travelDetail > travelDetail.js 中搜索 W87jRg6qgQy38jbV ***替换*** 刚才复制的_id

#### 6.完成
   + 编译小程序，即可新建日记   