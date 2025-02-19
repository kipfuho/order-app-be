const express = require('express');
const restaurantManagementController = require('../controllers/restaurantManagement.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/:restaurantId', auth(), restaurantManagementController.getRestaurant);
router.post('/create', auth(), restaurantManagementController.createRestaurant);
router.patch('/:restaurantId', auth(), restaurantManagementController.updateRestaurant);
router.delete('/:restaurantId', auth(), restaurantManagementController.deleteRestaurant);

module.exports = router;
