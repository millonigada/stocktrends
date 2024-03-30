const express = require('express')
const {
    getWallet,
    updateWallet,
} = require('../controllers/walletController')

const router = express.Router()

router.get('/', getWallet)

router.patch('/', updateWallet)

module.exports = router