const express = require('express');
const router = express.Router();
const skillsController = require('../controller/skill');
const { validateSeller } = require('../middleware/common');
const { protect } = require('../middleware/auth');

router.get('/', skillsController.getAllSkills);
router.get('/worker/:id', skillsController.getSkillUser);
router.get('/detail/:id', skillsController.getDetailSkills);
router.post('/add/:id', validateSeller, skillsController.inputSkills);
router.delete('/delete/:id', protect, skillsController.deleteSkills);
router.put('/update/:id', protect, validateSeller, skillsController.updateSkills);

module.exports = router;
