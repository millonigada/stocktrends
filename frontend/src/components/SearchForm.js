import { useEffect, useState } from "react";
import SearchResults from "./SearchResults";
import Container from "react-bootstrap/esm/Container";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { IoIosSearch } from "react-icons/io";
import { MdClear } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";

const SearchForm = () => {

    const [ticker, setTicker] = useState('')

    const navigate = useNavigate()

    const { tickerParam } = useParams()
    const { dispatch } = useAppContext()

    useEffect(() => {
        setTicker(tickerParam)
    }, [tickerParam]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        const query = ticker.toUpperCase()
        navigate("/search/"+query)
    }

    const handleClear = async (e) => {
        dispatch({type: "SET_SEARCH", payload: null})
        navigate("/search/home")
    }

    return (
            <Container className="mx-auto">
                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Form.Control onChange={(e)=>{setTicker(e.target.value)}} placeholder={"Enter stock ticker symbol"} value={ticker}/>
                        <Button variant="outline-secondary" onClick={handleSubmit}><IoIosSearch /></Button>
                        <Button variant="outline-secondary" onClick={handleClear}><MdClear /></Button>
                    </InputGroup>
                </Form>
            </Container>
        
    )
}

export default SearchForm;