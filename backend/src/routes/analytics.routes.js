const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate, authorize } = require('../middleware/security.middleware');

router.get('/stats', authenticate, authorize('ADMIN'), analyticsController.getStats);
router.get('/logs', authenticate, authorize('ADMIN'), analyticsController.getLogs);

module.exports = { analyticsRoutes: router };
