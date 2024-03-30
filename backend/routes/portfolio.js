const express = require('express')
const {
    getPortfolio,
    getStockFromPortfolio,
    addStockToPortfolio,
    deleteStockFromPortfolio,
    updateStockInPortfolio
} = require('../controllers/portfolioController')

const router = express.Router()

router.get('/', getPortfolio)

router.get('/:ticker', getStockFromPortfolio)

router.post('/', addStockToPortfolio)

router.delete('/:ticker', deleteStockFromPortfolio)

router.patch('/:ticker', updateStockInPortfolio)

module.exports = router