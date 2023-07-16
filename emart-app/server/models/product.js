const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   description: { type: String, required: true },
   imageUrl: { type: String},
   price: { type: String, required: true},
   inventory: { type: String },
   category: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
