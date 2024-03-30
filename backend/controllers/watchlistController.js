const Watchlist = require('../models/watchlistModel')

const getWatchlist = async (req, res) => {
    const watchlist = await Watchlist.find({}).sort({createdAt: -1})
    if (watchlist.length == 0){
        return res.status(404).json({msg: "Currently you don't have any stock in your watchlist."})
    }
    res.status(200).json(watchlist)
}

const getStockFromWatchlist = async (req, res) => {
    const { ticker } = req.params
    const stock = await Watchlist.find({ticker: ticker})

    if (!stock[0]) {
        return res.status(404).json({msg: 'Stock does not exist in watchlist'})
    }
    res.status(200).json(stock[0])
}

const addStockToWatchlist = async (req, res) => {
    const {ticker, name, watchedprice} = req.body
    try{
        const watchlistItem = await Watchlist.create({ticker,name,watchedprice})
        res.status(200).json(watchlistItem)
    } catch (err){
        res.status(400).json({msg: err.message})
    }
}

const deleteStockFromWatchlist = async (req, res) => {
    const { ticker } = req.params
    const stock = await Watchlist.findOneAndDelete({ticker: ticker})
    if (!stock) {
        return res.status(404).json({msg: 'Stock does not exist in watchlist'})
    }
    res.status(200).json(stock)
}

const updateStockInWatchlist = async (req, res) => {
    const { ticker } = req.params
    const stock = await Watchlist.findOneAndUpdate({ticker: ticker}, {
        ...req.body
    })
    if (!stock) {
        return res.status(404).json({msg: 'Stock does not exist in watchlist'})
    }
    res.status(200).json(stock)
}

module.exports = {
    getWatchlist,
    getStockFromWatchlist,
    addStockToWatchlist,
    deleteStockFromWatchlist,
    updateStockInWatchlist
}