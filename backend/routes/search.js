const express = require('express')

const {
    getCompanyData,
    getChartsData,
    getQuoteData,
    getNewsData,
    getRecsData,
    getInsiderData,
    getPeersData,
    getEarningsData,
    getPriceVariationChartsData
} = require('../controllers/searchController')

const router = express.Router()

router.get('/', (req, res) => {
    res.json({msg: 'Default search route'})
})

router.get('/company/:ticker', getCompanyData)

router.get('/charts/:ticker', getChartsData)

router.get('/quote/:ticker', getQuoteData)

router.get('/news/:ticker', getNewsData)

router.get('/recs/:ticker', getRecsData)

router.get('/insider/:ticker', getInsiderData)

router.get('/peers/:ticker', getPeersData)

router.get('/earnings/:ticker', getEarningsData)

router.get('/pricevariation/:ticker', getPriceVariationChartsData)

module.exports = router