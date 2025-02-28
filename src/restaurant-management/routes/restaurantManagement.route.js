const express = require('express');
const restaurantManagementController = require('../controllers/restaurantManagement.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/:restaurantId', auth(), restaurantManagementController.getRestaurant);
router.post('/create', auth(), restaurantManagementController.createRestaurant);
router.patch('/:restaurantId', auth(), restaurantManagementController.updateRestaurant);
router.delete('/:restaurantId', auth(), restaurantManagementController.deleteRestaurant);

router.get('/:tableId', auth(), restaurantManagementController.getTable);
router.post('/create', auth(), restaurantManagementController.createTable);
router.patch('/:tableId', auth(), restaurantManagementController.updateTable);
router.delete('/:tableId', auth(), restaurantManagementController.deleteTable);

router.get('/:tablePositionId', auth(), restaurantManagementController.getTablePosition);
router.post('/create', auth(), restaurantManagementController.createTablePosition);
router.patch('/:tablePositionId', auth(), restaurantManagementController.updateTablePosition);
router.delete('/:tablePositionId', auth(), restaurantManagementController.deleteTablePosition);

router.get('/:employeeId', auth(), restaurantManagementController.getEmployee);
router.post('/create', auth(), restaurantManagementController.createEmployee);
router.patch('/:employeeId', auth(), restaurantManagementController.updateEmployee);
router.delete('/:employeeId', auth(), restaurantManagementController.deleteEmployee);

router.get('/:employeePositionId', auth(), restaurantManagementController.getEmployeePosition);
router.post('/create', auth(), restaurantManagementController.createEmployeePosition);
router.patch('/:employeePositionId', auth(), restaurantManagementController.updateEmployeePosition);
router.delete('/:employeePositionId', auth(), restaurantManagementController.deleteEmployeePosition);

router.get('/:departmentId', auth(), restaurantManagementController.getDepartment);
router.post('/create', auth(), restaurantManagementController.createDepartment);
router.patch('/:departmentId', auth(), restaurantManagementController.updateDepartment);
router.delete('/:departmentId', auth(), restaurantManagementController.deleteDepartment);

module.exports = router;
