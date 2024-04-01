import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import WatchlistItem from '../components/WatchlistItem';
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import serverURI from "..";

const Watchlist = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [watchlistExists, setWatchlistExists] = useState(false)

    const {watchlist, dispatch} = useAppContext()

    useEffect(() => {
        const fetchStocks = async () => {
            const response = await fetch(serverURI+'watchlist')

            console.log("watchlist response ", response)

            const json = await response.json()

            if(response.status == 200){
                dispatch({type: 'SET_WATCHLIST', payload: json})
                setWatchlistExists(true)
                // setStocks(json)
            } else if(response.status == 404){
                setWatchlistExists(false)
            }
            setIsLoading(false)
        }

        fetchStocks()
    }, [])

    useEffect(() => {
        if(!watchlist || watchlist.length==0){
            setWatchlistExists(false)
          }
    }, [watchlist])

    return (
        <Col xs={12} md={8} lg={8} className="mx-auto">
            <h3 className="my-2">My Watchlist</h3>
            {
                isLoading ?
                <Spinner/> :
                watchlistExists && watchlist ?
                <Container>
                    {watchlist && watchlist.map((stock) => (
                        <WatchlistItem stock={stock} allDeleted={() => {
                            setWatchlistExists(false)
                        }}/>
                    ))}
                </Container> :
                <Card className="nodatacard text-center my-4 mx-2" style={{backgroundColor: '#faf4bc'}}>
                    <Card.Body>
                    Currently you don't have any stock in your watchlist.
                    </Card.Body>
                </Card>
            }
        </Col>
    )
}

export default Watchlist;