import express from 'express';
import { checkDomainBatch } from '../services/domainService.js';

const router = express.Router();

router.post('/check-domains', async (req, res) => {
  try {
    const { domains } = req.body;
    
    if (!domains || !Array.isArray(domains)) {
      return res.status(400).json({ error: 'Invalid domains array' });
    }

    const results = await checkDomainBatch(domains);
    res.json({ results });
  } catch (error) {
    console.error('Error processing domains:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;