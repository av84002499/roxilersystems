const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    id: String,
    title: String,
    price: String,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date,
});

module.exports = mongoose.model('Transaction', TransactionSchema);
