const Wallet = require('../models/walletModel')

const getWallet = async (req, res) => {
    const wallet = await Wallet.find({walletid: process.env.WALLET_ID})

    if (!wallet[0]) {
        return res.status(404).json({error: 'Wallet does not exist'})
    }
    res.status(200).json(wallet[0].amount)
}

const updateWallet = async (req, res) => {
    
    const wallet = await Wallet.findOneAndUpdate({walletid: process.env.WALLET_ID}, {
        ...req.body
    })
    if (!wallet) {
        return res.status(404).json({error: 'Wallet does not exist'})
    }
    res.status(200).json(wallet)
}

module.exports = {
    getWallet,
    updateWallet,
}