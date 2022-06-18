const auth = require('../middleware/auth');
const express = require("express");
const router = express.Router();
const ShortUrlController = require('../controllers/shortUrl');

router.get('/getUrl', auth, ShortUrlController.getUrl);
router.get('/allUrls', ShortUrlController.getAllUrls);
router.get('/shortUrls', auth, ShortUrlController.getAllUrlsForUser );
router.get ('/:code', auth, ShortUrlController.redirectUrl);

module.exports = router;