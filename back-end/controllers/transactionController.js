const axios = require('axios');
const Transaction = require('../models/Transaction');

// Initialize database
const initializeDatabase = async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Transaction.deleteMany();
        await Transaction.insertMany(data);
        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to get the start and end of a month
const getMonthRange = (month) => {
    const [year, monthNumber] = month.split('-').map(Number);
    const startOfMonth = new Date(year, monthNumber - 1, 1);
    const endOfMonth = new Date(year, monthNumber, 1);
    return { startOfMonth, endOfMonth };
};

// Validate month
const validateMonth = (month) => {
    console.log('Validating month:', month);
    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (typeof month !== 'string') {
        console.error('Month is not a string:', month);
        return false;
    }

    const isValid = regex.test(month);
    console.log('Is month valid?', isValid);
    return isValid;
};

// Get transactions with search and pagination
const getTransactions = async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    if (!validateMonth(month)) {
        return res.status(400).json({ error: 'Invalid month provided' });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month);

    const query = {
        $or: [
            { title: new RegExp(search, 'i') },
            { description: new RegExp(search, 'i') },
            { price: new RegExp(search, 'i') },
        ],
        dateOfSale: { $gte: startOfMonth, $lt: endOfMonth }
    };
    try {
        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get statistics for a given month
const getStatistics = async (req, res) => {
    const { month } = req.query;
    if (!validateMonth(month)) {
        return res.status(400).json({ error: 'Invalid month provided' });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });
        const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const totalSoldItems = transactions.filter(t => t.sold).length;
        const totalNotSoldItems = transactions.length - totalSoldItems;

        res.status(200).json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get bar chart data
const getBarChart = async (req, res) => {
    const { month } = req.query;
    if (!validateMonth(month)) {
        return res.status(400).json({ error: 'Invalid month provided' });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });
        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0,
        };

        transactions.forEach(transaction => {
            const { price } = transaction;
            if (price <= 100) priceRanges['0-100']++;
            else if (price <= 200) priceRanges['101-200']++;
            else if (price <= 300) priceRanges['201-300']++;
            else if (price <= 400) priceRanges['301-400']++;
            else if (price <= 500) priceRanges['401-500']++;
            else if (price <= 600) priceRanges['501-600']++;
            else if (price <= 700) priceRanges['601-700']++;
            else if (price <= 800) priceRanges['701-800']++;
            else if (price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        res.status(200).json(priceRanges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get pie chart data
const getPieChart = async (req, res) => {
    const { month } = req.query;
    if (!validateMonth(month)) {
        return res.status(400).json({ error: 'Invalid month provided' });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month);

    try {
        const transactions = await Transaction.find({ dateOfSale: { $gte: startOfMonth, $lt: endOfMonth } });
        const categoryCounts = {};

        transactions.forEach(transaction => {
            const { category } = transaction;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        res.status(200).json(categoryCounts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get combined data from all APIs
const getAllCombined = async (req, res) => {
    console.log('Request query parameters:', req.query); // Log all query parameters

    const { month } = req.query;
    if (!validateMonth(month)) {
        return res.status(400).json({ error: 'Invalid month provided' });
    }

    const { startOfMonth, endOfMonth } = getMonthRange(month);

    try {
        const transactions = await Transaction.find({
            dateOfSale: { $gte: startOfMonth, $lt: endOfMonth }
        }).exec();

        // Compute statistics
        const totalSaleAmount = transactions.reduce((sum, transaction) => sum + transaction.price, 0);
        const totalSoldItems = transactions.filter(t => t.sold).length;
        const totalNotSoldItems = transactions.length - totalSoldItems;

        // Compute bar chart data
        const priceRanges = {
            '0-100': 0,
            '101-200': 0,
            '201-300': 0,
            '301-400': 0,
            '401-500': 0,
            '501-600': 0,
            '601-700': 0,
            '701-800': 0,
            '801-900': 0,
            '901-above': 0,
        };

        transactions.forEach(transaction => {
            const { price } = transaction;
            if (price <= 100) priceRanges['0-100']++;
            else if (price <= 200) priceRanges['101-200']++;
            else if (price <= 300) priceRanges['201-300']++;
            else if (price <= 400) priceRanges['301-400']++;
            else if (price <= 500) priceRanges['401-500']++;
            else if (price <= 600) priceRanges['501-600']++;
            else if (price <= 700) priceRanges['601-700']++;
            else if (price <= 800) priceRanges['701-800']++;
            else if (price <= 900) priceRanges['801-900']++;
            else priceRanges['901-above']++;
        });

        // Compute pie chart data
        const categoryCounts = {};
        transactions.forEach(transaction => {
            const { category } = transaction;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });

        // Send response
        res.status(200).json({
            transactions,
            statistics: { totalSaleAmount, totalSoldItems, totalNotSoldItems },
            barChart: priceRanges,
            pieChart: categoryCounts
        });
    } catch (err) {
        console.error('Error in getAllCombined:', err); // Added for debugging
        res.status(500).json({ error: err.message });
    }
};


module.exports = {
    initializeDatabase,
    getTransactions,
    getStatistics,
    getBarChart,
    getPieChart,
    getAllCombined
};
