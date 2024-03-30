const Stock = require('../models/stockModel')

const getStocks = async (req, res) => {
    const stocks = await Stock.find({}).sort({createdAt: -1})
    res.status(200).json(stocks)
}

const getStock = async (req, res) => {
    const { ticker } = req.params
    const stock = await Stock.find({ticker: ticker})
    if (!stock) {
        return res.status(404).json({error: 'Stock does not exist'})
    }
    res.status(200).json(stock)
}

const createStock = async (req, res) => {
    const {ticker, name} = req.body

    try{
        const stock = await Stock.create({ticker,name})
        res.status(200).json(stock)
    } catch (err){
        res.status(400).json({error: err.message})
    }
}

const deleteStock = async (req, res) => {
    const { ticker } = req.params
    const stock = await Stock.findOneAndDelete({ticker: ticker})
    if (!stock) {
        return res.status(404).json({error: 'Stock does not exist'})
    }
    res.status(200).json(stock)
}

const updateStock = async (req, res) => {
    const { ticker } = req.params
    const stock = await Stock.findOneAndUpdate({ticker: ticker}, {
        ...req.body
    })
    if (!stock) {
        return res.status(404).json({error: 'Stock does not exist'})
    }
    res.status(200).json(stock)
}

module.exports = {
    getStocks,
    getStock,
    createStock,
    deleteStock,
    updateStock
}