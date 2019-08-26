# iBer_H5_v2.0

#### 香港首家保險從業人員互聯網科技平台

iBer持續為在港保險從業人員提供資源與技術支持。雲計算、大數據技術將為香港保險科技行業帶來
創新性解決方案，聚合雙線資源，構建集人才、產品、平台為一體的垂直創新體系

## 起工程步骤（npm命令）

``` bash
# 安装依赖包
npm install

# 本地构建（h5dev.iber2.com:8080）
npm run dev (npm start)

# 构建生产包
npm run build

# 构建生产包并查看分析报告
npm run build --report
```

## 各环境域名

``` bash
# 测试环境
https://mp.goodiber.com/v2/

# 预发布环境
https://expmp.goodiber.com/v2/
https://exppage.goodiber.com/v2/

# 生产环境
访问域名：https://mp.iberhk.com/v2/
分享域名：https://page.iberhk.com/v2/
```

## 各环境域名

``` bash
# jenkins内网地址：
测试环境： http://192.168.0.53:8080/jenkins/job/iBer_H5_v2.0/
预发布环境：http://192.168.0.53:8080/jenkins/job/EXP-iBer_H5_v2.0/
生产环境：http://192.168.0.53:8080/jenkins/job/Prod-iBer_H5_v2.0/

# jenkins外网地址：
测试环境： https://jenkins.ibrokerhk.com/job/iBer_H5_v2.0/
预发布环境：https://jenkins.ibrokerhk.com/job/EXP-iBer_H5_v2.0/
生产环境：https://jenkins.ibrokerhk.com/job/Prod-iBer_H5_v2.0/
```

## 注意事项

* 有新的依赖包引进或者更新依赖包需重新执行 npm run dll (webpack的dll方案，加快打包速度)

* 新引入的业务图片资源开发阶段先放本地目录(src/assets/images/对应业务目录)内，开发完后可放cdn( https://static.iberhk.com/v2/web/images/ )上