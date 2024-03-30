import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home';
import StockNavbar from './components/Navbar';
import AppFooter from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Watchlist from './pages/Watchlist';
import Portfolio from './pages/Portfolio';
import SearchResults from './components/SearchResults';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <StockNavbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={<Home/>}
            />
            <Route
              path="/search/home"
              element={<Home/>}
            />
            <Route
              path="/search/:tickerParam"
              element={<SearchResults/>}
            />
            <Route
              path="/watchlist"
              element={<Watchlist/>}
            />
            <Route
              path="/portfolio"
              element={<Portfolio/>}
            />
          </Routes>
        </div>
        <AppFooter/>
      </BrowserRouter>
    </div>
  );
}

export default App;
