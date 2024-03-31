require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors");
const path = require('path')

const homeRoutes = require('./routes/home')
const searchRoutes = require('./routes/search')
const stockRoutes = require('./routes/stocks')
const watchlistRoutes = require('./routes/watchlist')
const portfolioRoutes = require('./routes/portfolio')
const walletRoutes = require('./routes/wallet')

const app = express()

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../frontend/build/");

app.use(express.json())

app.use(express.static(buildPath))

app.use(cors())

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.get('/*', (req, res) => {

    res.sendFile(
        path.join(__dirname, "../frontend/build/index.html"),
        function (err) {
            if (err) {
                res.status(500).send(err)
            }
        }
    )
})

app.use('/home', homeRoutes)
app.use('/search', searchRoutes)
app.use('/stocks', stockRoutes)
app.use('/watchlist', watchlistRoutes)
app.use('/portfolio', portfolioRoutes)
app.use('/wallet', walletRoutes)


mongoose.connect(process.env.DB_URI)
    .then(() => {
        console.log("Connected to DB")

        app.listen(process.env.PORT, () => {
            console.log("Server listning to port 4000")
        })

    })
    .catch((err) => {
        console.log(err)
    })