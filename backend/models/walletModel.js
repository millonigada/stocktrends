const mongoose = require('mongoose')

const Schema = mongoose.Schema

const walletSchema = new Schema({
    amount:{
        type: Number
    }
}, {timestamps: true})

module.exports = mongoose.model('Wallet', walletSchema)