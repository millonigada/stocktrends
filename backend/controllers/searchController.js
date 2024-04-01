const axios = require('axios').default;

const getAutocompleteData = async (req, res) => {
    const {query} = req.params

    axios.get('https://finnhub.io/api/v1/search?q='+query+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
}

const getCompanyData = async (req, res) => {
    const {ticker} = req.params

    axios.get('https://finnhub.io/api/v1/stock/profile2?symbol='+ticker+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        if(JSON.stringify(response.data) == '{}'){
            return res.status(404).json({msg: 'stock ticker doesnt exist.'})
        }
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get company data'})
}

const getChartsData = async (req, res) => {
    const {ticker} = req.params
    let dateTo = new Date()
    let dateFrom = new Date()
    // dateTo.setDate(dateTo.getDate() - 1)
    dateFrom.setFullYear(dateFrom.getFullYear() - 2)

    dateFrom = dateFrom.toISOString().split('T')[0]
    dateTo = dateTo.toISOString().split('T')[0]
    
    axios.get('https://api.polygon.io/v2/aggs/ticker/'+ticker+'/range/1/day/'+dateFrom+'/'+dateTo+'?adjusted=true&sort=asc&apiKey='+process.env.POLYGONIO_API_KEY)
    .then(function (response) {
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get charts data'})
}

const getPriceVariationChartsData = async (req, res) => {
    const {ticker} = req.params
    let dateTo = new Date()
    let dateFrom = new Date()
    // dateTo.setDate(dateTo.getDate() - 1)
    dateFrom.setDate(dateFrom.getDate() - 1)

    dateFrom = dateFrom.toISOString().split('T')[0]
    dateTo = dateTo.toISOString().split('T')[0]

    console.log(dateFrom,"***",dateTo)
    
    axios.get('https://api.polygon.io/v2/aggs/ticker/'+ticker+'/range/1/hour/'+dateFrom+'/'+dateTo+'?adjusted=true&sort=asc&apiKey='+process.env.POLYGONIO_API_KEY)
    .then(function (response) {
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get charts data'})
}

const getQuoteData = async (req, res) => {
    const {ticker} = req.params

    axios.get('https://finnhub.io/api/v1/quote?symbol='+ticker+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        // console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get quote data'})
}

const getNewsData = async (req, res) => {
    const {ticker} = req.params
    let dateTo = new Date()
    let dateFrom = new Date()
    // dateTo.setDate(dateTo.getDate() - 1)
    dateFrom.setFullYear(dateFrom.getFullYear() - 2)

    dateFrom = dateFrom.toISOString().split('T')[0]
    dateTo = dateTo.toISOString().split('T')[0]

    axios.get('https://finnhub.io/api/v1/company-news?symbol='+ticker+'&from='+dateFrom+'&to='+dateTo+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        // console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get news data'})
}

const getRecsData = async (req, res) => {
    const {ticker} = req.params

    axios.get('https://finnhub.io/api/v1/stock/recommendation?symbol='+ticker+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        // console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get recs data'})
}

const getInsiderData = async (req, res) => {
    const {ticker} = req.params

    axios.get('https://finnhub.io/api/v1/stock/insider-sentiment?symbol='+ticker+'&from=2022-01-01&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        // console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get insider data'})
}

const getPeersData = async (req, res) => {
    const {ticker} = req.params

    axios.get('https://finnhub.io/api/v1/stock/peers?symbol='+ticker+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        // console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get peers data'})
}

const getEarningsData = async (req, res) => {
    const {ticker} = req.params

    axios.get('https://finnhub.io/api/v1/stock/earnings?symbol='+ticker+'&token='+process.env.FINNHUB_API_KEY)
    .then(function (response) {
        // console.log(response)
        res.status(200).json(response.data)
    })
    .catch(function (error) {
        res.status(400).json({error: error.message})
    });
    // res.json({msg: 'Get earnings data'})
}

module.exports = {
    getCompanyData,
    getChartsData,
    getQuoteData,
    getNewsData,
    getRecsData,
    getInsiderData,
    getPeersData,
    getEarningsData,
    getPriceVariationChartsData,
    getAutocompleteData
}