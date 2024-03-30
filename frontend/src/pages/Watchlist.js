import { useEffect, useState } from "react";
import { useAppContext } from "../hooks/useAppContext";
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import WatchlistItem from '../components/WatchlistItem';
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";

const Watchlist = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [watchlistExists, setWatchlistExists] = useState(false)

    const {watchlist, dispatch} = useAppContext()

    useEffect(() => {
        const fetchStocks = async () => {
            const response = await fetch('http://localhost:4000/watchlist')
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

    return (
        <Col xs={12} md={8} lg={8} className="mx-auto">
            <h3 className="my-2">My Watchlist</h3>
            {
                isLoading ?
                <Spinner/> :
                watchlistExists && watchlist ?
                <Container>
                    {watchlist && watchlist.map((stock) => (
                        <WatchlistItem stock={stock} allDeleted={setWatchlistExists}/>
                    ))}
                </Container> :
                <Card className="bg-light text-center my-4">
                    <Card.Body>
                    Currently you don't have any stock in your watchlist.
                    </Card.Body>
                </Card>
            }
        </Col>
    )
}

export default Watchlist;