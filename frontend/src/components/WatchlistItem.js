import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { MdClear } from "react-icons/md";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import { useNavigate } from "react-router-dom";
import serverURI from "..";

const WatchlistItem = ({ stock }) => {

    const [currentPrice, setCurrentPrice] = useState(null)
    const [change, setChange] = useState(null)
    const [pChange, setPChange] = useState(null)
    const [changePos, setChangePos] = useState(null)

    const {dispatch} = useAppContext()
    const navigate = useNavigate()

    const deleteStockFromWatchlist = async (e) => {
      
      e.preventDefault()
        const response = await fetch(serverURI+'watchlist/'+stock.ticker, {
            method: 'DELETE'
        })
        const json = await response.json()
    
        if(response.ok){
            dispatch({type: 'DELETE_WATCHLIST', payload: json})
            console.log("deleted successfully")
        }
    }

    useEffect(() => {
        const fetchStockQuote = async () => {
            const response = await fetch(serverURI+'search/quote/'+stock.ticker)
            const json = await response.json()

            if(response.ok){
                
                if(json.d >= 0){
                    setChangePos(true)
                } else {
                    setChangePos(false)
                }
                setCurrentPrice(Math.round(json.c * 100) / 100)
                setChange(Math.round(json.d * 100) / 100)
                setPChange(Math.round(json.dp * 100) / 100)
            }
        }

        fetchStockQuote()

        const interval = setInterval(fetchStockQuote, 15000)
        
        return () => clearInterval(interval)
    }, [])

    

  return (
    <Card className="my-1" onClick={(e) => {
        if(e.defaultPrevented){
          return
        }
        navigate('/search/'+stock.ticker)
      }}>
      <Card.Body>
        <Col>
          <Row>
            <Col xs="auto">
              <Button variant="link" className="text-left text-secondary" onClick={deleteStockFromWatchlist}>
                <MdClear />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>
                <h3>{stock.ticker}</h3>
                <p>{stock.name}</p>
              </div>
            </Col>
            <Col style={{color: changePos ? "green" : "red"}}>
                <p>{currentPrice}</p>
                <span>{changePos ? <IoMdArrowDropup/> : <IoMdArrowDropdown/>}{" "+change+" ("+pChange+"%)"}</span>
            </Col>
          </Row>
        </Col>
      </Card.Body>
    </Card>
  );
};

export default WatchlistItem;
