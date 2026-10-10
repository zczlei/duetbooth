# DuetBooth — AI Trend Video Site

可扩展的特效视频站骨架：一个词一个内页，后面有新视频词直接加配置即可。

## 已内置特效

| 路径 | 关键词 |
|------|--------|
| `/effects/hotel-lobby` | hotel lobby ai |
| `/effects/rain-dance` | rain dance ai |
| `/effects/zombie-trend` | ai zombie trend |

首页：`/`

## 本地启动

```bash
cd video-effects
pnpm install
pnpm dev
```

打开 http://localhost:3005（或终端提示的端口）

默认 `VIDEO_PROVIDER=demo`，会返回示例 MP4，方便先跑通上传/生成流程。

## 异步生成（提交 → 轮询）

适合 Cloudflare Workers 短请求限制：

1. `POST /api/jobs` — 扣 1 credit，向上游提交任务，立刻返回 `{ id, status }`
2. `GET /api/jobs/{id}` — 查询上游状态；成功返回 `videoUrl`，失败自动退 credit
3. 前端每约 3 秒轮询，直到 `succeeded` / `failed`

旧的同步 `POST /api/generate` 已停用（410）。

## 接入真实视频 API

```bash
cp .env.example .env.local
```

- `VIDEO_PROVIDER=fal` + `FAL_KEY=...`
- 或 `VIDEO_PROVIDER=kie` + `KIE_API_KEY=...`
- 或 `VIDEO_PROVIDER=ark` + `ARK_API_KEY=...`（火山方舟豆包 Seedance）
- 或 `VIDEO_PROVIDER=auto`：浏览器检测到**真人人脸**→`kie`，**无人脸**→`ark`；检测不到默认 `kie`；Ark 因人脸被拒时自动回退 `kie`

按你账号实际可用的模型 ID 改 `FAL_VIDEO_MODEL` / `KIE_VIDEO_MODEL` / `ARK_VIDEO_MODEL`。

## 新增一个视频词内页

编辑 `src/lib/effects.ts`，复制一条 `EffectDefinition`：

1. 改 `slug` / `keyword` / `title` / `templates` / `seoKeywords`
2. 保存后自动出现：
   - 导航链接
   - `/effects/{slug}` 页面
   - 首页卡片

不必新建路由文件。

## Stripe 付费（按次积分）

套餐：`$4.90` / `$9.90` / `$19.90` → 1 / 3 / 10 条视频积分。  
钱包/任务存在 KV 抽象层：本地为 `data/kv/*.json`；Cloudflare 绑定 `DUETBOOTH_KV`。  
浏览器 cookie `duetbooth_wallet` 标识钱包；生成扣 1 点，失败自动退回。

### 1. 填密钥

在 [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys) 拿 **Secret key**，写入 `.env.local`：

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3005
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # 见下一步
```

### 2. 本地 Webhook（可选但推荐）

成功页会用 `session_id` 主动确认付款；Webhook 用于补漏。

```bash
stripe listen --forward-to localhost:3005/api/webhook/stripe
```

把输出的 `whsec_...` 写进 `STRIPE_WEBHOOK_SECRET`，重启 `pnpm dev`。

### 3. 测一遍

1. 打开站点 → Pricing → Buy  
2. 用 Stripe 测试卡 `4242 4242 4242 4242`  
3. 跳回 `/billing/success`，顶部 credits 增加  
4. Upload → Generate，扣 1 credit  

上线后把 `NEXT_PUBLIC_APP_URL` 改成正式域名，Webhook 指到 `https://你的域名/api/webhook/stripe`，并换成 `sk_live_...`。

## Google 一键登录

登录后积分绑到 Google 账号（`wallet:user_<googleSub>`）；未登录仍可用游客 cookie。  
首次登录会把当前浏览器里的游客积分合并进账号。

### 1. Google Cloud 配置

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → 创建 OAuth 客户端（Web）
2. 授权重定向 URI 加：
   - 本地：`http://localhost:3005/api/auth/callback/google`
   - 线上：`https://你的域名/api/auth/callback/google`
3. 把 Client ID / Secret 写入 `.env.local`：

```bash
AUTH_SECRET=   # openssl rand -base64 32
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_URL=http://localhost:3005   # 生产改成正式域名
```

未配置时顶栏不显示登录按钮，站点其它功能照常可用。

## Cloudflare 部署检查清单

注册：https://dash.cloudflare.com/sign-up → Dashboard

### 已完成

- [x] **KV** `DUETBOOTH_KV` → ID `699306fe965d4c88b74511941bd0c2ff`（已写入 `wrangler.jsonc`）
- [x] OpenNext 脚手架（`@opennextjs/cloudflare`、`open-next.config.ts`、`wrangler.jsonc`）

### 上线 / 持续部署

**日常：push `main` → GitHub Actions 自动构建并部署到 Worker `duetbooth`。**  
说明见 [`docs/github-cloudflare-cd.md`](docs/github-cloudflare-cd.md)。

仓库需配置 Actions Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`。  
业务密钥（Stripe / KIE / Ark / Auth…）仍只放 **Cloudflare Worker Secrets**。

本机紧急热修：

```bash
cd video-effects
npx wrangler login   # 首次
pnpm deploy          # 临时移开 .env.local，避免烤进产物
```

其它：Stripe Webhook → `https://duetbooth.co/api/webhook/stripe`；Google OAuth 回调 → `https://duetbooth.co/api/auth/callback/google`。

本地未绑 KV 时回退 `data/kv`。`pnpm preview` 可在 Workers 运行时预览。  
清单：`.cursor/rules/cloudflare-deploy-checklist.mdc`；手记：`docs/launch-2026-10-09/index.html`。

## 下一步可接

- Waffo 等其它支付渠道
- 图片上传到 R2/S3（避免 data URL 过大）
- 用户登录与跨设备积分同步（当前积分绑在浏览器 cookie）

## 技术栈

Next.js App Router · TypeScript · Tailwind CSS v4 · Stripe Checkout · KV/file store

