import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { google } from "googleapis";

const getAuthenticatedClient = asyncHandler(async function getAuthenticatedClient(req, res, next) {
    const user = await User.findById(req.user._id); 

    if (!user || !user.googleAccessToken) {
        return res.status(401).send('User not authenticated with Google');
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
        access_token: user.googleAccessToken,
        refresh_token: user.googleRefreshToken
    });

    // Handle token expiration
    // The googleapis library can handle refreshing tokens automatically if you listen to the 'tokens' event
    oauth2Client.on('tokens', (tokens) => {
        if (tokens.refresh_token) {
            user.googleRefreshToken = tokens.refresh_token;
        }
        user.googleAccessToken = tokens.access_token;
        user.save();
    });

    req.googleClient = oauth2Client;
    next();
})

export { getAuthenticatedClient }

// Middleware to get a user's tokens and create an authenticated client
