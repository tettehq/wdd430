var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Cart = require('../models/cart');

router.get('/', (req, res, next) => {
  Cart.find().then(cartList => {
    res.status(200).json({
      message: 'Carts have been retrieved.',
      cartList: cartList
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
  const maxCartId = sequenceGenerator.nextId("cart");

  const product = new Cart({
    id: maxCartId,
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    quantity: req.body.quantity,
    category: req.body.category
  });

  product.save()
    .then(createdCart => {
      res.status(201).json({
        message: 'Cart added successfully',
        product: createdCart
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
  Cart.findOne({ id: req.params.id })
    .then(product => {
      product.name = req.body.name;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      product.price = req.body.price;
      product.quantity = req.body.quantity;
      product.category = req.body.category;

      Cart.updateOne({ id: req.params.id }, product)
        .then(result => {
          res.status(204).json({
            message: 'Cart updated successfully'
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
        message: 'Cart not found.',
        error: { product: 'Cart not found'}
      });
    });
});

router.delete("/:id", (req, res, next) => {
  if(req.params.id == "null") {
    console.log('here')
    Cart.deleteMany({ })
    .then(result => {
      res.status(204).json({
        message: "Cart deleted successfully"
      });
    })
    .catch(error => {
      res.status(500).json({
      message: 'An error occurred',
      error: error
    });
   })
  }
  else {
    Cart.findOne({ id: req.params.id })
    .then(product => {
      Cart.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Cart deleted successfully"
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
        message: 'Cart not found.',
        error: { product: 'Cart not found'}
      });
    });
  }
});

module.exports = router;
