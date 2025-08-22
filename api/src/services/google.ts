import { google, Auth, drive_v3 } from 'googleapis';
import { Session, SessionData } from 'express-session';

// Extend the express-session type
declare module 'express-session' {
  interface SessionData {
    tokens?: { [accountId: string]: Auth.Credentials };
    accountIds?: string[];
  }
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.API_BASE_URL || `http://localhost:${process.env.API_PORT}`}/auth/google/callback`
);

export const getOAuthClient = (): Auth.OAuth2Client => {
  return oauth2Client;
};

export const getGoogleAuthUrl = (): string => {
  const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
};

export const setGoogleAuthCredentials = (session: Session & Partial<SessionData>, accountId: string, tokens: Auth.Credentials) => {
  if (!session.tokens) {
    session.tokens = {};
  }
  session.tokens[accountId] = tokens;
};

export const getDriveClient = (session: Session & Partial<SessionData>, accountId: string): drive_v3.Drive => {
    const client = getOAuthClient();
    if (session.tokens && session.tokens[accountId]) {
        client.setCredentials(session.tokens[accountId]);
        return google.drive({ version: 'v3', auth: client });
    }
    throw new Error('User not authenticated for the given account ID');
};

export const clearAccount = (session: Session & Partial<SessionData>, accountId: string) => {
    if (session.tokens) delete session.tokens[accountId];
    if (session.accountIds) {
        session.accountIds = session.accountIds.filter(id => id !== accountId);
    }
}

export const getFolders = async (drive: drive_v3.Drive) => {
  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.folder' and trashed = false",
    fields: 'files(id, name, iconLink)',
    spaces: 'drive',
  });
  return res.data.files;
};

export const getImagesFromFolders = async (drive: drive_v3.Drive, folderIds: string[]) => {
    const queries = folderIds.map(id => `'${id}' in parents`).join(' or ');
    const res = await drive.files.list({
        q: `(${queries}) and (mimeType='image/jpeg' or mimeType='image/png' or mimeType='image/gif') and trashed = false`,
        fields: 'files(id, name, webContentLink, thumbnailLink, createdTime)',
        pageSize: 1000,
    });
    return res.data.files;
};

export const getImageFile = async (drive: drive_v3.Drive, fileId: string) => {
    return drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
    );
};