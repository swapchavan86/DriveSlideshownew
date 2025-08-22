import { Router } from 'express';
import { getOAuthClient, getGoogleAuthUrl, setGoogleAuthCredentials, clearAccount } from '../services/google';
import { drive_v3 } from 'googleapis';

const router = Router();

// In-memory store for user info. In a real app, use a database.
const userProfiles: Record<string, any> = {};

router.get('/google', (req, res) => {
  const authUrl = getGoogleAuthUrl();
  res.redirect(authUrl);
});

router.get('/google/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }
  try {
    const oAuth2Client = getOAuthClient();
    const { tokens } = await oAuth2Client.getToken(code);
    
    // Store tokens in session, linked to a unique user session ID
    if (!req.session.accountIds) {
      req.session.accountIds = [];
    }

    // Use a simple hash of the access token as a unique ID for the account.
    const accountId = Buffer.from(tokens.access_token!).toString('base64').substring(0, 16);
    req.session.tokens = req.session.tokens || {};
    req.session.tokens[accountId] = tokens;
    
    // Fetch user profile to get email/name
    oAuth2Client.setCredentials(tokens);
    const drive = new drive_v3.Drive({ auth: oAuth2Client });
    const about = await drive.about.get({ fields: 'user' });
    userProfiles[accountId] = about.data.user;

    if (!req.session.accountIds.includes(accountId)) {
        req.session.accountIds.push(accountId);
    }

    res.redirect(`${process.env.UI_ORIGIN}`);
  } catch (error) {
    console.error('Error during Google OAuth callback', error);
    res.status(500).send('Authentication failed');
  }
});

router.get('/accounts', (req, res) => {
    if (!req.session.accountIds || req.session.accountIds.length === 0) {
        return res.json([]);
    }
    const accounts = req.session.accountIds.map(id => ({
        id,
        ...userProfiles[id]
    }));
    res.json(accounts);
});


router.post('/logout/:accountId', (req, res) => {
    const { accountId } = req.params;
    if (req.session.accountIds && req.session.tokens) {
        clearAccount(req.session, accountId);
        delete userProfiles[accountId];
        res.status(200).json({ message: 'Account logged out successfully.' });
    } else {
        res.status(400).json({ message: 'No active session or account found.' });
    }
});


export default router;
