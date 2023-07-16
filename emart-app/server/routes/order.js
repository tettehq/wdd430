var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Order = require('../models/order');

router.get('/', (req, res, next) => {
  Order.find().populate('items').then(orders => {
    res.status(200).json({
      message: 'Orders have been retrieved.',
      orders: orders
    })
  }).catch(err => {
      res.status(500).json({
        message: 'An error occurred',
        error: err
      })
    }
  )
});

router.post('/', (req, res, next) => {
  const maxOrderId = sequenceGenerator.nextId("orders");
  console.log(maxOrderId)

  const order = new Order({
    id: maxOrderId,
    name: req.body.name,
    email: req.body.email,
    time: req.body.time,
    total: req.body.total,
    items: req.body.items
  });

  order.save().then(createdOrder => {
      res.status(201).json({
        message: 'Order added successfully',
        order: createdOrder
      });
    })
    .catch(error => {
       res.status(500).json({
          message: 'An error occurred',
          error: error
        });
    });
});

router.put('/:id', (req, res, next) => {
  Order.findOne({ id: req.params.id })
    .then(order => {
      order.name = req.body.name;
      order.email = req.body.email;
      order.time = req.body.time;
      order.total = req.body.total;
      order.items = req.body.items;

      Order.updateOne({ id: req.params.id }, order)
        .then(result => {
          res.status(204).json({
            message: 'Order updated successfully'
          })
        })
        .catch(error => {
           res.status(500).json({
           message: 'An error occurred',
           error: error
         });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Order not found.',
        error: { order: 'Order not found'}
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Order.findOne({ id: req.params.id })
    .then(order => {
      Order.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Order deleted successfully"
          });
        })
        .catch(error => {
           res.status(500).json({
           message: 'An error occurred',
           error: error
         });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Order not found.',
        error: { order: 'Order not found'}
      });
    });
});

module.exports = router;
