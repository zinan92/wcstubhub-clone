# wcstubhub-clone

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/tests-466%20passed-brightgreen)](./__tests__)
[![Vercel](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://vercel.com)

移动优先的票务市场平台 -- FIFA World Cup 2026 主题，信任架构，智能定价，完整交易流程。

---

## 痛点

票务二级市场存在三个核心问题：

1. **信任缺失** -- 买家不知道卖家是否可靠，平台不提供任何保障承诺
2. **信息不对称** -- 哪张票性价比最高？哪些场次快售罄？买家只能盲猜
3. **交易摩擦** -- 从浏览到下单到转卖，流程断裂，移动端体验差

## 解决方案

wcstubhub-clone 用三层机制解决上述问题：

| 层级 | 机制 | 实现 |
|------|------|------|
| **信任层** | Buyer Protection + Verified Seller + Secure Delivery 三重徽章 | `components/trust/` |
| **智能层** | Best Value / Selling Fast / Only X Left 算法标签 | `components/listing-intelligence/` |
| **交易层** | 多步购买 + 多步挂单 + 状态全生命周期追踪 | `components/purchase/` + `components/listing/` |

同时提供完整的管理后台（商品/赛事/用户/订单 CRUD）和 VIP 会员体系。

---

## 架构

```
                         ┌─────────────────────┐
                         │   Mobile Browser     │
                         │  (Frosted Glass UI)  │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                         │   Next.js 15 App      │
                         │   (App Router + RSC)   │
                         ├────────────────────────┤
                         │  middleware.ts          │
                         │  (Auth Route Guard)     │
                         ├────────┬───────────────┤
                         │ Pages  │  API Routes    │
                         │ /app/* │  /api/*        │
                         └────────┴───────┬───────┘
                                          │
                         ┌────────────────▼───────┐
                         │   Prisma 6.1 ORM       │
                         │   (7 Models, 4 Enums)  │
                         ├────────────────────────┤
                         │   SQLite (dev/prod)     │
                         └────────────────────────┘
```

认证流: `NextAuth.js (Credentials) → Session Cookie → middleware.ts → Protected Routes`

---

## 快速开始

```bash
# 1. 克隆并安装
git clone https://github.com/zinan92/wcstubhub-clone.git
cd wcstubhub-clone
pnpm install

# 2. 环境变量
cp .env.example .env
# 默认使用本地 SQLite，需要设置 NEXTAUTH_SECRET

# 3. 数据库初始化 + 种子数据
pnpm exec prisma generate
pnpm exec prisma db push
pnpm db:seed    # 30 商品 + 42 赛事 + 示例用户 + VIP 等级

# 4. 启动开发服务器
pnpm dev        # http://localhost:3000
```

### 测试凭证

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 普通用户 | `test@example.com` | `password123` |
| 管理员 | `admin@example.com` | `admin123` |

### 可用脚本

| 脚本 | 用途 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建（含 DB push + seed） |
| `pnpm test` | 运行 Vitest 测试套件 |
| `pnpm lint` | ESLint 检查 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm db:seed` | 重新填充种子数据 |

---

## 功能一览

| 领域 | 功能 | 说明 |
|------|------|------|
| **市场浏览** | 4 个分类 Tab | Goods(商品) / Football / Basketball / Concert |
| **市场浏览** | 5 组轮播 | Popular Events, Football, Concerts, Basketball, Merchandise |
| **市场浏览** | 全屏搜索 | 统一搜索 API，自动补全，热门趋势 |
| **信任架构** | 三重信任徽章 | Buyer Protection / Verified Seller / Secure Delivery |
| **信任架构** | Fan Protect Guarantee | 页脚信任横幅 |
| **智能标签** | Best Value | 算法标记最佳性价比 |
| **智能标签** | Selling Fast / Only X Left | 基于库存和销售速度的紧迫度提示 |
| **交易流程** | 多步购买 | 数量选择 -> 订单摘要 -> 确认 -> DB 写入 |
| **交易流程** | 多步挂单 | 创建 Listing -> 定价 -> 摘要 -> 确认 |
| **交易流程** | 状态追踪 | pending -> confirmed -> delivered -> listed -> sold |
| **账户中心** | My Tickets / Listings / Orders | 购买记录 + 挂单管理 + 订单历史 |
| **账户中心** | VIP 会员 | 多等级 VIP，积分体系，等级渐变样式 |
| **管理后台** | 完整 CRUD | 商品/赛事/用户/订单/资产/挂单管理 |
| **管理后台** | Dashboard | 平台指标概览 |

---

## API 参考

### 公开端点

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/products` | 商品列表 |
| `GET` | `/api/products/:id` | 商品详情 |
| `GET` | `/api/events` | 赛事列表（支持 `?type=football` 筛选） |
| `GET` | `/api/events/:id` | 赛事详情 |
| `GET` | `/api/search?q=` | 统一搜索（商品 + 赛事） |
| `GET` | `/api/vip-tiers` | VIP 等级列表 |
| `POST` | `/api/auth/register` | 用户注册 |
| `POST/GET` | `/api/auth/[...nextauth]` | NextAuth 登录/会话 |

### 受保护端点（需登录）

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/user/profile` | 当前用户信息 |
| `GET/POST` | `/api/user/orders` | 用户订单 |
| `GET/POST` | `/api/user/owned-assets` | 用户拥有的资产 |
| `GET/POST` | `/api/user/listings` | 用户挂单 |

### 管理员端点（需 admin 角色）

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/admin/stats` | 平台统计 |
| `GET/POST` | `/api/admin/products` | 商品管理 |
| `PUT/DELETE` | `/api/admin/products/:id` | 商品编辑/删除 |
| `GET/POST` | `/api/admin/events` | 赛事管理 |
| `PUT/DELETE` | `/api/admin/events/:id` | 赛事编辑/删除 |
| `GET` | `/api/admin/users` | 用户列表 |
| `GET` | `/api/admin/orders` | 订单列表 |
| `GET` | `/api/admin/owned-assets` | 资产列表 |
| `GET` | `/api/admin/listings` | 挂单列表 |

---

## 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 15.1 |
| 语言 | TypeScript | 5.x |
| 样式 | Tailwind CSS | 3.4 |
| 动画 | Motion (Framer Motion) | 12.x |
| ORM | Prisma | 6.1 |
| 数据库 | SQLite | -- |
| 认证 | NextAuth.js | 4.24 |
| 图标 | Lucide React | 1.6 |
| 测试 | Vitest + React Testing Library | 2.1 / 16.1 |
| 包管理 | pnpm | -- |
| 部署 | Vercel | -- |

---

## 项目结构

```
wcstubhub-clone/
├── app/
│   ├── page.tsx                 # 首页 (Goods Tab)
│   ├── layout.tsx               # 根布局
│   ├── template.tsx             # 页面转场动画
│   ├── football/                # 足球赛事 Tab
│   ├── basketball/              # 篮球赛事 Tab
│   ├── concert/                 # 演唱会 Tab
│   ├── events/[id]/             # 赛事详情
│   ├── products/[id]/           # 商品详情
│   ├── login/                   # 登录
│   ├── register/                # 注册
│   ├── my/                      # 账户中心
│   │   ├── tickets/             # 我的票券
│   │   ├── listings/            # 我的挂单
│   │   ├── orders/              # 订单历史
│   │   ├── vip/                 # VIP 会员
│   │   └── ...                  # 个人/银行卡/安全/通知/语言/公司
│   ├── admin/                   # 管理后台
│   │   ├── dashboard/           # 数据概览
│   │   ├── products/            # 商品 CRUD
│   │   ├── events/              # 赛事 CRUD
│   │   ├── users/               # 用户管理
│   │   ├── orders/              # 订单管理
│   │   ├── owned-assets/        # 资产管理
│   │   └── listings/            # 挂单管理
│   └── api/                     # 21 个 REST 端点
│       ├── auth/                # NextAuth + 注册
│       ├── search/              # 统一搜索
│       ├── products/            # 商品 API
│       ├── events/              # 赛事 API
│       ├── user/                # 用户 API (orders/assets/listings/profile)
│       ├── vip-tiers/           # VIP 等级
│       └── admin/               # 管理 API (stats/products/events/users/orders/assets/listings)
├── components/
│   ├── ui/                      # 设计系统基础组件
│   ├── trust/                   # 信任架构组件
│   ├── listing-intelligence/    # 智能标签组件
│   ├── purchase/                # 多步购买流程
│   ├── listing/                 # 多步挂单流程
│   ├── search/                  # 搜索覆盖层 + 自动补全
│   ├── home/                    # 首页轮播区块
│   └── TopNavigation.tsx        # 顶部导航
├── lib/
│   ├── auth.ts                  # NextAuth 配置
│   └── prisma.ts                # Prisma 客户端单例
├── prisma/
│   ├── schema.prisma            # 数据库 Schema (7 Model, 4 Enum)
│   └── seed.ts                  # 种子脚本
├── types/                       # TypeScript 类型定义
├── __tests__/                   # 54 文件，466 测试
├── middleware.ts                # 认证 + 路由保护中间件
└── vitest.config.ts             # 测试配置
```

---

## 配置

### 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `DATABASE_URL` | 是 | `file:./dev.db` | SQLite 数据库路径 |
| `NEXTAUTH_SECRET` | 是 | -- | NextAuth 加密密钥（任意随机字符串） |
| `NEXTAUTH_URL` | 否 | `http://localhost:3000` | 应用 URL（Vercel 部署时自动设置） |

### 数据模型

7 个 Prisma Model：`User`、`Product`、`Event`、`Order`、`OwnedAsset`、`Listing`、`VipTier`

4 个 Enum：`EventType`(football/basketball/concert)、`ItemType`(product/event)、`OrderStatus`、`OwnedAssetStatus`、`ListingStatus`

---

## For AI Agents

### 项目元数据

```yaml
schema: ai-agent/v1
name: wcstubhub-clone
description: Mobile-first ticket marketplace with trust architecture and listing intelligence
tech_stack:
  framework: next.js-15-app-router
  language: typescript
  orm: prisma-6.1
  database: sqlite
  auth: nextauth-credentials
  styling: tailwindcss-3.4
  testing: vitest
api:
  base_url: http://localhost:3000/api
  auth_method: session-cookie (NextAuth.js)
  public_endpoints:
    - GET /api/products
    - GET /api/products/:id
    - GET /api/events
    - GET /api/events/:id
    - GET /api/search?q={query}
    - GET /api/vip-tiers
    - POST /api/auth/register
  protected_endpoints:
    - GET /api/user/profile
    - GET|POST /api/user/orders
    - GET|POST /api/user/owned-assets
    - GET|POST /api/user/listings
  admin_endpoints:
    - GET /api/admin/stats
    - GET|POST /api/admin/products
    - PUT|DELETE /api/admin/products/:id
    - GET|POST /api/admin/events
    - PUT|DELETE /api/admin/events/:id
    - GET /api/admin/users
    - GET /api/admin/orders
    - GET /api/admin/owned-assets
    - GET /api/admin/listings
test_credentials:
  user: { email: "test@example.com", password: "password123" }
  admin: { email: "admin@example.com", password: "admin123" }
setup_commands:
  - pnpm install
  - pnpm exec prisma generate
  - pnpm exec prisma db push
  - pnpm db:seed
  - pnpm dev
test_command: pnpm test
test_stats: "466 tests across 54 files"
```

### Agent HTTP 调用示例

```bash
# 1. 获取 CSRF token 和 session cookie
curl -c cookies.txt http://localhost:3000/api/auth/csrf

# 2. 登录获取 session
curl -b cookies.txt -c cookies.txt \
  -X POST http://localhost:3000/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=test@example.com&password=password123&csrfToken=TOKEN_FROM_STEP_1"

# 3. 搜索商品和赛事
curl http://localhost:3000/api/search?q=world+cup

# 4. 获取足球赛事列表
curl http://localhost:3000/api/events?type=football

# 5. 创建订单（需登录 session）
curl -b cookies.txt \
  -X POST http://localhost:3000/api/user/orders \
  -H "Content-Type: application/json" \
  -d '{"itemType":"event","itemId":"EVENT_ID","quantity":2}'

# 6. 创建挂单
curl -b cookies.txt \
  -X POST http://localhost:3000/api/user/listings \
  -H "Content-Type: application/json" \
  -d '{"itemType":"event","itemId":"EVENT_ID","askPrice":150,"quantity":1}'
```

---

## 相关项目

本项目为独立项目，无外部依赖仓库。

---

## License

[MIT](LICENSE)
