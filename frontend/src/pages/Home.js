// import { useEffect, useState } from "react";
import SearchForm from "../components/SearchForm";
import Container from "react-bootstrap/esm/Container";

const Home = () => {

    return (
        <Container className="Home mx-auto">
            <Container className="text-center my-4"><h2>STOCK</h2></Container>
            <SearchForm/>
        </Container>
    )
}

export default Home;