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
import serverURI from "..";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import MessageBox from "./MessageBox";
import Spinner from "react-bootstrap/esm/Spinner";

const AutocompleteBox = ({autocompleteArray, navigate, setAutocompleteSuggestionsExist}) => {

    // const navigate = useNavigate()

    console.log("Autobox array",autocompleteArray)

    return (
        <Col className="autocompleteBox shadow-sm p-3 mb-5 bg-white rounded">
            <Container>
            {
                autocompleteArray && autocompleteArray.filter((item) => item.type == 'Common Stock' && !item.symbol.includes('.')).map((item) => (
                    <Row>
                        
                        <Container className="box mb-2" onClick={() => {
                            setAutocompleteSuggestionsExist(false)
                            navigate("/search/"+item.symbol)
                        }}>
                            {item.symbol} | {item.description}

                        </Container>
                    </Row>
                ))
            }
            </Container>
        </Col>
    )
}

const SearchForm = () => {

    const [ticker, setTicker] = useState(null)

    const navigate = useNavigate()

    const [autocompleteArray, setAutocompleteArray] = useState([])
    const [autocompleteSuggestionsExist, setAutocompleteSuggestionsExist] = useState(false)
    const [autocompleteLoading, setAutocompleteLoading] = useState(false)

    const [isQueryEmpty, setIsQueryEmpty] = useState(false)

    const { tickerParam } = useParams()
    const { dispatch } = useAppContext()

    useEffect(() => {

        console.log("ticker", ticker)

        const fetchAutocomplete = async (ticker) => {
            setAutocompleteLoading(true)
            const response = await fetch(serverURI+'search/autocomplete/'+ticker)
            const json = await response.json()

            console.log("AUTOCOMPLETE: ",json)

            if(response.ok && ticker && ticker!=tickerParam){
                setAutocompleteArray(json.result)
                setAutocompleteSuggestionsExist(true)
            }
            setAutocompleteLoading(false)
        }

        if(ticker){
            fetchAutocomplete(ticker.trim())
        }

    }, [ticker]);

    useEffect(() => {
        setTicker(tickerParam)
        if(ticker==tickerParam){
            setAutocompleteSuggestionsExist(false)
        }
    }, [tickerParam])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const query = ticker.toUpperCase()
        setAutocompleteSuggestionsExist(false)
        navigate("/search/"+query)
    }

    const handleClear = async (e) => {
        setAutocompleteArray([])
        setAutocompleteSuggestionsExist(false)
        dispatch({type: "SET_SEARCH", payload: null})
        navigate("/search/home")
    }

    return (
        <Container>
            <Container className="mx-auto p-0 border rounded border-primary rounded-pill">
                <Container>
                <Form onSubmit={(e) => {
                        e.preventDefault()
                        setAutocompleteSuggestionsExist(false)
                        if(!ticker || ticker.length==0){
                            setIsQueryEmpty(true)
                        } else {
                            handleSubmit(e)
                        }
                    }}>
                    <InputGroup>
                        <Form.Control className="border-0 rounded-pill" onChange={(e)=>{
                            console.log(ticker)
                            setIsQueryEmpty(false)
                            setTicker(e.target.value)
                            }} placeholder={"Enter stock ticker symbol"} value={ticker}/>
                        <Button variant="link" onClick={handleSubmit}><IoIosSearch /></Button>
                        <Button variant="link" onClick={handleClear}><MdClear /></Button>
                    </InputGroup>
                </Form>
                </Container>
                
                {autocompleteSuggestionsExist ? 
                autocompleteLoading ?
                <Container className="mx-auto autocompleteBox bg-white rounded" style={{width:100}}><Spinner></Spinner></Container> :
                AutocompleteBox({autocompleteArray, navigate, setAutocompleteSuggestionsExist}) 
                : null}
                
            </Container>
            {   isQueryEmpty ?
                    <Container>
                        <MessageBox 
                                isPositive={false}
                                isDismissible={false}
                                setShow={()=>{}}
                                message={"Please enter a valid Ticker."}
                            />
                    </Container> : null
                }
        </Container>
        
    )
}

export default SearchForm;