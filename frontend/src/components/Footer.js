import Container from "react-bootstrap/esm/Container"

const AppFooter = () => {
    return (
        <Container>
            <footer className="fixed-bottom bg-light py-2 text-center">  
                <span className='fw-bold' style={{fontSize:1+'rem'}}>Powered by <a href='https://finnhub.io'>Finnhub.io</a></span>
            </footer>
        </Container>
    )
}

export default AppFooter