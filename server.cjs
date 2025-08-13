require('dotenv').config();
const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', upload.single('attachment'), (req, res) => {
  const { to, subject, text } = req.body;
  const attachment = req.file;

  const msg = {
    to,
    from: 'zwan0602@student.monash.edu', // Change to your verified sender
    subject,
    text,
    attachments: [],
  };

  if (attachment) {
    const attachmentData = fs.readFileSync(attachment.path);
    msg.attachments.push({
      content: attachmentData.toString('base64'),
      filename: attachment.originalname,
      type: attachment.mimetype,
      disposition: 'attachment',
    });
  }

  sgMail
    .send(msg)
    .then(() => {
      if (attachment) {
        fs.unlinkSync(attachment.path); // Clean up the uploaded file
      }
      res.status(200).send('Email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending email:');
      if (error.response) {
        console.error(JSON.stringify(error.response.body, null, 2));
      } else {
        console.error(error);
      }
      if (attachment) {
        fs.unlinkSync(attachment.path); // Clean up the uploaded file
      }
      res.status(500).send('Error sending email');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});