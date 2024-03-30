const express = require('express')
const {
    getWatchlist,
    getStockFromWatchlist,
    addStockToWatchlist,
    deleteStockFromWatchlist,
    updateStockInWatchlist
} = require('../controllers/watchlistController')

const router = express.Router()

router.get('/', getWatchlist)

router.get('/:ticker', getStockFromWatchlist)

router.post('/', addStockToWatchlist)

router.delete('/:ticker', deleteStockFromWatchlist)

router.patch('/:ticker', updateStockInWatchlist)

module.exports = router