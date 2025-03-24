const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const URL = require('../model/url');

router.get('/', (req, res) => {
  res.render('index');
});

router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortId = nanoid(6);
  
  try {
    await URL.create({
      shortId,
      originalUrl,
      createdAt: new Date()
    });
    res.json({ shortUrl: `${process.env.BASE_URL}/${shortId}` });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:shortId', async (req, res) => {
  try {
    const url = await URL.findOne({ shortId: req.params.shortId });
    if (!url) return res.status(404).send('URL not found');
    
    // First ad page
    res.render('ad1', { shortId: req.params.shortId });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

router.get('/ad2/:shortId', (req, res) => {
  // Second ad page
  res.render('ad2', { shortId: req.params.shortId });
});

module.exports = router;
