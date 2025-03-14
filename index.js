const { connectImap } = require("./mail");
connectImap((email) => {
  console.log(email);
  console.log("--- 收到新邮件 ---");
  console.log(`发件人: ${email.from.value[0].address}`);
  console.log(`收件人: ${email.to.value[0].address}`);
  console.log(`主题: ${email.subject}`);
  console.log(`正文预览: ${email.text?.substring(0, 100)}...`);

  // 处理附件
  if (email.attachments.length > 0) {
    console.log(`包含 ${email.attachments.length} 个附件:`);
    email.attachments.forEach((attachment, index) => {
      console.log(
        `附件 ${index + 1}: ${attachment.filename} (${attachment.size} bytes)`
      );
    });
  }
});
