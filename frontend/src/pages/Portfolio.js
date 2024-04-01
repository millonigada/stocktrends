import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import PortfolioItem from '../components/PortfolioItem';
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import MessageBox from "../components/MessageBox";
import serverURI from "..";

const Portfolio = () => {

    const [isLoadingWallet, setIsLoadingWallet] = useState(true)
    const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(true)
    const [portfolioExists, setPortfolioExists] = useState(false)

    const {wallet, portfolio, dispatch} = useAppContext()

    const [stockBought, setStockBought] = useState(false)
    const [stockSold, setStockSold] = useState(false)
    const [stockDealtWith, setStockDealtWith] = useState('')

    useEffect(() => {
        const fetchWallet = async () => {
            const response = await fetch(serverURI+'wallet')
            const json = await response.json()

            if(response.ok){
                
                dispatch({type: 'SET_WALLET', payload: json})
                // setStocks(json)
            }

            setIsLoadingWallet(false)
        }

        const fetchStocks = async () => {
            const response = await fetch(serverURI+'portfolio')
            const json = await response.json()

            if(response.status == 200){
                setPortfolioExists(true)
                dispatch({type: 'SET_PORTFOLIO', payload: json})
                // setStocks(json)
            } else if(response.status == 404) {
                setPortfolioExists(false)
            }
            setIsLoadingPortfolio(false)
        }

        fetchWallet()
        fetchStocks()

        if(portfolio && portfolio.length == 0){
            setPortfolioExists(false)
        }
    }, [])

    useEffect(() => {
        if(!portfolio || portfolio.length==0){
            setPortfolioExists(false)
          }
    }, [portfolio])

    return (
        <Col xs={12} md={10} lg={8} className="mx-auto">
            { stockBought ? 
                            <MessageBox 
                                isPositive={true}
                                isDismissible={true}
                                setShow={setStockBought}
                                message={stockDealtWith+" bought successfully."}
                            /> :
                            null
                    }
                    { stockSold ? 
                            <MessageBox 
                                isPositive={false}
                                isDismissible={true}
                                setShow={setStockSold}
                                message={stockDealtWith+" sold successfully."}
                            /> :
                            null
                    }
            <Container><h3>My Portfolio</h3></Container>
            {isLoadingWallet || isLoadingPortfolio ?
            <Spinner/> :
            <Container>
                <p>Money in Wallet: ${Math.round(wallet*100)/100}</p>
                {portfolioExists && portfolio ?
                <Container>
                    {portfolio && portfolio.map((stock) => (
                        <PortfolioItem stock={stock} wallet={wallet} setStockBought={setStockBought} setStockSold={setStockSold} setStockDealtWith={setStockDealtWith}/>
                    ))}
                </Container> 
                :
                <Card className="text-center my-4" style={{backgroundColor: '#faf4bc'}}>
                    <Card.Body>
                        Currently you don't have any stock.
                    </Card.Body>
                </Card>
            }
                <Container style={{height: '3rem'}}></Container>
            </Container>} 
        </Col>
    )
}

export default Portfolio;