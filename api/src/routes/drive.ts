import { Router, Request, Response, NextFunction } from 'express';
import { getDriveClient, getFolders, getImagesFromFolders, getImageFile } from '../services/google';
import { GaxiosError } from 'gaxios';

const router = Router();

// Middleware to check for session and accountId
const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const accountId = req.query.accountId as string;
  if (!req.session.tokens || !accountId || !req.session.tokens[accountId]) {
    return res.status(401).json({ error: 'Unauthorized: No session or account not connected.' });
  }
  next();
};

router.get('/folders', checkAuth, async (req, res) => {
  const accountId = req.query.accountId as string;
  try {
    const drive = getDriveClient(req.session, accountId);
    const folders = await getFolders(drive);
    res.json(folders);
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ error: 'Failed to fetch folders' });
  }
});

router.get('/images', checkAuth, async (req, res) => {
  const folderIds = req.query.folderIds as string;
  const accountId = req.query.accountId as string;

  if (!folderIds) {
    return res.status(400).json({ error: 'folderIds query parameter is required' });
  }

  try {
    const drive = getDriveClient(req.session, accountId);
    const images = await getImagesFromFolders(drive, folderIds.split(','));
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

router.get('/image/:fileId', checkAuth, async (req, res) => {
    const { fileId } = req.params;
    const accountId = req.query.accountId as string;

    try {
        const drive = getDriveClient(req.session, accountId);
        const { data, headers } = await getImageFile(drive, fileId);
        res.setHeader('Content-Type', headers['content-type']);
        res.setHeader('Content-Length', headers['content-length']);
        data.pipe(res);
    } catch (err) {
        const error = err as GaxiosError;
        console.error(`Error proxying image ${fileId}:`, error.message);
        if (error.response?.status === 404) {
            res.status(404).send('Image not found');
        } else {
            res.status(500).send('Failed to retrieve image');
        }
    }
});

export default router;