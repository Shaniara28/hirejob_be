const express = require('express');
const router = express.Router();
const portfolioController = require('../controller/portofolio');
const { validateSeller } = require('../middleware/common');
const { protect } = require('../middleware/auth');

const upload = require('../middleware/multer');

router.get('/', portfolioController.getAllPortfolio);
router.get('/worker/:id', portfolioController.getPortfolioUser);
router.get('/detail/:id', portfolioController.getDetailPortfolio);
router.post('/add/:id', upload, validateSeller, portfolioController.inputPortfolio);
router.delete('/delete/:id', protect, portfolioController.deletePortfolio);
router.put('/update/:id', upload, protect, validateSeller, portfolioController.updatePortfolio);

module.exports = router;
