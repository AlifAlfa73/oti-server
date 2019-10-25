const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const reference_controller = require('../controllers/referenceController');

// a simple test url to check that all of our files are communicating correctly.
router.get('/test', reference_controller.test);
router.post('/create', reference_controller.reference_create);
router.get('/search', reference_controller.reference_detail);
router.get('/searchnodb', reference_controller.reference_detail_nodb);

module.exports = router;