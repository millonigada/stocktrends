import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import Container from "react-bootstrap/esm/Container";
import Home from "../pages/Home";
import { Link, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/esm/Spinner";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/Button";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import Image from "react-bootstrap/Image";
import { Box, Tab, Tabs } from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import BuyModal from "./BuyModal";
import SellModal from "./SellModal";
import Table from 'react-bootstrap/Table';
import axios from "axios";
import NewsItem from "./NewsItem";
import MessageBox from "./MessageBox";

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts2 from 'highcharts/highstock';

import HC_more from 'highcharts/highcharts-more';
import HC_indicatorsAll from 'highcharts/indicators/indicators-all';
import HC_vbp from 'highcharts/indicators/volume-by-price';
import NewsModal from "./NewsModal";

HC_more(Highcharts2);
HC_indicatorsAll(Highcharts2);
HC_vbp(Highcharts2);

<head>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
<script src="https://code.highcharts.com/modules/stock.js"></script>
<script src="https://code.highcharts.com/highstock.js"></script>
</head>

const SearchResults = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [tickerExists, setTickerExists] = useState(false)
    const [tab, setTab] = useState('summary')
    const [changePos, setChangePos] = useState(null)

    const [inWatchlist, setInWatchlist] = useState(false)
    const [inPortfolio, setInPortfolio] = useState(false)

    const [addedToWatchlist, setAddedToWatchlist] = useState(false)
    const [stockBought, setStockBought] = useState(false)
    const [removedFromWatchlist, setRemovedFromWatchlist] = useState(false)
    const [stockSold, setStockSold] = useState(false)

    const [portfolioData, setPortfolioData] = useState(null)
    const [optionsForChartsTab, setOptionsForChartsTab] = useState(null)

    const [wallet, setWallet] = useState(null)
    const [timestamp, setTimestamp] = useState('')

    const [openSellModal, setOpenSellModal] = useState(false)
    const [openBuyModal, setOpenBuyModal] = useState(false)
    const [openNewsModal, setOpenNewsModal] = useState(false)
    const [newsModalItem, setNewsModalItem] = useState(null)

    const { tickerParam } = useParams() 

    const {search, watchlist, portfolio, dispatch} = useAppContext()

    const handleTab = (e, newTab) => {
        setTab(newTab);
    }; 

    const isMarketOpen = (unixTimestamp) => {
        const currentTimestamp = Math.floor(Date.now() / 1000); 
        const differenceInSeconds = currentTimestamp - unixTimestamp;
        const differenceInMinutes = differenceInSeconds / 60;
        return differenceInMinutes <= 5;
    }

    const convertEpochToDate = (epochTime) => {
        var timestamp = epochTime;
        var date = new Date(timestamp * 1000);

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        return(year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds);
    }

    const handleSell = async (sellQuantity, sellPrice) => {

        const newWallet = wallet + (sellQuantity*sellPrice)
        const newQuantity = portfolioData.quantity - sellQuantity

        const response = await axios.patch('http://localhost:4000/wallet', {
            amount: newWallet
        })
        const json = await response.data
        if(response.status == 200){
            console.log("Wallet updated")
            dispatch({type: 'SET_WALLET', payload: newWallet})
        }

        if(newQuantity!=0){
            const response = await axios.patch('http://localhost:4000/portfolio/'+tickerParam, {
                quantity: newQuantity
            })
            const json = await response.data
            if(response.status == 200){
                console.log("Stock updated")
                let updatedStock = portfolioData
                updatedStock.quantity = newQuantity
                if(portfolio){
                    dispatch({type: 'UPDATE_PORTFOLIO', payload: updatedStock})
                } else {
                    setPortfolioContext()
                }

                setStockSold(true)
                setStockBought(false)
                const interval = setInterval(()=>{setStockSold(false)}, 4000)
                return () => clearInterval(interval)
                
            }
        } else {
            const response = await axios.delete('http://localhost:4000/portfolio/'+tickerParam)
            if(response.status == 200){
                console.log("Stock deleted")
                if(portfolio){
                    dispatch({type: 'DELETE_PORTFOLIO', payload: portfolioData})
                } else {
                    setPortfolioContext()
                }
                
                setPortfolioData(null)

                setStockSold(true)
                setStockBought(false)
                const interval = setInterval(()=>{setStockSold(false)}, 4000)
                return () => clearInterval(interval)
            }
        }
    }

    const handleBuy = async (buyQuantity, buyPrice) => {
        const newWallet = wallet - (buyQuantity*buyPrice)
        const newQuantity = Number(portfolioData ? portfolioData.quantity : 0) + Number(buyQuantity)
        console.log('new quantity ',newQuantity)
        const newCostprice = portfolioData ? (Number(portfolioData.costprice)+Number(buyPrice))/2 : Number(buyPrice)

        const response = await axios.patch('http://localhost:4000/wallet', {
            amount: newWallet
        })
        const json = await response.data
        if(response.status == 200){
            console.log("Wallet updated from search")
            dispatch({type: 'SET_WALLET', payload: newWallet})
        }

        if(inPortfolio){
            const response = await axios.patch('http://localhost:4000/portfolio/'+tickerParam, {
                quantity: newQuantity,
                costprice: newCostprice
            })
            const json = await response.data
            if(response.status == 200){
                console.log("Stock updated")
                let updatedStock = portfolioData
                updatedStock.quantity = newQuantity
                updatedStock.costprice = newCostprice

                if (portfolio) {
                    dispatch({type: 'UPDATE_PORTFOLIO', payload: updatedStock})
                } else {
                    setPortfolioContext()
                }

                setStockBought(true)
                setStockSold(false)
                const interval = setInterval(()=>{setStockBought(false)}, 4000)
                return () => clearInterval(interval)

            }
        } else {
            const newStock = {
                ticker: tickerParam,
                name: search.company.name,
                quantity: newQuantity,
                costprice: newCostprice
            }
            const response = await axios.post('http://localhost:4000/portfolio/', newStock)
            const json = await response.data
            if(response.status == 200){
                setPortfolioData(newStock)
                console.log("Stock added")
                let updatedStock = portfolioData ? portfolioData : newStock
                updatedStock.quantity = newQuantity
                updatedStock.costprice = newCostprice
                if (portfolio) {
                    dispatch({type: 'ADD_PORTFOLIO', payload: updatedStock})
                } else {
                    setPortfolioContext()
                }

                setStockBought(true)
                setStockSold(false)
                const interval = setInterval(()=>{setStockBought(false)}, 4000)
                return () => clearInterval(interval)
            }
        }
    }

    const setPortfolioContext = async () => {
        const response = await fetch('http://localhost:4000/portfolio')
        const json = await response.json()

        if(response.status == 200){
            dispatch({type: 'SET_PORTFOLIO', payload: json})
        }
    }

    const setWatchlistContext = async () => {
        const response = await fetch('http://localhost:4000/watchlist')
        const json = await response.json()

        if(response.status == 200){
            dispatch({type: 'SET_WATCHLIST', payload: json})
        }
    }

    const fetchWallet = async () => {
        const response = await fetch('http://localhost:4000/wallet')
        const amount = await response.json()

        if(response.ok){
            dispatch({type: 'SET_WALLET', payload: amount})
            setWallet(amount)
        }
    }
    
    const getStockData = async () => {
        setIsLoading(true)
        setTickerExists(false)
        setInWatchlist(false)
        setInPortfolio(false)

        const companyResponse = await fetch('http://localhost:4000/search/company/'+tickerParam)
        const companyData = await companyResponse.json()

        if(companyResponse.status == 404){
            setIsLoading(false)
            dispatch({type: 'SET_SEARCH', payload: null})
            return
        }

        const chartsResponse = await fetch('http://localhost:4000/search/charts/'+tickerParam)
        const quoteResponse = await fetch('http://localhost:4000/search/quote/'+tickerParam)
        const newsResponse = await fetch('http://localhost:4000/search/news/'+tickerParam)
        const recsResponse = await fetch('http://localhost:4000/search/recs/'+tickerParam)
        const insiderResponse = await fetch('http://localhost:4000/search/insider/'+tickerParam)
        const peersResponse = await fetch('http://localhost:4000/search/peers/'+tickerParam)
        const earningsResponse = await fetch('http://localhost:4000/search/earnings/'+tickerParam)
        const priceVariationResponse = await fetch('http://localhost:4000/search/pricevariation/'+tickerParam)

        const chartsData = await chartsResponse.json()
        const quoteData = await quoteResponse.json()
        const newsData = await newsResponse.json()
        const recsData = await recsResponse.json()
        const insiderData = await insiderResponse.json()
        const peersData = await peersResponse.json()
        const earningsData = await earningsResponse.json()
        const priceVariationData = await priceVariationResponse.json()

        if(companyResponse.ok && chartsResponse.ok && quoteResponse.ok){
            setTickerExists(true)

            insiderData['totalMSPR'] = 0
            insiderData['posMSPR'] = 0
            insiderData['negMSPR'] = 0
            insiderData['totalChange'] = 0
            insiderData['posChange'] = 0
            insiderData['negChange'] = 0

            try {
                insiderData.data.map((item) => {
                    insiderData['totalMSPR'] += item.mspr
                    
                    if(item.mspr > 0) {
                        insiderData['posMSPR'] += item.mspr
                    } else {
                        insiderData['negMSPR'] += item.mspr
                    }
    
                    insiderData['totalChange'] += item.change
                    
                    if(item.mspr > 0) {
                        insiderData['posChange'] += item.change
                    } else {
                        insiderData['negChange'] += item.change
                    }
                    
                })
            } catch(err) {
                console.log(err)
            }

            chartsData.results['ohlc'] = []
            chartsData.results['volume'] = []

            try {

                chartsData.results['ohlc'] = chartsData.results.map(item => [item.t, item.o, item.h, item.l, item.c])
                chartsData.results['volume'] = chartsData.results.map(item => [item.t, item.v])

            } catch(err) {
                console.log(err)
            }

            recsData['strongBuy'] = []
            recsData['buy'] = []
            recsData['hold'] = []
            recsData['sell'] = []
            recsData['strongSell'] = []
            recsData['insightPeriod'] = []

            try {
                recsData['strongBuy'] = recsData.map(item => item.strongBuy)
                recsData['buy'] = recsData.map(item => item.buy)
                recsData['hold'] = recsData.map(item => item.hold)
                recsData['sell'] = recsData.map(item => item.sell)
                recsData['strongSell'] = recsData.map(item => item.strongSell)
                recsData['insightPeriod'] = recsData.map(item => item.period.slice(0,7))
            } catch(err) {
                console.log(err)
            }

            earningsData['actual'] = []
            earningsData['estimate'] = []
            earningsData['suprise'] = []
            earningsData['period'] = []
            earningsData['combined'] = []

            try {
                earningsData['actual'] = earningsData.map(item => item.actual)
                earningsData['estimate'] = earningsData.map(item => item.estimate)
                earningsData['surprise'] = earningsData.map(item => item.surprise)
                earningsData['period'] = earningsData.map(item => item.period)
                
                earningsData['combined'] = earningsData.map(function(item, index){
                    return item.period + '<br> Surprise: ' + item.surprise
                })

            } catch(err) {
                console.log(err)
            }

            priceVariationData.results['hours'] = []
            priceVariationData.results['hourlyPrice'] = []

            try {
                priceVariationData.results['hours'] = priceVariationData.results.map(item => new Date(item.t).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'America/Los_Angeles'
                }))
    
                priceVariationData.results['hourlyPrice'] = priceVariationData.results.map(item => item.c)
            } catch(err) {
                console.log(err)
            }

            const searchData = {
                "ticker": tickerParam,
                "company": companyData,
                "charts": chartsData.results,
                "quote": quoteData,
                "news": newsData,
                "recs": recsData,
                "insider": insiderData,
                "peers": peersData,
                "earnings": earningsData,
                "priceVariation": priceVariationData.results
            }

            console.log(searchData)

            dispatch({type: 'SET_SEARCH', payload: searchData})

            checkIfStockInWatchlist()

            checkIfStockInPortfolio()

        }
        setIsLoading(false)
    }

    const checkIfStockInWatchlist = async () => {
        const response = await fetch('http://localhost:4000/watchlist/'+tickerParam)
            const json = await response.json()

            if(response.status == 200){
                // dispatch({type: 'SET_WATCHLIST', payload: json})
                
                // const watchlist = json
                // watchlist.map((stock) => {
                //     if(stock.ticker == tickerParam){
                        
                //         setInWatchlist(true)
                //         return
                //     }
                // })
                setInWatchlist(true)

            } else if(response.status == 404){
                setInWatchlist(false)
            }
    }

    const checkIfStockInPortfolio = async () => {
        const response = await fetch('http://localhost:4000/portfolio/'+tickerParam)
            const json = await response.json()

            if(response.status == 200){
                // dispatch({type: 'SET_PORTFOLIO', payload: json})
                
                // const portfolio = json
                // portfolio.map((stock) => {
                //     if(stock.ticker == tickerParam){
                        
                //         setInPortfolio(true)
                //         return
                //     }
                // })

                setInPortfolio(true)
                setPortfolioData(json)

            } else if(response.status == 404){
                setInPortfolio(false)
                setPortfolioData(null)
            }
    }

    const addStockToWatchlist = async () => {

        const requestBody = {
            ticker: search.ticker.toUpperCase(),
            name: search.company.name,
            watchedprice: search.quote.c
        }

        const response = await axios.post("http://localhost:4000/watchlist/", requestBody);
        const json = await response.data;

        if (response.status == 200) {
            setInWatchlist(true)
            setRemovedFromWatchlist(false)
            setAddedToWatchlist(true)

            const interval = setInterval(()=>{setAddedToWatchlist(false)}, 4000)
        
            if (watchlist) {
                dispatch({type: 'ADD_WATCHLIST', payload: json})
            } else {
                setWatchlistContext()
            }

            return () => clearInterval(interval)
        }
    };

    const deleteStockFromWatchlist = async () => {
        const response = await fetch('http://localhost:4000/watchlist/'+tickerParam, {
            method: 'DELETE'
        })
        const json = await response.json()
    
        if(response.ok){
            setInWatchlist(false)
            setAddedToWatchlist(false)
            setRemovedFromWatchlist(true)

            const interval = setInterval(()=>{setRemovedFromWatchlist(false)}, 4000)

            if (watchlist) {
                dispatch({type: 'DELETE_WATCHLIST', payload: json})
            } else {
                setWatchlistContext()
            }

            return () => clearInterval(interval)
        }
    }

    useEffect(() => {
        console.log('use effect called')
        checkIfStockInWatchlist()
        checkIfStockInPortfolio()
        fetchWallet()

        console.log("Portfolio data: ",portfolioData)
        if(!search || tickerParam != search.ticker){
            getStockData()

            if(tickerExists){
                const fetchStockQuote = async () => {
                    const response = await fetch('http://localhost:4000/search/quote/'+tickerParam)
                    const json = await response.json()
        
                    if(response.ok){
                        
                        if(json.d >= 0){
                            setChangePos(true)
                        } else {
                            setChangePos(false)
                        }
    
                        const currentTimestamp = new Date();
                        const formattedTimestamp = currentTimestamp.toISOString().replace("T", " ").substring(0, 19);
                        setTimestamp(formattedTimestamp);
                    }
                }
    
                console.log("SEARCH",search)
    
                fetchStockQuote()
        
                const interval = setInterval(fetchStockQuote, 15000)
                
                return () => clearInterval(interval)
            }

        } else {
            setIsLoading(false)
            setTickerExists(true)
        }
    }, [tickerParam, portfolio]);

    return (
        <Container className="mx-auto">
            <Home/>
            {
                isLoading ? 
                (
                    <Container>
                        <Spinner />
                    </Container>
                ) : tickerExists ? (
                    <Container className="my-4 text-center">
                        { addedToWatchlist ? 
                            <MessageBox 
                                isPositive={true}
                                isDismissible={true}
                                setShow={setAddedToWatchlist}
                                message={tickerParam+" added to Watchlist."}
                            /> :
                            null
                    }
                    { removedFromWatchlist ? 
                            <MessageBox 
                                isPositive={false}
                                isDismissible={true}
                                setShow={setRemovedFromWatchlist}
                                message={tickerParam+" removed from Watchlist."}
                            /> :
                            null
                    }
                    { stockBought ? 
                            <MessageBox 
                                isPositive={true}
                                isDismissible={true}
                                setShow={setStockBought}
                                message={tickerParam+" bought successfully."}
                            /> :
                            null
                    }
                    { stockSold ? 
                            <MessageBox 
                                isPositive={false}
                                isDismissible={true}
                                setShow={setStockSold}
                                message={tickerParam+" sold successfully."}
                            /> :
                            null
                    }
                        <Row className="align-items-center">
                            <Col xs={4}>
                                <h2>
                                    {search.ticker+" "}
                                    {inWatchlist ? 
                                        <FaStar onClick={deleteStockFromWatchlist}/>
                                            :
                                        <CiStar onClick={addStockToWatchlist}/>
                                    }
                                </h2>
                                <h5>{search.company.name}</h5>
                                <p>{search.company.exchange}</p>
                                <Container>
                                    <Button className="mx-1" variant="success" onClick={() => {
                                            console.log(wallet)
                                            setOpenBuyModal(true)
                                        }} >
                                        Buy
                                    </Button>
                                    {   inPortfolio ?
                                        <Button className="mx-1" variant="danger" onClick={() => {setOpenSellModal(true)}} >
                                            Sell
                                        </Button> : null
                                    }
                                </Container>
                            </Col>
                            <Col xs={4}>
                                <Container className="d-block mx-auto">
                                    <Image src={search.company.logo} style={{ width: "7rem", height: "auto" }} alt="Logo" fluid />
                                </Container>
                            </Col>
                            <Col xs={4} className={changePos ? 'text-success' : 'text-danger'}>
                                <h2>
                                    {Math.round(100*search.quote.c)/100}
                                </h2>
                                <h4>
                                    {changePos ? <IoMdArrowDropup/> : <IoMdArrowDropdown/>}{Math.round(100*search.quote.d)/100+' ('+Math.round(100*search.quote.dp)/100+'%)'}
                                </h4>
                                <p className="text-secondary">{timestamp}</p>
                            </Col>
                        </Row>
                        <Row className="align-items-center my-2">
                            {/* {
                                search.company.market_
                            } */}
                            {isMarketOpen(search.quote.t) ? <p className="fw-bold text-success">Market is Open</p> : <p className="fw-bold text-danger">Market closed on {convertEpochToDate(search.quote.t)}</p>}
                        </Row>
                        <Container>
                            <center>
                                <Container>
                                   <TabContext value={tab}>
                                    <Box
                                        sx={{
                                        display: "flex",
                                        justifyContent: "space-evenly",
                                        alignItems: "center",
                                        maxWidth: 1300,
                                        marginTop: 5,
                                        }}
                                    >
                                        <Tabs
                                        value={tab}
                                        onChange={handleTab}
                                        variant="scrollable"
                                        scrollButtons={true}
                                        indicatorColor="primary"
                                        textColor="primary"
                                        allowScrollButtonsMobile
                                        >
                                        <Tab
                                            value='summary'
                                            label="Summary"
                                            sx={{minWidth: 100, width: 300, textTransform: "capitalize"}}
                                        />
                                        <Tab
                                            value="news"
                                            label="Top News"
                                            sx={{minWidth: 100, width: 300, textTransform: "capitalize"}}
                                        />
                                        <Tab
                                            value="charts"
                                            label="Charts"
                                            sx={{minWidth: 100, width: 300, textTransform: "capitalize"}}
                                        />
                                        <Tab
                                            value="insights"
                                            label="Insights"
                                            sx={{minWidth: 100, width: 300, textTransform: "capitalize"}}
                                        />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value="summary" index={0}>
                                        <Container>
                                            <Row>
                                                <Col lg={6} md={6} sm={12}>
                                                    <Row className="text-center">
                                                        <Col lg={6} md={6} sm={12} xs={12}>
                                                            <Container>
                                                                <span className="fw-bold">High Price: </span>
                                                                {search.quote.h}
                                                            </Container>
                                                            <Container>
                                                                <span className="fw-bold">Low Price: </span>
                                                                {search.quote.l}
                                                            </Container>
                                                            <Container>
                                                                <span className="fw-bold">Open Price: </span>
                                                                {search.quote.o}
                                                            </Container>
                                                            <Container>
                                                                <span className="fw-bold">Prev. Price: </span>
                                                                {search.quote.pc}
                                                            </Container>
                                                        </Col>
                                                    </Row>
                                                    <Row className="my-5 text-center">
                                                        <Col xs={12}>
                                                            <p className="fs-5 fw-bold text-decoration-underline">About the Company</p>
                                                            <Container className="my-4">
                                                                <Container>
                                                                    <span className="fw-bold">IPO Start Date: </span>
                                                                    {search.company.ipo}
                                                                </Container>
                                                                <Container className="my-2">
                                                                    <span className="fw-bold">Industry: </span>
                                                                    {search.company.finnhubIndustry}
                                                                </Container>
                                                                <Container className="my-2">
                                                                    <span className="fw-bold">Webpage: </span>
                                                                    <a href={search.company.weburl} target="_blank">{search.company.weburl}</a>
                                                                </Container>
                                                                <Container className="my-2">
                                                                    <span className="fw-bold">Company Peers: </span>
                                                                </Container>
                                                                <Container className="my-2">
                                                                    {
                                                                        search.peers.map(
                                                                            (ticker, index) => (
                                                                                <span key={ticker}>
                                                                                    <Link to={'/search/'+ticker}>{ticker}{index<search.peers.length-1 ? ', ' : ''}</Link>
                                                                                </span>
                                                                            )
                                                                        )
                                                                    }
                                                                </Container>
                                                            </Container>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col>
                                                    <HighchartsReact highcharts={Highcharts} options={
                                                        {
                                                            chart: {
                                                                  type: 'line',
                                                                  width: 500, // Set the width of the chart
                                                              },
                                                              title: {
                                                                  text: `${tickerParam} Hourly Price Variation`,
                                                                  align: 'center'
                                                              },
                                                              xAxis: {
                                                                type: 'datetime',
                                                                categories: search.priceVariation.hours,
                                                                tickInterval: 5,
                                                                tickWidth: 1, 
                                                                tickLength: 10,
                                                                tickColor: '#666',
                                                            },
                                                            plotOptions: {
                                                              series: {
                                                                  label: {
                                                                      connectorAllowed: false
                                                                  },
                                                                  pointStart: 2
                                                              }
                                                          },
                                                              yAxis: {
                                                                title: {
                                                                    text: '' 
                                                                },
                                                                opposite: true 
                                                              },
                                                              legend: {
                                                                  layout: 'vertical',
                                                                  align: 'right',
                                                                  verticalAlign: 'middle',
                                                                  enabled: false 
                                                              },
                                                              series: [{
                                                                  data: search.priceVariation.hourlyPrice,
                                                                  color: 'green',
                                                                  marker: {
                                                                    enabled: false 
                                                                }
                                                              }],
                                                              responsive: {
                                                                  rules: [{
                                                                      condition: {
                                                                          maxWidth: 500
                                                                      },
                                                                      chartOptions: {
                                                                          legend: {
                                                                              layout: 'horizontal',
                                                                              align: 'center',
                                                                              verticalAlign: 'bottom'
                                                                          }
                                                                      }
                                                                  }]
                                                              }
                                                          }
                                                    } />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </TabPanel>
                                    <TabPanel value="news" index={1}>
                                        <Container> 
                                            <Row>
                                                <Col xs={12} md={6}>
                                                    {
                                                        search.news.filter((newsItem) => newsItem.image!=''&&newsItem.headline!=''&&newsItem.datetime!=''&&newsItem.summary!=''&&newsItem.url!='').map(
                                                            (newsItem, index) => (
                                                                
                                                                    index<10 ?
                                                                    <Container>
                                                                        <Col xs={12}>
                                                                            <NewsItem newsItem={newsItem} openNewsModal={() => {setNewsModalItem(newsItem)}}/>
                                                                        </Col> 
                                                                        
                                                                    </Container>
                                                                    :
                                                                    null
                                                            )
                                                        )
                                                    }
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    {
                                                        search.news.filter((newsItem) => newsItem.image!=''&&newsItem.headline!=''&&newsItem.datetime!=''&&newsItem.summary!=''&&newsItem.url!='').map(
                                                            (newsItem, index) => (
                                                                
                                                                    index<20 && index>9 ?
                                                                    <Col xs={12}>
                                                                        <NewsItem newsItem={newsItem} />
                                                                    </Col> :
                                                                    null
                                                            )
                                                        )
                                                    }
                                                </Col>
                                            </Row>
                                            {/* <NewsItem newsItem={search.news[0]}/> */}
                                        </Container>
                                    </TabPanel>
                                    <TabPanel value="charts" index={2}>
                                        <Container>
                                        <HighchartsReact highcharts={Highcharts2} constructorType={'stockChart'} options={{
                                            chart: {height: 700},
                
                                            rangeSelector: {
                                              selected: 2,
                                              buttons: [
                                                { type: 'month', count: 1, text: '1m' },
                                                { type: 'month', count: 1, text: '3m' },
                                                { type: 'month', count: 1, text: '6m' },
                                                { type: 'ytd',text: 'YTD', title: 'View year to date' },
                                                { type: 'year', count: 1, text: '1y' },
                                                { type: 'all', text: 'All' }
                                              ],
                                              inputEnabled: true
                                            },
                                          
                                          title: {
                                            text: `${tickerParam} Historical`
                                          },
                                          subtitle: {
                                            text: 'With SMA and Volume by Price technical indicators'
                                          },
                                          xAxis: {
                                              type: 'datetime',
                                              labels: {
                                                  format: '{value: %e %b}'
                                              }
                                            },
                                          yAxis: [{
                                            labels: {
                                              align: 'right',
                                              x: -3
                                            },
                                            title: {
                                              text: 'OHLC'
                                            },
                                            height: '60%',
                                            lineWidth: 2,
                                            resize: {
                                              enabled: true
                                            }
                                          }, {
                                            labels: {
                                              align: 'right',
                                              x: -3
                                            },
                                            title: {
                                              text: 'Volume'
                                            },
                                            top: '65%',
                                            height: '35%',
                                            offset: 0,
                                            lineWidth: 2
                                          }],
                                          series: [{
                                              type: 'candlestick',
                                              name: tickerParam,
                                              id: {tickerParam}+'-ohlc', 
                                              zIndex: 2,
                                              data: search.charts.ohlc
                                            }, {
                                              type: 'column',
                                              name: 'Volume',
                                              id: 'volume',
                                              data: search.charts.volume,
                                              yAxis: 1
                                            }, {
                                              type: 'vbp',
                                              linkedTo: {tickerParam}+'-ohlc', 
                                              params: { volumeSeriesID: 'volume' },
                                              dataLabels: { enabled: false },
                                              zoneLines: { enabled: false }
                                            }, {
                                              type: 'sma',
                                              linkedTo: {tickerParam}+'-ohlc',
                                              zIndex: 1,
                                              marker: { enabled: false }
                                            }]

                                        }} />
                                        </Container>
                                    </TabPanel>
                                    <TabPanel value="insights" index={3}>
                                        <Container>
                                            <p className="fs-5">Insider Sentiments</p>
                                            <Table bordered>
                                                <thead>
                                                    <tr>
                                                        <th>{search.company.name}</th>
                                                        <th>MSPR</th>
                                                        <th>Change</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>Total</th>
                                                        <td>{Math.round(100*search.insider.totalMSPR)/100}</td>
                                                        <td>{search.insider.totalChange}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Positive</th>
                                                        <td>{Math.round(100*search.insider.posMSPR)/100}</td>
                                                        <td>{search.insider.posChange}</td>
                                                    </tr>
                                                    <tr>
                                                        <th>Negative</th>
                                                        <td>{Math.round(100*search.insider.negMSPR)/100}</td>
                                                        <td>{search.insider.negChange}</td>
                                                    </tr>
                                                </tbody>
                                                </Table>
                                                <Row>
                                                <Col xs={12} md={6}>
                                                    <Container className="my-4 mx-2">
                                                    <HighchartsReact highcharts={Highcharts} options={
                                                    {
                                                        chart: {
                                                          type: 'spline',
                                                          backgroundColor: '#f5f5f5',
                                                          events: {
                                                            render: function() {
                                                              var chart = this;
                                                              
                                                                chart.customLine = chart.renderer.path(['M', chart.plotLeft, chart.plotTop + chart.plotHeight + 60, 'L', chart.plotLeft + chart.plotWidth, chart.plotTop + chart.plotHeight + 60])
                                                                  .attr({
                                                                    'stroke-width': 2,
                                                                    stroke: 'black'
                                                                  })
                                                                  .add();
                                                              
                                                            }
                                                          }
                                                        },
                                                        title: {
                                                          text: 'Historical EPS Surprises',
                                                          align: 'center'
                                                        },
                                                        xAxis: {
                                                          categories: search.earnings.combined, 
                                                          title: {
                                                            text: ''
                                                          },
                                                          lineWidth: 2,
                                                        },
                                                        yAxis: {
                                                          title: {
                                                            text: 'Quarterly EPS'
                                                          }
                                                        },
                                                        legend: {
                                                          align: 'center',
                                                          verticalAlign: 'bottom',
                                                          layout: 'horizontal'
                                                        },
                                                        series: [{
                                                          name: 'Actual',
                                                          data: search.earnings.actual
                                                        }, {
                                                          name: 'Estimate',
                                                          data: search.earnings.estimate 
                                                        }]
                                                      }
                                                } />
                                                    </Container>
                                                </Col>
                                                
                                                <Col xs={12} md={6}>
                                                    <Container className="my-4 mx-2">
                                                    <HighchartsReact highcharts={Highcharts} options={
                                                            {
                                                                chart: {
                                                                    type: 'column',
                                                                    backgroundColor: '#f5f5f5'
                                                                },
                                                                title: {
                                                                    text: 'Recommendation Trends',
                                                                    align: 'center'
                                                                },
                                                                xAxis: {
                                                                    categories: search.recs.insightPeriod
                                                                },
                                                                yAxis: {
                                                                    min: 0,
                                                                    title: {
                                                                    text: '#Analysis'
                                                                    },
                                                                    stackLabels: {
                                                                    enabled: true
                                                                    }
                                                                },
                                                                legend: {
                                                                align: 'center',
                                                                verticalAlign: 'bottom',
                                                                layout: 'horizontal'
                                                                },
                                                                tooltip: {
                                                                    headerFormat: '<b>{point.x}</b><br/>',
                                                                    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                                                                },
                                                                plotOptions: {
                                                                    column: {
                                                                    stacking: 'normal',
                                                                    dataLabels: {
                                                                        enabled: true
                                                                    }
                                                                    }
                                                                },
                                                                series: [{
                                                                    name: 'Strong Buy',
                                                                    data: search.recs.strongBuy,
                                                                    color: '#195f32'
                                                                }, {
                                                                    name: 'Buy',
                                                                    data: search.recs.buy,
                                                                    color: '#23af50'
                                                                }, {
                                                                    name: 'Hold',
                                                                    data: search.recs.hold,
                                                                    color:'#af7d28'
                                                                },  {
                                                                    name: 'Sell',
                                                                    data: search.recs.sell,
                                                                    color:'#f05050'
                                                                },  {
                                                                    name: 'Strong Sell',
                                                                    data: search.recs.strongSell,
                                                                    color:'#732828'
                                                                }]
                                                                }
                                                        }/>
                                                    </Container>
                                                </Col>
                                                </Row>
                                                
                                        </Container>
                                    </TabPanel>
                                    </TabContext>
                                </Container>
                            </center>
                        </Container>

                        {openSellModal ? <SellModal 
                            closeModal={()=>setOpenSellModal(false)} 
                            isOpen={openSellModal} 
                            handleSubmit={handleSell}
                            currentPrice={search.quote.c}
                            stock={portfolioData}
                            wallet={wallet}
                        /> : null}

                        {openBuyModal ? <BuyModal 
                            closeModal={()=>setOpenBuyModal(false)} 
                            isOpen={openBuyModal} 
                            handleSubmit={handleBuy}
                            currentPrice={search.quote.c}
                            stock={portfolioData ? portfolioData : {
                                "ticker": tickerParam,
                                "name": search.company.name,
                                "costprice": 0,
                                "quantity": 0
                            }}
                            wallet={wallet}
                        /> : null}

                        {   
                            newsModalItem ?
                            (<NewsModal 
                                closeModal={()=>setNewsModalItem(null)} 
                                showModal={!openNewsModal}
                                newsItem={newsModalItem}
                            />) : null
                        }

                    </Container>
                ) : (
                    <MessageBox 
                        isPositive={false}
                        isDismissible={false}
                        setShow={()=>{}}
                        message={"No data found. Please enter a valid Ticker."}
                    />
                )
            }
        </Container>
    )
};

export default SearchResults;
