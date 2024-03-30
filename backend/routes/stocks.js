const express = require('express')
const {
    getStocks,
    getStock,
    createStock,
    deleteStock,
    updateStock
} = require('../controllers/stockController')

const router = express.Router()

router.get('/', getStocks)

router.get('/:ticker', getStock)

router.post('/', createStock)

router.delete('/:ticker', deleteStock)

router.patch('/:ticker', updateStock)

module.exports = router