# 达人管理系统前端开发文档

## 1. 项目概述

### 1.1 项目简介
本项目是一个达人管理系统的前端部分，主要用于管理和对接网红达人资源，实现达人信息管理、邀约合作等功能。

### 1.2 技术栈
- 前端框架：React/Vue.js
- UI 组件库：Ant Design/Element UI
- 状态管理：Redux/Vuex
- 路由管理：React Router/Vue Router
- HTTP 请求：Axios
- 代码规范：ESLint + Prettier

## 2. 功能模块

### 2.1 用户认证模块
#### 2.1.1 登录
- 账号密码登录
- 手机验证码登录
- 记住密码功能
- Token 管理

#### 2.1.2 注册
- 手机号注册
- 邮箱注册
- 验证码验证
- 用户协议

### 2.2 账号管理模块
- 账号信息维护
- 密码修改
- 角色权限管理
- 账号状态管理

### 2.3 达人管理模块
#### 2.3.1 达人信息
- 达人基础信息
- 平台数据统计
- 历史合作记录
- 标签管理

#### 2.3.2 达人筛选
- 多维度筛选
- 数据排序
- 标签筛选
- 自定义筛选条件

### 2.4 邀约管理模块
#### 2.4.1 批量邀约
- 批量选择达人
- 邀约模板管理
- 批量发送���能
- 发送记录查询

#### 2.4.2 定向邀约
- 个性化邀约
- 邀约进度跟踪
- 沟通记录
- 状态管理

### 2.5 私信模块
- 实时消息
- 消息历史
- 消息模板
- 附件发送

### 2.6 黑名单管理
- 黑名单添加
- 黑名单移除
- 原因记录
- 黑名单查询

### 2.7 个人中心
- 个人信息管理
- 消息通知
- 操作记录
- 系统设置

## 3. 页面路由设计 

javascript
const routes = [
{
path: '/login',
component: Login
},
{
path: '/register',
component: Register
},
{
path: '/dashboard',
component: Dashboard,
children: [
{
path: 'account',
component: AccountManagement
},
{
path: 'influencers',
component: InfluencerList
},
{
path: 'invitation',
component: InvitationManagement
},
{
path: 'chat',
component: ChatSystem
},
{
path: 'blacklist',
component: Blacklist
},
{
path: 'profile',
component: UserProfile
}
]
}
]

## 4. 数据接口设计

### 4.1 用户相关接口
javascript
// 用户登录
POST /api/user/login
// 用户注册
POST /api/user/register
// 获取用户信息
GET /api/user/info
// 更新用户信息
PUT /api/user/info

### 4.2 达人相关接口
javascript
// 获取达人列表
GET /api/influencer/list
// 获取达人详情
GET /api/influencer/:id
// 更新达人信息
PUT /api/influencer/:id
// 添加到黑名单
POST /api/influencer/blacklist


### 4.3 邀约相关接口
javascript
// 批量邀约
POST /api/invitation/batch
// 获取邀约记录
GET /api/invitation/list
// 更新邀约状态
PUT /api/invitation/:id


## 5. 开发规范

### 5.1 命名规范
- 组件名：PascalCase
- 文件名：kebab-case
- 变量名：camelCase
- 常量名：UPPER_CASE

### 5.2 目录结构
src/
├── assets/ # 静态资源
├── components/ # 公共组件
├── pages/ # 页面组件
├── services/ # API 服务
├── store/ # 状态管理
├── utils/ # 工具函数
├── router/ # 路由配置
└── App.js # 根组件


### 5.3 代码提交规范
- feat: 新功能
- fix: 修复问题
- docs: 文档修改
- style: 代码格式修改
- refactor: 代码重构
- test: 测试用例
- chore: 其他修改

## 6. 开发环境搭建

### 6.1 必要条件
- Node.js >= 14.0.0
- npm >= 6.0.0
- Git

### 6.2 启动步骤
bash

克隆项目
git clone [repository-url]
安装依赖
npm install
启动开发服务器
npm run dev
构建生产环境
npm run build

## 7. 部署说明

### 7.1 构建
bash
npm run build

### 7.2 部署
- 将 dist 目录下的文件部署到 Web 服务器
- 配置 nginx 反向代理
- 确保路由重写规则正确

## 8. 注意事项

1. 所有 API 请求需要携带 token
2. 注意数据安全性，敏感信息加密处理
3. 注意性能优化，合理使用缓存
4. 保持代码整洁，遵循开发规范
5. 及时更新文档
