const express = require('express');
const router = express.Router();
const workerController = require('../controller/worker');
const { validateSeller } = require('../middleware/common');
const { protect } = require('../middleware/auth');

router.get('/', workerController.getAllWorker);
router.get('/all/:id', workerController.getAllValueWorker);
router.get('/:id', workerController.getDetailWorker);
router.put('/:id', validateSeller, workerController.updateWorker);
router.delete('/:id', protect, workerController.deleteWorker);

// Authenticated

router.post('/register', validateSeller, workerController.registerWorker);
router.post('/login', workerController.loginWorker);
router.post('/refreshtoken', workerController.refreshToken);
router.get('/profile', protect, workerController.profileWorker);

module.exports = router;
