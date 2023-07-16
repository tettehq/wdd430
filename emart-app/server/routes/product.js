var express = require('express');
var router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find().then(products => {
    res.status(200).json({
      message: 'Products have been retrieved.',
      products: products
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
  const maxProductId = sequenceGenerator.nextId("products");

  const product = new Product({
    id: maxProductId,
    name: req.body.name,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    inventory: req.body.inventory,
    category: req.body.category
  });

  product.save()
    .then(createdProduct => {
      res.status(201).json({
        message: 'Product added successfully',
        product: createdProduct
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
  Product.findOne({ id: req.params.id })
    .then(product => {
      product.name = req.body.name;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      product.price = req.body.price;
      product.inventory = req.body.inventory;
      product.category = req.body.category;

      Product.updateOne({ id: req.params.id }, product)
        .then(result => {
          res.status(204).json({
            message: 'Product updated successfully'
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
        message: 'Product not found.',
        error: { product: 'Product not found'}
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Product.findOne({ id: req.params.id })
    .then(product => {
      Product.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Product deleted successfully"
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
        message: 'Product not found.',
        error: { product: 'Product not found'}
      });
    });
});

module.exports = router;
