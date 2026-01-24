# GitHub后端部署对接AI完整教程

> **适用人群**: 有GitHub使用经验的开发者
> **部署目标**: 将Cloudflare Worker后端与AI服务对接并部署
> **预计时间**: 30-45分钟

---

## 📋 目录

1. [环境配置](#环境配置)
2. [部署准备](#部署准备)
3. [Cloudflare AI配置](#cloudflare-ai配置)
4. [后端部署流程](#后端部署流程)
5. [前端配置对接](#前端配置对接)
6. [GitHub Actions CI/CD](#github-actions-cicd)
7. [测试验证](#测试验证)
8. [常见问题排查](#常见问题排查)

---

## 环境配置

### 1.1 必需工具和账号

#### 账号准备

✅ **必须有的账号**:
- [ ] GitHub账号 (免费)
- [ ] Cloudflare账号 (免费)

✅ **需要安装的软件**:
- [ ] Node.js (v18+)
- [ ] Git
- [ ] npm 或 yarn

#### Cloudflare AI功能

1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com
2. 进入 **Workers & Pages** → **Overview**
3. 找到 **AI** 或 **AI Workers Beta** 区域
4. 点击 **"Enable"** 或 **"Get started"**
5. 阅读并同意服务条款

**重要**: Cloudflare AI目前是免费功能，每10,000次调用免费。

---

## 部署准备

### 2.1 项目结构检查

确保你的项目包含以下文件：

```
ai-resume-builder/
├── src/
│   ├── worker/
│   │   └── index.ts          ← Worker后端代码
│   ├── services/
│   │   └── api.ts           ← API调用层
│   └── vite-env.d.ts         ← 环境变量类型声明
├── wrangler.toml            ← Worker配置文件
├── package.json
└── .env                    ← 本地环境变量
```

### 2.2 检查关键文件

#### wrangler.toml (Worker配置)

确保配置正确：

```toml
name = "ai-resume-builder"
main = "src/worker/index.ts"
compatibility_date = "2024-01-01"

[site]
bucket = "./dist"

[[build]]
command = "npm run build"

[ai]
binding = "AI"
```

**关键配置说明**:
- `name`: Worker名称，部署后的URL会包含这个名称
- `main`: Worker入口文件路径
- `compatibility_date`: Cloudflare运行时版本
- `[ai] binding = "AI"`: **最重要！** AI绑定的关键配置

#### src/vite-env.d.ts (环境变量类型)

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**作用**: 解决TypeScript报错 "类型'ImportMeta'上不存在属性'env'"

---

## Cloudflare AI配置

### 3.1 安装Wrangler CLI

```bash
npm install -g wrangler
```

验证安装:
```bash
wrangler --version
```

### 3.2 登录Cloudflare

```bash
wrangler login
```

**说明**:
- 浏览器会自动打开
- 登录你的Cloudflare账号
- 点击授权
- 关闭浏览器回到终端

**成功标志**:
```
Successfully logged in!
```

### 3.3 验证AI绑定

在项目目录执行:

```bash
wrangler whoami
```

应该显示你的账户信息。

检查AI是否已启用:
```bash
wrangler deploy --dry-run
```

如果看到`[ai] binding = "AI"`配置，说明AI绑定已就绪。

---

## 后端部署流程

### 4.1 本地测试Worker

#### 步骤1: 安装依赖

```bash
npm install
```

#### 步骤2: 本地运行Worker

```bash
wrangler dev
```

你会看到:
```
⛅️ wrangler 3.x.x
Your worker has access to the following bindings:
- AI
- KV (optional)

[wrangler:inf] Ready on http://localhost:8787
```

#### 步骤3: 测试API

打开新终端，测试AI分析接口:

```bash
curl -X POST http://localhost:8787/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d "{\"jobDescription\":\"Senior Software Engineer\"}"
```

**期望返回**:
```json
{
  "keywords": [
    {
      "keyword": "Problem-solving",
      "category": "Soft Skills",
      "importance": "high",
      "suggestion": "Include specific examples of problems you solved"
    }
  ],
  "suggestions": [
    "Quantify your achievements with numbers"
  ],
  "summary": "Focus on skills and experience"
}
```

### 4.2 部署到Cloudflare Workers

#### 步骤1: 执行部署命令

```bash
wrangler deploy
```

**部署过程**:
```
⛅️ wrangler 3.x.x
Uploading ai-resume-builder...
✨ Built successfully
✨ Uploaded successfully
Published ai-resume-builder (1.2 sec)
  https://ai-resume-builder.your-account.workers.dev
```

#### 步骤2: 记录Worker URL

🎯 **重要! 记下这个URL**:
```
https://ai-resume-builder.your-account.workers.dev
```

这是你的后端API地址，后面配置前端时会用到。

### 4.3 验证在线部署

测试线上API:

```bash
curl -X POST https://ai-resume-builder.your-account.workers.dev/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d "{\"jobDescription\":\"Senior Software Engineer\"}"
```

**注意**: 如果遇到CORS错误，检查Worker代码中的CORS配置。

---

## 前端配置对接

### 5.1 环境变量配置

#### 开发环境配置

创建 `.env.development`:

```env
# 本地开发时使用本地Worker
VITE_API_URL=http://localhost:8787/api
```

#### 生产环境配置

创建 `.env.production`:

```env
# 生产环境使用线上Worker URL
VITE_API_URL=https://ai-resume-builder.your-account.workers.dev/api
```

**重要**: 将 `your-account.workers.dev` 替换为你实际的Worker URL。

### 5.2 创建GitHub仓库

#### 步骤1: 初始化Git

```bash
git init
git add .
git commit -m "Initial commit: AI Resume Builder"
git branch -M main
```

#### 步骤2: 创建GitHub仓库

1. 访问 https://github.com/new
2. 仓库名: `ai-resume-builder`
3. 设置为Public或Private
4. 不要初始化README、.gitignore或license
5. 点击 **"Create repository"**

#### 步骤3: 推送代码

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-builder.git
git push -u origin main
```

### 5.3 配置GitHub环境变量

#### 方法A: 通过GitHub Secrets (推荐)

1. 进入GitHub仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **"New repository secret"**
3. 添加:
   - Name: `VITE_API_URL`
   - Value: `https://ai-resume-builder.your-account.workers.dev/api`
4. 点击 **"Add secret"**

#### 方法B: 通过Cloudflare Pages配置 (部署后)

部署到Cloudflare Pages后:
1. Pages项目 → **Settings** → **Environment variables**
2. 添加 `VITE_API_URL` 变量
3. 值为你的Worker URL

---

## GitHub Actions CI/CD

### 6.1 创建工作流文件

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run lint || true

      - name: Build project
        run: npm run build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

### 6.2 配置GitHub Secrets

需要添加两个Secrets:

1. **CLOUDFLARE_API_TOKEN**
   - 获取方式:
     1. Cloudflare Dashboard → **My Profile** → **API Tokens**
     2. 点击 **"Create Token"**
     3. Template: **"Edit Cloudflare Workers"**
     4. 权限设置:
       - Account → **Cloudflare Workers**: Edit
       - Account → **Cloudflare Workers AI**: Edit
     5. 点击 **"Continue to summary"** → **"Create Token"**
     6. 复制生成的Token
   - 在GitHub: Settings → Secrets → Add new secret
   - Name: `CLOUDFLARE_API_TOKEN`
   - Value: 粘贴Token

2. **CLOUDFLARE_ACCOUNT_ID**
   - 获取方式:
     1. Cloudflare Dashboard → **Workers & Pages**
     2. 右侧边栏可以看到 **Account ID**
   - 在GitHub: 添加新Secret
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Value: 粘贴Account ID

### 6.3 触发自动部署

推送代码到main分支会自动触发:

```bash
git add .
git commit -m "feat: add GitHub Actions CI/CD"
git push origin main
```

查看部署状态:
```
GitHub仓库 → Actions 标签 → 查看运行日志
```

---

## 测试验证

### 7.1 前端本地测试

#### 步骤1: 启动开发服务器

```bash
npm run dev
```

访问: `http://localhost:3000`

#### 步骤2: 测试AI功能

**测试1: 职位描述分析**
1. 填写职位描述
2. 点击 "Analyze"
3. 期望: 3-5秒后显示关键词建议

**测试2: AI生成经历**
1. 填写职位、公司、关键点
2. 点击 "Generate"
3. 期望: 生成专业的经历描述

**测试3: 翻译功能**
1. 输入中文文本
2. 选择翻译为英文
3. 期望: 返回准确的英文翻译

### 7.2 生产环境测试

部署到Cloudflare Pages后:

1. 访问Pages URL
2. 测试所有功能
3. 使用浏览器开发者工具 (F12)
4. 查看Console是否有错误
5. 查看Network标签，确认API请求成功

### 7.3 性能测试

使用wrk进行负载测试:

```bash
# 安装wrk
brew install wrk  # Mac
# 或下载: https://github.com/wg/wrk/releases

# 测试AI分析接口
wrk -t4 -c10 -d30s https://ai-resume-builder.your-account.workers.dev/api/ai/analyze
```

---

## 常见问题排查

### 问题1: TypeScript报错 "找不到模块axios"

**错误信息**:
```
[ERROR] Line 1: 找不到模块"axios"或其相应的类型声明。
```

**原因**: axios的类型声明文件未安装

**解决方案**:
```bash
npm install --save-dev @types/axios
```

**验证**:
```bash
npx tsc --noEmit
```

---

### 问题2: TypeScript报错 "ImportMeta上不存在属性env"

**错误信息**:
```
[ERROR] Line 3: 类型"ImportMeta"上不存在属性"env"。
```

**原因**: Vite环境变量类型未声明

**解决方案**:

确保 `src/vite-env.d.ts` 文件存在且内容正确:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

**验证**:
- 重启IDE (VS Code)
- 重新加载TypeScript服务器 (Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server")

---

### 问题3: Worker部署失败 "No account found"

**错误信息**:
```
Error: No account found
```

**原因**: Wrangler未登录或登录过期

**解决方案**:
```bash
wrangler logout
wrangler login
```

---

### 问题4: Worker部署失败 "No workers script found"

**错误信息**:
```
Error: No workers script found
```

**原因**: wrangler.toml配置错误或main文件路径错误

**解决方案**:

检查 `wrangler.toml`:
```toml
name = "ai-resume-builder"
main = "src/worker/index.ts"  # ← 确保路径正确
```

检查文件是否存在:
```bash
ls -la src/worker/index.ts
```

---

### 问题5: AI功能不工作，返回 "Analysis failed"

**原因**:
1. AI未启用
2. AI调用失败
3. AI响应格式错误

**排查步骤**:

1. **检查Worker日志**:
```bash
wrangler tail
```
查看实时日志，查找错误信息。

2. **验证AI绑定**:
检查 `wrangler.toml` 是否有:
```toml
[ai]
binding = "AI"
```

3. **手动测试AI调用**:
```bash
wrangler secret list
```

4. **查看Cloudflare Dashboard**:
- Workers & Pages → 你的Worker → Logs
- 查看错误日志

---

### 问题6: 前端调用API返回CORS错误

**错误信息**:
```
Access to fetch at 'https://...' has been blocked by CORS policy
```

**原因**: Worker的CORS配置不完整

**解决方案**:

检查 `src/worker/index.ts` 中的CORS配置:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',        // ← 必须有
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // ← 必须有
  'Access-Control-Allow-Headers': 'Content-Type',  // ← 必须有
};
```

确保所有响应都包含这些headers:
```typescript
return new Response(JSON.stringify(data), {
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});
```

---

### 问题7: GitHub Actions部署失败 "Invalid API Token"

**错误信息**:
```
Error: Invalid API Token
```

**原因**: Cloudflare API Token权限不足或已过期

**解决方案**:

1. 重新生成Token:
   - Cloudflare Dashboard → My Profile → API Tokens
   - 删除旧Token，创建新的
   - 确保权限: Workers + Workers AI

2. 更新GitHub Secret:
   - GitHub仓库 → Settings → Secrets
   - 更新 `CLOUDFLARE_API_TOKEN`

3. 重新触发部署:
   ```bash
   git commit --allow-empty -m "trigger deploy"
   git push origin main
   ```

---

### 问题8: 生产环境前端连接不上后端

**原因**: 环境变量配置错误

**解决方案**:

1. **检查Pages环境变量**:
   - Cloudflare Pages → Settings → Environment variables
   - 确认 `VITE_API_URL` 已设置
   - 确认值正确 (包含 `/api` 后缀)

2. **检查前端代码**:
   ```typescript
   // src/services/api.ts
   const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
   console.log('API URL:', API_BASE_URL);  // 添加日志调试
   ```

3. **验证API可访问**:
   ```bash
   curl https://your-worker.workers.dev/api/ai/analyze
   ```

---

### 问题9: AI响应时间过长

**原因**:
1. AI模型处理时间长
2. 网络延迟
3. 超时配置太短

**解决方案**:

**前端增加超时时间**:
```typescript
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,  // 增加到60秒
});
```

**Worker优化prompt**:
```typescript
const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  prompt,
  max_tokens: 512,  // 减少token数量，加快响应
});
```

**前端添加加载提示**:
```typescript
const [loading, setLoading] = useState(false);
const [tip, setTip] = useState('Analyzing job description...');

useEffect(() => {
  if (loading) {
    const tips = [
      'Analyzing job description...',
      'Extracting keywords...',
      'Generating suggestions...',
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % tips.length;
      setTip(tips[index]);
    }, 1500);
    return () => clearInterval(interval);
  }
}, [loading]);
```

---

### 问题10: Worker额度用尽

**错误信息**:
```
429 Too Many Requests
```

**原因**: 超出免费配额

**解决方案**:

1. **查看使用情况**:
   - Cloudflare Dashboard → Workers & Pages → Usage
   - 查看请求数和AI调用数

2. **优化调用频率**:
   - 添加防抖 (debounce)
   - 缓存AI响应
   - 批量处理请求

3. **升级计划**:
   - 免费计划: 100,000 请求/天, 10,000 AI调用/天
   - 付费计划: 更高的配额

---

## 📝 部署检查清单

### 部署前检查

- [ ] Node.js已安装 (v18+)
- [ ] Git已配置
- [ ] Cloudflare账号已注册
- [ ] Cloudflare AI已启用
- [ ] Wrangler CLI已安装
- [ ] Wrangler已登录
- [ ] src/worker/index.ts 存在
- [ ] wrangler.toml 配置正确
- [ ] src/vite-env.d.ts 存在
- [ ] 本地测试Worker成功
- [ ] .env 文件配置正确

### 部署中检查

- [ ] Worker部署成功
- [ ] 记录Worker URL
- [ ] Worker API可访问
- [ ] AI功能正常工作
- [ ] CORS配置正确

### 部署后检查

- [ ] GitHub仓库已创建
- [ ] 代码已推送
- [ ] GitHub Secrets已配置
- [ ] GitHub Actions CI/CD已设置
- [ ] 前端环境变量已配置
- [ ] 前端可以调用后端API
- [ ] 所有功能测试通过
- [ ] 监控和日志已配置

---

## 🎯 最佳实践

### 1. 版本管理

```bash
# 使用语义化版本
git tag v1.0.0
git push origin v1.0.0

# 使用Git分支
main       # 生产环境
develop    # 开发环境
feature/*  # 功能分支
hotfix/*   # 紧急修复
```

### 2. 环境分离

```env
# .env.development
VITE_API_URL=http://localhost:8787/api
VITE_ENABLE_LOGGING=true

# .env.production
VITE_API_URL=https://ai-resume-builder.workers.dev/api
VITE_ENABLE_LOGGING=false
```

### 3. 错误监控

```typescript
// Worker中添加错误追踪
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      // 你的代码
    } catch (error) {
      console.error('Worker error:', error);
      // 发送到监控服务 (如Sentry)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};
```

### 4. 日志管理

```bash
# 实时查看Worker日志
wrangler tail

# 查看最近日志
wrangler tail --format=pretty

# 过滤日志
wrangler tail | grep "ERROR"
```

---

## 📞 获取帮助

### 官方文档

- **Cloudflare Workers**: https://developers.cloudflare.com/workers/
- **Cloudflare AI**: https://developers.cloudflare.com/workers-ai/
- **Wrangler CLI**: https://developers.cloudflare.com/workers/wrangler/
- **GitHub Actions**: https://docs.github.com/en/actions

### 社区支持

- **Cloudflare Discord**: https://discord.gg/cloudflaredev
- **Cloudflare论坛**: https://community.cloudflare.com/
- **GitHub讨论**: https://github.com/cloudflare/cloudflare-developer-experience/discussions

---

## 📊 部署架构图

```
┌─────────────────┐
│   用户浏览器    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare Pages│  ← 前端 (React)
│   (frontend)   │
└────────┬────────┘
         │
         │ API调用
         ▼
┌─────────────────┐
│ Cloudflare Workers│  ← 后端 (TypeScript)
│   (backend)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Cloudflare AI  │  ← AI模型 (Llama 3.1)
└─────────────────┘
```

---

**教程完成！如有问题，请参考常见问题排查部分或查看官方文档。**
