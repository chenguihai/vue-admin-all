# ltzmadmin

<!-- <p>
  <a href="https://github.com/macrozheng/mall"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E5%90%8E%E5%8F%B0%E9%A1%B9%E7%9B%AE-mall-blue.svg" alt="后台项目"></a>
  <a href="http://qm.qq.com/cgi-bin/qm/qr?k=V6xu5c12j9qhnMUNdDRzakNxRKzOxibQ"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/QQ%E7%BE%A4-959351312-red.svg" alt="QQ群"></a>
  <a href="http://qm.qq.com/cgi-bin/qm/qr?k=M5Edq2TiJL_ShcOEeYjwcmdGmq4zZrd_"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/QQ%E7%BE%A4-553018255-red.svg" alt="QQ群"></a>
  <a href="https://gitee.com/macrozheng/mall-admin-web"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E7%A0%81%E4%BA%91-%E9%A1%B9%E7%9B%AE%E5%9C%B0%E5%9D%80-orange.svg" alt="码云"></a>
</p> -->

## 前言

该项目为前后端分离项目的前端部分，后端项目`mall`地址：[传送门](https://github.com/phpapi/ltzmadmin)。

## 项目介绍

`ltzmadmin`是一个电商后台管理系统的前端项目，基于 Vue+Element 实现。
主要包括用户管理、店铺管理、内容管理、订单管理、资金管理、工具市场、系统设置等功能。

### 项目演示

项目在线演示地址：[http://47.106.240.143:8082](http://47.106.240.143:8082)

### 技术选型

| 技术              | 说明                    | 官网                                                                                               |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| Vue               | 前端框架                | [https://vuejs.org/](https://vuejs.org/)                                                           |
| Vue-router        | 路由框架                | [https://router.vuejs.org/](https://router.vuejs.org/)                                             |
| Vuex              | 全局状态管理框架        | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)                                                 |
| Element           | 前端 UI 框架            | [https://element.eleme.io/](https://element.eleme.io/)                                             |
| Axios             | 前端 HTTP 框架          | [https://github.com/axios/axios](https://github.com/axios/axios)                                   |
| v-charts          | 基于 Echarts 的图表框架 | [https://v-charts.js.org/](https://v-charts.js.org/)                                               |
| Js-cookie         | cookie 管理工具         | [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)                   |
| nprogress         | 进度条控件              | [https://github.com/rstacruz/nprogress](https://github.com/rstacruz/nprogress)                     |
| vue-element-admin | 项目脚手架参考          | [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) |

### 项目布局

```lua
src -- 源码目录
├── api -- axios网络请求定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── router -- vue-router路由配置
├── store -- vuex的状态管理
├── styles -- 全局css样式
├── utils -- 工具类
└── views -- 前端页面
    ├── home -- 首页
    ├── layout -- 通用页面加载框架
    ├── login -- 登录页
    ├── oms -- 订单管理页面
    ├── pms -- 资金管理页面
    └── article -- 文章管理模块页面
    ├── conduct -- 用户管理
    └── Shopconduct --店铺管理
    ├── cms -- 内容管理
    └── tool -- 工具市场
    └── system -- 系统设置
```

## 搭建步骤

- 下载 node 并安装：[https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi](https://nodejs.org/dist/v8.9.4/node-v8.9.4-x64.msi);
- 该项目为前后端分离项目，访问本地访问接口需搭建后台环境，搭建请参考后端项目[传送门](https://github.com/phpapi/ltzmadmin);
- 访问在线接口无需搭建后台环境，只需将 config/dev.env.js 文件中的 BASE_API 改为[http://47.106.240.143/api/admin](http://47.106.240.143/api/admin)即可;
- 克隆源代码到本地，使用 IDEA 打开，并完成编译;
- 在 IDEA 命令行中运行命令：npm install,下载相关依赖;
- 在 IDEA 命令行中运行命令：npm run dev,运行项目;
- 访问地址：[http://localhost:8080](http://localhost:8080) 即可打开后台管理系统页面;
- 如果遇到无法运行该命令，需要配置 npm 的环境变量，如在 path 变量中添加：C:\Users\zhenghong\AppData\Roaming\npm。

## 许可证

[Apache License 2.0](https://github.com/macrozheng/mall-admin-web/blob/master/LICENSE)

Copyright (c) 2018-2019 macrozheng
富文本用的是tinymce 5.2.0版本

描述 4-250字
名称
