const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const querystring = require("querystring");
require("dotenv").config();
const axios = require("axios");
const session = require("express-session");

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
  const { code } = req.query;

  if (code) {
    try {
      const tokenResponse = await fetch(
        "https://accounts.zoho.in/oauth/v2/token",
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

        req.session.userId = "user_" + Date.now();
        const userId = req.session.userId;

        req.session.tokens = req.session.tokens || {}; // Initialize if not set
        req.session.tokens[userId] = {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        };

        // Fetch user information from Zoho
        const userInfoResponse = await fetch(
          "https://meeting.zoho.in/api/v2/user.json",
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
          !user.userDetails ||
          !user.userDetails.zsoid ||
          !user.userDetails.zuid
        ) {
          console.error("Error: ZSOID or ZUID not found in Zoho response");
          throw new Error("ZSOID or ZUID not found in Zoho response");
        }

        req.session.user = user;
        console.log(
          `ZSOID: ${user.userDetails.zsoid}, ZUID: ${user.userDetails.zuid}`
        );
        res.send(`
                    <script>
                        alert('Tokens received successfully!');
                        window.location.href = '/html/meeting/meetingHome.html';  
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

// fetch meetings list
router.get("/meetingslist", async (req, res) => {
  const zsoid = req.session.user ? req.session.user.userDetails.zsoid : null;
  let accessToken =
    req.session.tokens && req.session.tokens[req.session.userId]
      ? req.session.tokens[req.session.userId].accessToken
      : null;

  if (!zsoid || !accessToken) {
    return res
      .status(400)
      .send("User not authenticated or missing session data");
  }

  try {
    let response = await axios.get(
      `https://meeting.zoho.in/api/v2/${zsoid}/sessions.json`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );
    if (response.status == 200) {
      // console.log(response.data)
    }
    res.json({ data: response.data });
  } catch (error) {
    console.log(error.response && error.response.status === 401);
  }
});

// Route to get meeting details
router.get("/getmeetingdetails", async (req, res) => {
  const meetingKey = req.query.meetingKey;
  const zsoid = req.session.user ? req.session.user.userDetails.zsoid : null;
  let accessToken =
    req.session.tokens && req.session.tokens[req.session.userId]
      ? req.session.tokens[req.session.userId].accessToken
      : null;

  if (!meetingKey || !zsoid || !accessToken) {
    return res.status(400).send("Missing meetingKey or authentication data");
  }

  try {
    let response = await axios.get(
      `https://meeting.zoho.in/api/v2/${zsoid}/sessions/${meetingKey}.json`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    // if (response.status === 200) {
    // console.log('Specific Meeting Data:', response.data);
    // }

    // Send the meeting details back in the response to the client
    res.json({ data: response.data });
  } catch (error) {
    console.error("Error fetching meeting details from Zoho:", error);
    res.status(500).json({ error: "Error fetching meeting details" });
  }
});

//delete meeting

router.delete("/deletemeeting", async (req, res) => {
  const meetingKey = req.body.meetingKey;
  const zsoid = req.session.user ? req.session.user.userDetails.zsoid : null;
  const accessToken =
    req.session.tokens && req.session.tokens[req.session.userId]
      ? req.session.tokens[req.session.userId].accessToken
      : null;
  console.log(zsoid);
  console.log(accessToken);
  console.log(meetingKey);

  if (!accessToken || !zsoid || !meetingKey) {
    console.log("Missing parameters");
    return res.status(400).send("Missing parameters");
  }

  try {
    let response = await axios.delete(
      `https://meeting.zoho.in/api/v2/${zsoid}/sessions/${meetingKey}.json`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );
    console.log("Meeting deleted successfully", response.data);
    return res.status(200).send("Meeting deleted successfully");
  } catch (error) {
    console.error(
      "Error deleting meeting:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).send("Error deleting meeting");
  }
});

//create meeting
router.post("/schedulingmeeting", async (req, res) => {
  console.log("Session Data:", req.session);

  const zsoid = req.session.user ? req.session.user.userDetails.zsoid : null;
  const zuid = req.session.user ? req.session.user.userDetails.zuid : null;
  const userId = req.session.userId;
  const accessToken =
    req.session.tokens && req.session.tokens[userId]
      ? req.session.tokens[userId].accessToken
      : null;

  console.log("userId from session:", userId);
  console.log("Access Token from session:", accessToken);
  // console.log('ZSOID from session:', zsoid);
  console.log("ZUID from session:", zuid);

  if (!zsoid || !zuid || !accessToken) {
    console.error("Session or ZSOID, zuid not found");
    return res.status(400).send("Session or ZSOID not found");
  }

  const meetingDetails = req.body.session;
  // console.log('Meeting details:', meetingDetails);

  try {
    // Send a request to Zoho API to schedule the meeting
    const response = await axios.post(
      `https://meeting.zoho.in/api/v2/${zsoid}/sessions.json`,
      meetingDetails,
      {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      console.log("Meeting scheduled successfully:", response.data);
      res.status(200).send(response.data);
    } else {
      console.error("Failed to schedule meeting:", response.data);
      res.status(400).send("Failed to schedule meeting with Zoho.");
    }
  } catch (error) {
    console.error(
      "Error scheduling meeting:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Internal server error while scheduling the meeting.");
  }
});

router.get("/getZuid", (req, res) => {
  const zuid = req.session.user ? req.session.user.userDetails.zuid : null;

  if (zuid) {
    res.json({ zuid });
  } else {
    res.status(400).send("ZUID not found");
  }
});

//edit
router.put("/updatemeeting", async (req, res) => {
  const meetingKey = req.body.meetingKey;
  const data = req.body.session;
  console.log( data)

  const zsoid = req.session.user ? req.session.user.userDetails.zsoid : null;
  const accessToken = req.session.tokens && req.session.tokens[req.session.userId] ? req.session.tokens[req.session.userId].accessToken : null;

  if (!zsoid || !accessToken) {
    return res.status(400).send("Invalid Zoho credentials.");
  }

  try {
    const response = await axios.put(
      `https://meeting.zoho.in/api/v2/${zsoid}/sessions/${meetingKey}.json`, data,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
    }
    );

    console.log("Meeting updated successfully", response.data);
    return res.status(200).send(response.data);
  } catch (error) {
    console.log(error.message);

    console.error("Meeting update failure", error.response ? error.response.data : error.message);
    return res.status(500).send("Failed to update meeting.");
  }
});

module.exports = router;