import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { google } from "googleapis";

const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
];

// Initialize the OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const authStart = asyncHandler(async (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        "state": req.user?._id.toString()
    });
    console.log("userId",req.user?._id.toString());
    console.log("Google Auth URL:", url);
    res.redirect(url);
});

const callBack = asyncHandler(async (req, res) => {
  console.log(req.query);
  const { code, state } = req.query;
  const userId = state; 
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log("userId", userId, tokens);
    await User.findByIdAndUpdate(userId, {
        googleAccessToken: tokens.access_token,
        googleRefreshToken: tokens.refresh_token,
    });
    res.redirect('http://localhost:5173/dashboard');
  } catch (error) {
    res.status(500).send('Authentication failed');
  }
})

export {authStart, callBack};

