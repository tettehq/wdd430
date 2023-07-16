const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   description: { type: String, required: true },
   imageUrl: { type: String},
   price: { type: String, required: true },
   quantity: { type: String, required: true },
   category: { type: String, required: true }
});

module.exports = mongoose.model('Cart', cartSchema);
