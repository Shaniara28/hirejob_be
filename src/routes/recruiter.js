const express = require('express');
const router = express.Router();
const recruiterController = require('../controller/recruiter');
const { validateSeller } = require('../middleware/common');
const { protect } = require('../middleware/auth');

router.get('/', recruiterController.getAllRecruiter);
router.get('/:id', recruiterController.getDetailRecruiter);
router.put('/:id', validateSeller, recruiterController.updateRecruiter);
router.delete('/:id', protect, recruiterController.deleteRecruiter);

// Authenticated

router.post('/register', validateSeller, recruiterController.registerRecruiter);
router.post('/login', recruiterController.loginRecruiter);
router.post('/refreshtoken', recruiterController.refreshToken);
router.get('/profile', protect, recruiterController.profileRecruiter);

module.exports = router;
