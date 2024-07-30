const express = require('express');
const { initializeDatabase, getTransactions, getStatistics, getBarChart, getPieChart, getAllCombined } = require('../controllers/transactionController');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/list', getTransactions);
router.get('/statistics', getStatistics);
router.get('/barchart', getBarChart);
router.get('/piechart', getPieChart);
router.get('/combined', getAllCombined);

module.exports = router;
