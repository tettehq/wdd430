const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
   id: { type: String, required: true },
   name: { type: String, required: true },
   email: { type: String, required: true },
   time: { type: String, required: true },
   total: { type: String, required: true },
   items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true }],
});

module.exports = mongoose.model('Order', orderSchema);
