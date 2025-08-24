const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 支持较大的附件

// SendGrid邮件发送端点
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text, attachments } = req.body;
    
    // 验证必需字段
    if (!to || !subject || !text) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, text'
      });
    }

    // 验证SendGrid API密钥
    if (!process.env.SENDGRID_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'SendGrid API key not configured'
      });
    }

    // 准备SendGrid邮件数据
    const emailData = {
      personalizations: [
        {
          to: [{ email: to }],
          subject: subject
        }
      ],
      from: {
        email: 'noreply@carenexus.com', // 替换为你验证的邮箱
        name: 'CareNexus'
      },
      content: [
        {
          type: 'text/plain',
          value: text
        }
      ]
    };

    // 添加附件（如果有）
    if (attachments && attachments.length > 0) {
      emailData.attachments = attachments;
    }

    // 调用SendGrid API
    const response = await axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      emailData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status === 202) {
      res.json({
        success: true,
        message: 'Email sent successfully'
      });
    } else {
      res.status(response.status).json({
        success: false,
        message: 'Failed to send email'
      });
    }

  } catch (error) {
    console.error('Email sending error:', error);
    
    if (error.response) {
      // SendGrid API错误
      const errorMsg = error.response.data?.errors?.[0]?.message || 'Unknown SendGrid error';
      res.status(error.response.status).json({
        success: false,
        message: `SendGrid API Error: ${errorMsg}`
      });
    } else {
      // 其他错误
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
});

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Email server is running' });
});

app.listen(PORT, () => {
  console.log(`Email server running on http://localhost:${PORT}`);
  console.log(`SendGrid API key configured: ${process.env.SENDGRID_API_KEY ? 'Yes' : 'No'}`);
});
