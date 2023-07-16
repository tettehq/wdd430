var Sequence = require('../models/sequence');

var maxProductId;
var maxOrderId;
var maxCartId;
var sequenceId = null;

function SequenceGenerator() {
  Sequence.findOne()
    .exec()
    .then((sequence) => {
      sequenceId = sequence._id;
      maxProductId = sequence.maxProductId;
      maxOrderId = sequence.maxOrderId;
      maxCartId = sequence.maxCartId;
    })
    .catch((err) => {
      return res.status(500).json({
        title: "An error occurred",
        error: err,
      });
    });
}
SequenceGenerator.prototype.nextId =  function (collectionType) {
  var updateObject = {};
  var nextId;
  switch (collectionType) {
    case "products":
      maxProductId++;
      updateObject = { maxProductId: maxProductId };
      nextId = maxProductId;
      break;
    case "orders":
      maxOrderId++;
      updateObject = { maxOrderId: maxOrderId };
      nextId = maxOrderId;
      break;
    case "cart":
      maxCartId++;
      updateObject = { maxCartId: maxCartId };
      nextId = maxCartId;
      break;
    default:
      return -1;
  }
  Sequence.updateOne({ _id: sequenceId }, { $set: updateObject })
  .then(result => console.log(result))
  .catch((err) => {
        console.log("nextId error = ", err);
        return null;
  });
  return nextId;
};
module.exports = new SequenceGenerator();
