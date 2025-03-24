const Imap = require("node-imap");
const { simpleParser } = require("mailparser");
require("dotenv").config(); // 从.env加载敏感信息
const imapConfig = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.IMAP_HOST,
  port: process.env.IMAP_HOST_PORT,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false, // 临时绕过证书验证（）
  },
  authTimeout: 30000, // 延长认证超时到 30 秒（）
  connTimeout: 20000, // 延长连接超时到 20 秒
  keepAlive: true, // 启用保持连接
  keepAliveInterval: 30000, // 每30秒发送一次保持连接信号
};

// 初始化 IMAP 连接
let imap;
let mailHandler;
const connectImap = (mailHandler2) => {
  if (imap) {
    imap.end();
  }
  if (mailHandler2) mailHandler = mailHandler2;
  imap = null;
  // 创建 IMAP 连接
  imap = new Imap(imapConfig);
  // 连接事件处理
  imap.once("ready", () => {
    console.log("IMAP 连接就绪");
    openInbox((err) => {
      if (err) throw err;
      console.log("收件箱打开成功");
      // 开始监听新邮件
      startListening();
    });
  });

  imap.once("error", (err) => {
    console.error("IMAP 连接错误:", err);
    // 添加自动重连
    setTimeout(() => {
      console.log("尝试重新连接...");
      connectImap();
    }, 5000); // 5秒后重连
  });

  imap.once("end", () => {
    console.log("IMAP 连接已终止");
  });
  imap.connect();
};

// 打开收件箱
function openInbox(cb) {
  imap.openBox("INBOX", true, cb); // 第二个参数为是否自动标记已读
}

// 开始监听新邮件
function startListening() {
  // 实时监听新邮件事件
  imap.on("mail", (numNewMsgs) => {
    console.log(`检测到 ${numNewMsgs} 封新邮件`);
    fetchUnseenEmails();
  });

  // 定时检查连接（可选）
  setInterval(() => {
    if (imap.state !== "authenticated") {
      console.log("尝试重新连接...");
      connectImap();
    } else {
      console.log("当前连接良好");
    }
  }, 60000); // 每1min检查一次
}

// 获取未读邮件
function fetchUnseenEmails() {
  imap.search(["UNSEEN"], (err, results) => {
    if (err || !results.length) return;
    console.log(`获取最新邮件`);
    const uid = results[results.length - 1];
    const fetch = imap.fetch(uid, { bodies: "" });

    fetch.on("message", (msg) => {
      console.log("开始处理邮件消息");

      msg.on("body", (stream) => {
        let buffer = "";
        stream.on("data", (chunk) => {
          buffer += chunk.toString("utf8");
        });

        stream.on("end", async () => {
          console.log("邮件内容接收完成");
          try {
            // 解析邮件数据
            parsedData = await simpleParser(buffer);
            processEmail(parsedData);
          } catch (parseErr) {
            console.error("邮件解析失败:", parseErr);
          }
        });
      });

      msg.on("error", (msgErr) => {
        console.error("邮件消息处理错误:", msgErr);
      });
    });

    fetch.on("error", (fetchErr) => {
      console.error("邮件获取失败:", fetchErr);
    });

    fetch.on("end", () => {
      console.log("邮件获取过程结束");
    });
  });
}

// 处理解析后的邮件数据
function processEmail(email) {
  mailHandler && mailHandler(email); // 标记为已读（谨慎操作）
  if (email.messageId) {
    imap.search(
      [["HEADER", "Message-ID", email.messageId]], // 使用正确的HEADER搜索格式
      (err, results) => {
        if (err || !results.length) return;
        const uid = results[0];
        imap.addFlags(uid, ["\\Seen"], (err) => {
          if (err) console.error("标记已读失败:", err);
          else {
            console.log("邮件已标记为已读");
          }
        });
      }
    );
  } else {
    console.warn("无法标记为已读：缺少messageId");
  }
}
const imapHandler = (func) => {
  func(imap);
};

module.exports = {
  connectImap,
  imapHandler,
};
