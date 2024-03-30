const mongoose = require('mongoose')

const Schema = mongoose.Schema

const portfolioSchema = new Schema({
    ticker:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    costprice:{
        type: Number,
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Portfolio', portfolioSchema)