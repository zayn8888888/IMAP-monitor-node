# 邮件服务器项目

这是一个基于 Node.js 的邮件服务器项目，用于接收和处理电子邮件。

## 功能特性

- 通过 IMAP 协议实时接收邮件
- 自动解析邮件内容和附件
- 支持邮件标记为已读
- 可配置的邮件服务器连接参数

## 快速开始

### 环境要求

- Node.js 16.x 或更高版本
- npm 8.x 或更高版本

### 安装步骤

1. 克隆项目：

   ```bash
   git clone https://github.com/HuangZumao/IMAP-monitor-node.git
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 配置环境变量：
   复制 `.env.example` 文件并重命名为 `.env`，然后根据实际情况修改配置：

   ```env
   EMAIL_USER=your-email@example.com
   EMAIL_PASSWORD=your-password
   IMAP_HOST=imap.example.com
   IMAP_HOST_PORT=993
   ```

4. 启动项目：

   ```bash
   node index
   ```

5. 后台运行

   ```bash
    npm install -g pm2
    pm2 start index.js --name "mail-monitor"  --output log/output.log --error log/error.log

   ```

## 配置说明

### 环境变量

| 变量名         | 描述            | 示例值                 |
| -------------- | --------------- | ---------------------- |
| EMAIL_USER     | 邮箱账号        | your-email@example.com |
| EMAIL_PASSWORD | 邮箱密码        | your-password          |
| IMAP_HOST      | IMAP 服务器地址 | imap.example.com       |
| IMAP_HOST_PORT | IMAP 服务器端口 | 993                    |

## 项目结构

```
mail-server/
├── src/                  # 源代码目录
│   ├── imap.js           # IMAP 连接和邮件处理
│   └── mailParser.js     # 邮件解析器
├── .env                  # 环境变量配置文件
├── .gitignore            # Git 忽略文件
├── package.json          # 项目依赖和脚本
└── README.md             # 项目说明文档
```
