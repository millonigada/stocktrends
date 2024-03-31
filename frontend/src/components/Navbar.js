import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useAppContext } from '../hooks/useAppContext';

const StockNavbar = () => {

    const {search} = useAppContext()

    return (
        <Navbar expand="lg" className="stocknavbar text-white" style={{backgroundColor: '#6f00c1'}}>
        <Container >
          <Navbar.Brand href="/search/home" className='text-white'>Stock Search</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto justify-content-end">
              <Nav.Link href="">
                <Link to={search ? '/search/'+search.ticker : '/search/home'}>
                  <Button variant='outline-light'>
                    Search
                  </Button>
                </Link>
              </Nav.Link>
              <Nav.Link href="">
              <Link to='/watchlist'>
                  <Button variant='outline-light'>
                    Watchlist
                  </Button>
                </Link>
              </Nav.Link>
              <Nav.Link href="">
              <Link to='/portfolio'>
                <Button variant='outline-light'>
                  Portfolio
                </Button>
              </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default StockNavbar