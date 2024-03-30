import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/esm/Container";
import { MdClear } from "react-icons/md";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import SellModal from "./SellModal";
import axios from "axios";
import BuyModal from "./BuyModal";
import serverURI from "../index";

const PortfolioItem = ({ stock, wallet }) => {

    const [currentPrice, setCurrentPrice] = useState(null)
    const [change, setChange] = useState(null)
    const [changePos, setChangePos] = useState(null)

    const [displayQuantity, setDisplayQuantity] = useState(stock.quantity)
    const [displayCostprice, setDisplayCostprice] = useState(stock.costprice)

    const [openSellModal, setOpenSellModal] = useState(false)
    const [openBuyModal, setOpenBuyModal] = useState(false)

    const {dispatch} = useAppContext()

    const handleSell = async (sellQuantity, sellPrice) => {

        const newWallet = wallet + (sellQuantity*sellPrice)
        const newQuantity = stock.quantity - sellQuantity

        const response = await axios.patch('http://localhost:4000/wallet', {
            amount: newWallet
        })
        const json = await response.data
        if(response.status == 200){
            console.log("Wallet updated")
            dispatch({type: 'SET_WALLET', payload: newWallet})
        }

        if(newQuantity!=0){
            const response = await axios.patch('http://localhost:4000/portfolio/'+stock.ticker, {
                quantity: newQuantity
            })
            const json = await response.data
            if(response.status == 200){
                console.log("Stock updated")
                let updatedStock = stock
                updatedStock.quantity = newQuantity
                dispatch({type: 'UPDATE_PORTFOLIO', payload: updatedStock})
            }
        } else {
            const response = await axios.delete('http://localhost:4000/portfolio/'+stock.ticker)
            if(response.status == 200){
                console.log("Stock deleted")
                dispatch({type: 'DELETE_PORTFOLIO', payload: stock})
            }
        }
    }

    const handleBuy = async (buyQuantity, buyPrice) => {
        const newWallet = wallet - (buyQuantity*buyPrice)
        const newQuantity = Number(stock.quantity) + Number(buyQuantity)
        const newCostprice = (Number(stock.costprice)+Number(buyPrice))/2

        const response = await axios.patch('http://localhost:4000/wallet', {
            amount: newWallet
        })
        const json = await response.data
        if(response.status == 200){
            console.log("Wallet updated")
            dispatch({type: 'SET_WALLET', payload: newWallet})
        }

        if(newQuantity!=0){
            const response = await axios.patch('http://localhost:4000/portfolio/'+stock.ticker, {
                quantity: newQuantity,
                costprice: newCostprice
            })
            const json = await response.data
            if(response.status == 200){
                console.log("Stock updated")
                let updatedStock = stock
                updatedStock.quantity = newQuantity
                updatedStock.costprice = newCostprice
                dispatch({type: 'UPDATE_PORTFOLIO', payload: updatedStock})
            }
        }
    }

    useEffect(() => {
        const fetchStockQuote = async () => {
            const response = await fetch(serverURI+'search/quote/'+stock.ticker)
            const json = await response.json()

            if(response.ok){

                if(json.c >= stock.costprice){
                    setChangePos(true)
                } else {
                    setChangePos(false)
                }
                setCurrentPrice(Math.round(json.c * 100) / 100)
                setChange(Math.round(json.d * 100) / 100)
            }
        }

        fetchStockQuote()

        const interval = setInterval(fetchStockQuote, 15000)
        
        return () => clearInterval(interval)
    }, [])

    

  return (
    <Card className="my-2">
        <Card.Header>
                <b>{stock.ticker}</b>
                <span>{" "+stock.name}</span>
        </Card.Header>
      <Card.Body>
        <Col>
          
          <Row>
            <Col xs={6} md={3}>
              <div>
                <p>Quantity:</p>
                <p>Avg. Cost / Share:</p>
                <p>Total Cost:</p>
              </div>
            </Col>
            <Col xs={6} md={3}>
                <p>{stock.quantity}</p>
                <p>{Math.round(stock.costprice*100)/100}</p>
                <p>{Math.round(stock.quantity*stock.costprice*100)/100}</p>
            </Col>
            <Col xs={6} md={3}>
            <div>
                <p>Change:</p>
                <p>Current Price:</p>
                <p>Market Value:</p>
              </div>
            </Col>
            <Col xs={6} md={3} style={{color: changePos ? "green" : "red"}}>
                <p>{changePos ? <IoMdArrowDropup/> : <IoMdArrowDropdown/>}{" "+change}</p>
                <p>{currentPrice}</p>
                <p>{Math.round(currentPrice*stock.quantity*100)/100}</p>
            </Col>
          </Row>
          
        </Col>

        {openSellModal ? <SellModal 
            closeModal={()=>setOpenSellModal(false)} 
            isOpen={openSellModal} 
            handleSubmit={handleSell}
            currentPrice={currentPrice}
            stock={stock}
            wallet={wallet}
        /> : null}

        {openBuyModal ? <BuyModal 
            closeModal={()=>setOpenBuyModal(false)} 
            isOpen={openBuyModal} 
            handleSubmit={handleBuy}
            currentPrice={currentPrice}
            stock={stock}
            wallet={wallet}
        /> : null}

      </Card.Body>
      <Card.Footer>
      <Row className="bg-light">
        <Col xs={2} lg={1}>
        <Container >
                <Button variant="primary" className="text-left text-secondary text-white" onClick={() => setOpenBuyModal(true)}>
                    Buy
                </Button>
            </Container>
        </Col>
        <Col xs={2} lg={1}>
        <Container >
                <Button variant="danger" className="text-left text-secondary text-white" onClick={() => setOpenSellModal(true)}>
                    Sell
                </Button>
            </Container>
        </Col>
          </Row>
      </Card.Footer>
    </Card>
  );
};

export default PortfolioItem;
