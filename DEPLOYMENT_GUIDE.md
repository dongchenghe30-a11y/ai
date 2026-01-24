# 🚀 AI Resume Builder 完整部署教程（新手专用）

> **零基础也能学会！** 每一步都有详细说明和截图提示

---

## 📖 目录

1. [准备阶段](#准备阶段)
2. [本地测试](#本地测试)
3. [注册Cloudflare](#注册cloudflare)
4. [配置AI功能](#配置ai功能)
5. [部署后端](#部署后端)
6. [部署前端](#部署前端)
7. [最终验证](#最终验证)
8. [常见问题](#常见问题)

---

## 准备阶段

### 1. 需要的账号和工具

✅ **必需要的**：
- Cloudflare账号（免费）
- GitHub账号（免费）
- VS Code编辑器（推荐）

✅ **需要安装的软件**：
- Node.js（v18或v20版本）
- Git（如果还没有）

---

## 本地测试

### 步骤1：检查Node.js是否安装

打开终端（CMD或PowerShell），输入：

```bash
node --version
```

**如果看到版本号**（如 `v18.19.0`）→ 说明已安装 ✅  
**如果提示"不是内部或外部命令"** → 需要先安装

#### 安装Node.js

1. 访问官网：https://nodejs.org/
2. 下载 **LTS版本**（推荐）
3. 双击安装包，一路点击"下一步"
4. 安装完成后，**重启终端**
5. 再次输入 `node --version` 验证

---

### 步骤2：安装项目依赖

在项目目录下打开终端，输入：

```bash
npm install
```

**解释**：这会下载所有需要的库和工具，可能需要2-5分钟

**等待安装完成后**，你会看到类似这样的输出：
```
added 283 packages, and audited 284 packages in 2m
```

---

### 步骤3：启动本地开发服务器

输入命令：

```bash
npm run dev
```

**成功的话**，你会看到：
```
  VITE v5.0.12  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

**打开浏览器**，访问：`http://localhost:3000`

看到网站首页就说明本地测试成功！🎉

**按 Ctrl+C 可以停止服务器**

---

## 注册Cloudflare

### 步骤1：注册Cloudflare账号

1. 访问：https://dash.cloudflare.com/sign-up
2. 填写邮箱和密码
3. 验证邮箱
4. 完成注册

### 步骤2：启用Workers和Pages

登录后，你会看到Dashboard界面：

1. 左侧菜单找到 **"Workers & Pages"**
2. 点击进入
3. 你可能需要先创建一个Workers项目（免费）
4. 记住你的Cloudflare邮箱，后面会用到

### 步骤3：启用Cloudflare AI

1. 在 **"Workers & Pages"** 页面
2. 点击 **"Overview"**
3. 找到 **"AI"** 或 **"AI Beta"** 部分
4. 点击 **"Enable"** 或 **"Get started"**
5. 阅读条款并同意

**重要**：AI功能是免费的，每10,000次调用免费

---

## 配置AI功能

### 步骤1：安装Wrangler CLI

打开终端，输入：

```bash
npm install -g wrangler
```

**解释**：Wrangler是Cloudflare的命令行工具，用于部署Worker

### 步骤2：登录Cloudflare

输入：

```bash
wrangler login
```

**会发生什么**：
- 浏览器会自动打开
- 登录你的Cloudflare账号
- 点击授权
- 关闭浏览器，回到终端

**成功的话**，终端会显示：
```
Successfully logged in!
```

---

## 部署后端

### 步骤1：部署Worker

在项目目录下，输入：

```bash
wrangler deploy
```

**部署过程**：
```
⛅️ wrangler 3.x.x
Uploading ai-resume-builder...
✨ Built successfully
✨ Uploaded successfully
Published ai-resume-builder (1.2 sec)
  https://ai-resume-builder.yourname.workers.dev
```

**🎯 重要！记住这个URL**（类似上面的链接）

这个URL就是你的后端API地址！

### 步骤2：测试Worker是否工作

打开浏览器，访问你的Worker URL：
```
https://ai-resume-builder.yourname.workers.dev/api/ai/analyze
```

**用Postman或curl测试**：
```bash
curl -X POST https://ai-resume-builder.yourname.workers.dev/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d "{\"jobDescription\":\"Senior Software Engineer\"}"
```

如果返回JSON数据，说明后端正常工作！✅

---

## 部署前端

### 步骤1：准备代码

1. 创建GitHub仓库（如果没有的话）
2. 初始化Git并推送代码

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

### 步骤2：连接到Cloudflare Pages

**方法A：通过GitHub（推荐）**

1. 登录Cloudflare Dashboard
2. 进入 **"Workers & Pages"** → **"Create application"**
3. 选择 **"Pages"** → **"Connect to Git"**
4. 选择你的GitHub仓库
5. 点击 **"Begin setup"**

**配置构建设置**：

- **Project name**: 随便起一个（如 `ai-resume-builder`）
- **Production branch**: `main`
- **Framework preset**: `Vite`
- **Build command**: `npm run build`
- **Build output directory**: `dist`

点击 **"Save and Deploy"**

**等待部署完成**（2-3分钟）

**方法B：直接上传**

1. 先在本地构建：
```bash
npm run build
```

2. 在Cloudflare Pages，选择 **"Direct Upload"**
3. 上传 `dist` 文件夹的内容

### 步骤3：配置环境变量

部署完成后：

1. 进入Pages项目 → **"Settings"** → **"Environment variables"**
2. 点击 **"Add variable"**
3. 添加：
   - **Name**: `VITE_API_URL`
   - **Value**: 你的Worker URL（如 `https://ai-resume-builder.yourname.workers.dev/api`）
4. 点击保存
5. 点击 **"Deployments"** → 点击最新的部署 → **"Retry deployment"**

---

## 最终验证

### 步骤1：访问你的网站

部署完成后，Cloudflare会给你一个URL：
```
https://ai-resume-builder.pages.dev
```

访问这个URL，应该能看到你的网站！

### 步骤2：测试核心功能

**测试1：填写基本信息**
1. 点击 **"Build Resume"**
2. 填写姓名、邮箱、电话等
3. 看到预览更新 ✅

**测试2：使用AI分析**
1. 点击 **"AI Tools"** 标签
2. 粘贴一个职位描述
3. 点击 **"Analyze"**
4. 等待几秒，应该能看到关键词建议 ✅

**测试3：导出PDF**
1. 完成简历编辑后
2. 点击 **"Export as PDF"**
3. 应该能下载PDF文件 ✅

---

## 常见问题

### 问题1：npm install 很慢或失败

**解决方案**：使用国内镜像

```bash
npm config set registry https://registry.npmmirror.com
npm install
```

---

### 问题2：wrangler login 打不开浏览器

**解决方案**：手动登录

1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 创建一个API Token
3. 使用Token登录：
```bash
wrangler login --api-token YOUR_TOKEN_HERE
```

---

### 问题3：Worker部署失败

**错误信息**：`Error: No account found`

**解决方案**：
```bash
wrangler login
```

**错误信息**：`Error: No workers script found`

**解决方案**：确认你在项目根目录下，并且 `wrangler.toml` 文件存在

---

### 问题4：前端部署成功但AI不工作

**原因**：环境变量配置错误

**解决方案**：
1. 检查Pages的环境变量设置
2. 确认 `VITE_API_URL` 的值正确
3. 重新部署Pages项目

**验证方法**：
打开浏览器控制台（F12），查看是否有404错误

---

### 问题5：导出PDF失败

**解决方案**：
1. 使用Chrome或Edge浏览器
2. 不要使用无痕模式
3. 尝试清除浏览器缓存

---

### 问题6：AI返回错误

**错误信息**：`Analysis failed`

**解决方案**：
1. 检查Worker是否正常运行
2. 查看Worker日志：
```bash
wrangler tail
```
3. 确认AI功能已启用
4. 检查是否超出免费额度

---

### 问题7：本地访问不到localhost:3000

**解决方案**：
1. 确认开发服务器正在运行
2. 检查端口3000是否被占用
3. 尝试使用其他端口：
```bash
npm run dev -- --port 3001
```

---

### 问题8：Pages部署很慢

**解释**：首次部署可能需要5-10分钟

**解决方案**：耐心等待，后续部署会快很多

---

### 问题9：域名绑定失败

**解决方案**：
1. 确认域名DNS已解析到Cloudflare
2. 在Pages设置中添加自定义域名
3. 等待DNS生效（可能需要1-24小时）

---

### 问题10：找不到Worker URL

**解决方案**：
1. 登录Cloudflare Dashboard
2. 进入 **"Workers & Pages"**
3. 找到你的Worker项目
4. 点击查看详情，URL在页面顶部

---

## 🎉 恭喜你！

如果按照上面的步骤操作，你现在应该已经：

✅ 成功部署了一个AI简历构建器网站
✅ 配置了Cloudflare AI功能
✅ 网站可以正常访问和使用

---

## 下一步可以做这些

### 1. 绑定自己的域名

1. 买一个域名（如 namecheap, godaddy）
2. 在Pages设置中添加自定义域名
3. 按照提示配置DNS

### 2. 优化网站性能

- 添加CDN
- 优化图片
- 使用缓存策略

### 3. 添加新功能

- 用户注册登录
- 保存简历到数据库
- 分享简历链接

### 4. 推广网站

- 在社交媒体分享
- 提交到目录网站
- 写教程和博客

---

## 📞 需要帮助？

### 官方文档

- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Cloudflare AI: https://developers.cloudflare.com/workers-ai/

### 社区支持

- Cloudflare Discord: https://discord.gg/cloudflaredev
- Cloudflare论坛: https://community.cloudflare.com/

---

## 📝 快速检查清单

部署前检查：

- [ ] Node.js已安装
- [ ] 项目依赖已安装（npm install）
- [ ] 本地测试通过（npm run dev）
- [ ] Cloudflare账号已注册
- [ ] Cloudflare AI已启用
- [ ] Wrangler已安装
- [ ] Wrangler已登录
- [ ] Worker已部署
- [ ] Worker URL已记录
- [ ] GitHub仓库已创建
- [ ] 代码已推送到GitHub
- [ ] Pages项目已创建
- [ ] Pages环境变量已配置
- [ ] 网站可以正常访问
- [ ] AI功能正常工作
- [ ] PDF导出功能正常

---

**祝你部署成功！有任何问题随时参考上面的常见问题部分。** 🚀
