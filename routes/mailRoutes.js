const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const querystring = require("querystring");
require("dotenv").config();
const axios = require("axios");
const session = require("express-session");
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');


// router.use(fileUpload());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

router.use(
  session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours session timeout
    },
  })
);

// receive the tokens and user info
router.get("/", async (req, res) => {
  console.log('its coming for getting access token');
  
  const { code } = req.query;

  if (code) {
    try {
      const tokenResponse = await fetch("https://accounts.zoho.com/oauth/v2/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: querystring.stringify({
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
          }),
        }
      );

      const tokenData = await tokenResponse.json();

      if (tokenData.access_token && tokenData.refresh_token) {
        console.log("Access Token:", tokenData.access_token);
        console.log("Refresh Token:", tokenData.refresh_token);

        const accountInfoResponse = await fetch("https://mail.zoho.com/api/accounts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        const accountInfo = await accountInfoResponse.json();
        // console.log("ac",accountInfo);

        const accountId = accountInfo.data[0].accountId;  
        console.log("Account ID",accountId);

        const mailaddress = accountInfo.data[0].mailboxAddress;
        console.log("Mail address:",mailaddress);
        


        // Store accountId and tokens in the session
        req.session.accountId = accountId;
        req.session.mailboxAddress = mailaddress;
        console.log(req.session.accountId);
        console.log("sjsvhv:",mailaddress);
        req.session.tokens = req.session.tokens || {};
        req.session.tokens.accessToken = tokenData.access_token;
        req.session.tokens.refreshToken = tokenData.refresh_token;

        // Fetch user information from Zoho
        const userInfoResponse = await fetch("https://meeting.zoho.com/api/v2/user.json",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
            },
          }
        );

        if (!userInfoResponse.ok) {
          throw new Error("Failed to fetch user info from Zoho");
        }

        const user = await userInfoResponse.json();

        if (
          !user.userDetails || !user.userDetails.zsoid || !user.userDetails.zuid) {
          console.error("Error: ZSOID or ZUID not found in Zoho response");
          throw new Error("ZSOID or ZUID not found in Zoho response");
        }

        const folderResponse = await fetch(`https://mail.zoho.com/api/accounts/${accountId}/folders`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        });

        if (!folderResponse.ok) {
          throw new Error("Failed to fetch folders");
        }

        const foldersData = await folderResponse.json();
        // console.log("Fetched Folders:", foldersData);
        // console.log("Fetched Folders:", foldersData.data.folderType);

        if (foldersData.data && foldersData.data.length > 0) {
          const folderId = foldersData.data[0].folderId; // Get the folderId of the first folder
          console.log("Folder ID:", folderId);
          req.session.folderId = folderId; // Store folderId in session for later access
        }

        res.send(`
                    <script>
                        alert('Tokens received successfully!');
                        window.sessionStorage.setItem('mailaddress', '${mailaddress}');
                        window.location.href = '/html/mail/mailHome.html';  
                    </script>
                `);
      } else {
        console.error(
          "Failed to get access token and refresh token:",
          tokenData
        );
        res.status(400).send("Failed to get access token and refresh token.");
      }
    } catch (error) {
      console.error("Error during OAuth request:", error);
      res.status(500).send(`Internal server error: ${error.message}`);
    }
  } else {
    res.status(400).send("Authorization code not found in the URL.");
  }
});

// Endpoint to get the user's mail address
router.get('/getMailAddress', (req, res) => {
  const { mailboxAddress } = req.session;
  if (mailboxAddress) {
    res.json({ mailaddress: mailboxAddress });
  } else {
    res.status(400).json({ error: 'No mail address found in session' });
  }
});

//attachment 
router.post('/uploadAttachment', async (req, res) => {
  const { accessToken } = req.session.tokens || {};
  const { accountId } = req.session;

  try {
    if (!req.files || !req.files.file) {
      return res.status(400).send('No file uploaded.');
    }

    const file = req.files.file; // Access uploaded file
    const uploadsDir = path.join(__dirname, 'uploads'); // Directory path for uploads

    // Check if the uploads directory exists, if not, create it
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
    }

    const tempFilePath = path.join(uploadsDir, file.name); // Save to a temp path inside 'uploads' directory

    // Move the file to a temporary folder
    file.mv(tempFilePath, async (err) => {
      if (err) {
        console.error('Error moving file:', err);
        return res.status(500).send('Error moving file.');
      }

      try {
        // Prepare form data for Zoho file upload
        const formData = new FormData();
        formData.append('attach', fs.createReadStream(tempFilePath)); // Pass the correct file path
        formData.append('uploadType', 'multipart'); // Specify the upload type
        formData.append('isInline', 'false'); // Set inline to false for non-inline attachments

        // Send the file to Zoho's file upload API
        const response = await axios.post(`https://mail.zoho.com/api/accounts/${accountId}/messages/attachments?uploadType=multipart`, formData, {
          headers: {
            "Authorization": `Zoho-oauthtoken ${accessToken}`,
            'Content-Type': 'multipart/form-data',
          }
        });

        console.log('Zoho API Response:', response.data);

        // Handle Zoho's response and get the attachment information
        const { storeName, attachmentName, attachmentPath } = response.data.data[0];
        res.json({ storeName, attachmentName, attachmentPath });

        // Optionally delete the file after uploading (if you no longer need it on your server)
        fs.unlink(tempFilePath, (err) => {
          if (err) {
            console.error('Failed to delete temp file:', err);
          }
        });
      } catch (error) {
        console.error('Error uploading file to Zoho:', error);
        res.status(500).json({ error: 'Failed to upload file to Zoho', details: error.message });
      }
    });
  } catch (error) {
    console.error('Error in /uploadAttachment:', error);
    res.status(500).send('Internal server error during file upload');
  }
});



//Send Mail
router.post('/sendMail', async (req, res) => {
  console.log("sending mail / server side");
  
  const { accessToken } = req.session.tokens || {};  
  const { accountId } = req.session;

  const { from, to, cc, subject, message, attachments  } = req.body;

  if (!accountId || !accessToken || !from || !to || !subject || !message) {
    return res.status(400).json({ error: "Missing required fields (Account ID, Access Token, From, To, Subject, Message)" });
  }

  const emailAttachments = attachments && attachments.length > 0 ? attachments : [];

  const emailData = {
    fromAddress : from ,
    toAddress : to,
    ccAddress : cc || '',
    bccAddress : '',
    subject : subject,
    content : message,
    attachments: emailAttachments, // Attachments are passed here
    askReceipt : "yes",
    mailFormat: "html" 
  };

  try{
  const response = await axios.post(`https://mail.zoho.com/api/accounts/${accountId}/messages`, 
      emailData,{
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Zoho-oauthtoken ${accessToken}`
        }
      }
    );

 
    if (response.status === 200) {
      res.status(200).json(response.data);
    } else {
      console.error('Error sending email via Zoho:', response.status, response.data);
      res.status(500).json({ error: "Failed to send email via Zoho", details: response.data });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});
router.post('/replyMail', async (req, res) => {
  console.log("Reply mail / server side");

  const { accessToken } = req.session.tokens || {};  
  const { accountId } = req.session;
  const { messageId } = req.query;  // messageId from URL query
  const { from, to, cc, subject, message, attachments } = req.body;

  if (!accountId || !accessToken || !messageId || !from || !to || !subject || !message) {
      return res.status(400).json({ error: "Missing required fields (Account ID, Access Token, From, To, Subject, Message, or Message ID)" });
  }

  const emailAttachments = attachments && attachments.length > 0 ? attachments : [];

  const emailData = {
      fromAddress: from,
      toAddress: to,
      ccAddress: cc || '',
      bccAddress: '',
      subject: subject,
      content: message,
      attachments: emailAttachments,  // Attachments passed here
      askReceipt: "yes",
      action: "reply",  // Specify that this is a reply
      mailFormat: "html"
  };

  try {
      // Sending the reply to Zoho Mail API
      const response = await axios.post(`https://mail.zoho.com/api/accounts/${accountId}/messages/${messageId}`, emailData, {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Zoho-oauthtoken ${accessToken}`
          }
      });

      if (response.status === 200) {
          res.status(200).json(response.data);  // Return successful reply response
      } else {
          console.error('Error replying to email via Zoho:', response.status, response.data);
          res.status(500).json({ error: "Failed to send reply email", details: response.data });
      }
  } catch (error) {
      console.error('Error replying to email:', error);
      res.status(500).json({ error: "Failed to send reply email", details: error.message });
  }
});


// router.get('/getEmailReply', async (req, res) => {
//   console.log("Fetching email data for reply");

//   // Extract messageId from query params
//   const { messageId } = req.query;
//   const { accountId } = req.session;
//   const { accessToken } = req.session.tokens || {};  // Ensure access token is available

//   // Check if all necessary data is available
//   if (!messageId || !accountId || !accessToken) {
//       return res.status(400).json({ error: "Missing messageId, accountId, or accessToken" });
//   }

//   try {
//       // Log for debugging purposes
//       console.log(`Fetching email with messageId: ${messageId} for accountId: ${accountId}`);

//       // Call Zoho API to fetch the email details
//       const response = await axios.get(`https://mail.zoho.com/api/accounts/${accountId}/messages/${messageId}originalmessage`, {
//           headers: {
//               "Accept": "application/json",
//               "Content-Type": "application/json",
//               "Authorization": `Zoho-oauthtoken ${accessToken}`
//           }
//       });

//       // Log the full response object from Zoho API for debugging
//       console.log("Zoho API Response:", JSON.stringify(response.data, null, 2)); // Pretty-print the response
//       // Check for success status
//       if (response.status === 200) {
//           // Return the email data needed for reply
//           const emailData = response.data.data; // Assuming Zoho API returns email data in `data`
//           res.status(200).json({
//               subject: emailData.subject,
//               fromAddress: emailData.fromAddress,
//               receivedTime: emailData.receivedTime,  // You might want to format this timestamp
//               content: emailData.content  // This could be HTML content, so you might need to convert it
//           });
//       } else {
//           console.error('Error fetching email data from Zoho:', response.status, response.data);
//           res.status(500).json({ error: "Failed to fetch email data" });
//       }
//   } catch (error) {
//       console.error('Error fetching email data:', error);
//       res.status(500).json({ error: "Failed to fetch email data", details: error.message });
//   }
// });

//reply mail;
router.get('/getReplyMail', async (req, res) => {
  console.log("reply page server-side");

  const { accessToken } = req.session.tokens || {};
  const { accountId } = req.session;
  const { folderId, messageId } = req.query;

  console.log("Received Message ID:", messageId);
  console.log("Received Folder ID:", folderId);

  if (!accountId || !accessToken || !messageId || !folderId) {
    return res.status(400).send("Account ID, Access Token, Folder ID, or Message ID not found.");
  }

  try {
    const contentResponse = await axios.get(`https://mail.zoho.com/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/content`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Zoho-oauthtoken ${accessToken}`
      }
    });

    if (contentResponse.status !== 200) {
      throw new Error('Failed to fetch email content');
    }

    const emailContent = contentResponse.data;
    console.log("Email Content:", emailContent);

    const detailsResponse = await axios.get(`https://mail.zoho.com/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/details`, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Zoho-oauthtoken ${accessToken}`
      }
    });

    if (detailsResponse.status !== 200) {
      throw new Error('Failed to fetch email details');
    }

    const emailDetails = detailsResponse.data;
    console.log("Email Details:", emailDetails);

    // Combine both the content and details into one response
    const responsePayload = {
      content: emailContent,
      details: emailDetails
    };

    // Send combined response
    res.json(responsePayload);

  } catch (error) {
    console.error('Error fetching email data:', error);
    res.status(500).send('Internal server error');
  }
});


// list emails
router.get("/mailList", async (req, res) => {
  console.log("Getting mails");

  const { accessToken } = req.session.tokens || {};  
  const { accountId } = req.session;  
  const { folderId } = req.query; 
  
  if (!accountId || !accessToken || !folderId) {
    return res.status(400).send("Account ID, Access Token, or Folder ID not found.");
  }

  console.log("Account ID:", accountId);
  console.log("Folder ID:", folderId);

  try {
    // Make the API request to fetch the emails in the specified folder
    const response = await axios.get(`https://mail.zoho.com/api/accounts/${accountId}/messages/view`, {
      params: {
        folderId: folderId,          
        threadedMails: true,         
        includeto: true              
      },
      headers: {
        'Authorization': `Bearer ${accessToken}`,  
        'Accept': 'application/json',              
        'Content-Type': 'application/json'         
      }
    });

    if (response.status !== 200) {
      throw new Error('Failed to fetch emails');
    }

    const emails = response.data;
    console.log("Emails:", emails);
    res.json(emails); 

  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send('Internal server error');
  }
});

//email content view
router.get('/getDetailedMail', async (req , res ) => {
  console.log("getDetailedMail called");   

  const { accessToken } = req.session.tokens || {};  
  const { accountId } = req.session;  
  const { folderId, messageId } = req.query;  

  console.log("Received Message ID:", messageId); 
  console.log("Received Folder ID:", folderId); 

  
  if (!accountId || !accessToken || !messageId || !folderId) {
    return res.status(400).send("Account ID, Access Token, Folder ID, or Message ID not found.");
  }
  try{
    const response = await axios.get(`https://mail.zoho.com/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}/content`,{ 
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Zoho-oauthtoken ${accessToken}`
          }
        });
      
      if (response.status !== 200) {
        throw new Error('Failed to fetch email content');
      }
  
      const emailContent = response.data;
      console.log(response.data);
      console.log("Email Content:", emailContent);

      res.json(emailContent); 
  
    } catch (error) {
      console.error('Error fetching email content:', error);
      res.status(500).send('Internal server error');
    }
  });

// Delete mail
router.delete('/deleteMail', async (req, res) => {
  console.log("Delete mail called");

  const { accessToken } = req.session.tokens || {};  
  const { accountId } = req.session;  
  const { folderId, messageId } = req.query;

  console.log("Received Message ID:", messageId);
  console.log("Received Folder ID:", folderId);

  if (!accountId || !accessToken || !messageId || !folderId) {
      return res.status(400).send("Account ID, Access Token, Folder ID, or Message ID not found.");
  }

  try {
      const response = await axios.delete(`https://mail.zoho.com/api/accounts/${accountId}/folders/${folderId}/messages/${messageId}`, {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Zoho-oauthtoken ${accessToken}`
          }
      });

      if (response.status !== 200) {
          throw new Error('Delete failed');
      }

      // Return a success message after email deletion
      res.json({ message: "Email deleted successfully" });
  } catch (error) {
      console.error('Error deleting email:', error);
      res.status(500).send('Internal server error');
  }
});

module.exports = router;