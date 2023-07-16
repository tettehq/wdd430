const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
   maxProductId: { type: String, required: true },
   maxOrderId: { type: String, required: true },
   maxCartId: { type: String, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
