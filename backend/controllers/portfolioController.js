const Portfolio = require('../models/portfolioModel')

const getPortfolio = async (req, res) => {
    const portfolio = await Portfolio.find({}).sort({createdAt: -1})
    if (portfolio.length == 0){
        return res.status(404).json({msg: "Currently you don't have any stock."})
    }
    res.status(200).json(portfolio)
}

const getStockFromPortfolio = async (req, res) => {
    const { ticker } = req.params
    const stock = await Portfolio.find({ticker: ticker})

    if (!stock[0]) {
        return res.status(404).json({msg: 'Stock does not exist in portfolio'})
    }
    res.status(200).json(stock[0])
}

const addStockToPortfolio = async (req, res) => {
    const {ticker, name, costprice, quantity} = req.body

    try{
        const portfolioItem = await Portfolio.create({ticker,name,costprice,quantity})
        res.status(200).json(portfolioItem)
    } catch (err){
        res.status(400).json({msg: err.message})
    }
}

const deleteStockFromPortfolio = async (req, res) => {
    const { ticker } = req.params
    const stock = await Portfolio.findOneAndDelete({ticker: ticker})
    if (!stock) {
        return res.status(404).json({msg: 'Stock does not exist in portfolio'})
    }
    res.status(200).json(stock)
}

const updateStockInPortfolio = async (req, res) => {
    const { ticker } = req.params
    const stock = await Portfolio.findOneAndUpdate({ticker: ticker}, {
        ...req.body
    })
    if (!stock) {
        return res.status(404).json({msg: 'Stock does not exist in portfolio'})
    }
    res.status(200).json(stock)
}

module.exports = {
    getPortfolio,
    getStockFromPortfolio,
    addStockToPortfolio,
    deleteStockFromPortfolio,
    updateStockInPortfolio
}