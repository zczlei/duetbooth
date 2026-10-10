# GitHub → Cloudflare 持续部署

DuetBooth 现支持两种「推代码即上线」路径。推荐先用 **GitHub Actions**（本仓库已配好）；可选再在 Dashboard 接 **Workers Builds**（Cloudflare 拉仓库构建）。

## A. GitHub Actions（已落地）

### 流程

1. push / merge 到 `main`
2. `.github/workflows/deploy.yml`：`pnpm install` → `opennextjs-cloudflare build` → `deploy --keep-vars`
3. Worker 名：`duetbooth`（见 `wrangler.jsonc`）

PR / 非 main 分支跑 `.github/workflows/ci.yml`（只 build，不部署）。

### 仓库 Secrets（Settings → Secrets and variables → Actions）

| Secret | 说明 |
|---|---|
| `CLOUDFLARE_API_TOKEN` | 权限至少含 Workers Scripts Edit / Write |
| `CLOUDFLARE_ACCOUNT_ID` | `a37ddcd55479d60107a2583a7d0d6514` |

创建 Token：https://dash.cloudflare.com/profile/api-tokens → Create Token → **Edit Cloudflare Workers** 模板即可。

### 仍放在 Cloudflare Worker Secrets 的（勿放进 GitHub）

`VIDEO_PROVIDER`、`KIE_*`、`ARK_*`、`FAL_*`、`STRIPE_*`、`AUTH_*`、`APP_URL`、`AUTH_URL`、`NEXT_PUBLIC_APP_URL` 等。  
`--keep-vars` 会保留这些 Secrets，不会被 CI 覆盖。

### 构建时注入的公开变量

`NEXT_PUBLIC_APP_URL=https://duetbooth.co`（workflow 与 `.env.production`）。

### 本机紧急热修

仍可用：

```bash
pnpm deploy   # scripts/cf-deploy.sh，会临时移开 .env.local
```

---

## B. Workers Builds（Cloudflare 拉 Git，可选）

官方推荐 OpenNext 构建命令（Dashboard → Worker `duetbooth` → Settings → Builds）：

1. **Connect** GitHub → 授权 Cloudflare Workers & Pages App → 选 `zczlei/duetbooth`
2. Production branch：`main`
3. Build command：`pnpm install && pnpm exec opennextjs-cloudflare build`
4. Deploy command：`pnpm exec opennextjs-cloudflare deploy -- --keep-vars`
5. Build 环境变量（非 Secret）：`NEXT_PUBLIC_APP_URL=https://duetbooth.co`

> 须先在 Dashboard 完成一次 GitHub App 授权；API 无法代替你点授权。  
> 若已用 GitHub Actions，不必同时开 Workers Builds，避免双重部署。

---

## 验收

1. 改 README 一行空白 → push `main`
2. GitHub Actions `Deploy Cloudflare` 变绿
3. `curl -s https://duetbooth.co/api/wallet` 仍返回 `store=kv`
