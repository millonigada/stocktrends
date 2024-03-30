const express = require('express')
const axios = require('axios').default;

const router = express.Router()

router.get('/', (req, res) => {
    res.json({msg: 'Home route'})
})

router.get('/autocomplete/:query', (req, res) => {
    const {query} = req.params

    axios.get('https://finnhub.io/api/v1/search?q='+query+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
})

module.exports = router