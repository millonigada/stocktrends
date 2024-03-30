import { createContext, useReducer } from 'react'

export const AppContext = createContext()

export const appReducer = (state, action) => {
    // console.log("WATCHLIST CONTEXT:"+state.watchlist)
    // console.log("PORTFOLIO CONTEXT:"+state.portfolio)
    // console.log("WALLET CONTEXT:"+state.wallet)
    switch (action.type) {
        case 'SET_SEARCH':
            console.log("context search",action.payload)
            return {
                search: action.payload,
                watchlist: state.watchlist,
                portfolio: state.portfolio,
                wallet: state.wallet
            }

        case 'SET_WATCHLIST':
            return {
                search: state.search,
                watchlist: action.payload,
                portfolio: state.portfolio,
                wallet: state.wallet
            }

        case 'ADD_WATCHLIST':
            return {
                search: state.search,
                watchlist: [action.payload, ...state.watchlist],
                portfolio: state.portfolio,
                wallet: state.wallet
            }

        case 'DELETE_WATCHLIST':
            return {
                search: state.search,
                watchlist: state.watchlist.filter((watchlistItem) => watchlistItem._id!=action.payload._id),
                portfolio: state.portfolio,
                wallet: state.wallet
            }

        case 'SET_PORTFOLIO':
            return {
                search: state.search,
                watchlist: state.watchlist,
                portfolio: action.payload,
                wallet: state.wallet
            }

        case 'ADD_PORTFOLIO':
            return {
                search: state.search,
                watchlist: state.watchlist,
                portfolio: [action.payload, ...state.portfolio],
                wallet: state.wallet
            }

        case 'DELETE_PORTFOLIO':
            return {
                search: state.search,
                watchlist: state.watchlist,
                portfolio: state.portfolio.filter((portfolioItem) => portfolioItem._id!=action.payload._id),
                wallet: state.wallet
            }

        case 'UPDATE_PORTFOLIO':
            return {
                search: state.search,
                watchlist: state.watchlist,
                portfolio: [action.payload, ...state.portfolio.filter((portfolioItem) => portfolioItem._id!=action.payload._id)].sort(function(a,b){return (b.createdAt - a.createdAt)}),
                wallet: state.wallet
            }

        case 'SET_WALLET':
            return {
                search: state.search,
                watchlist: state.watchlist,
                portfolio: state.portfolio,
                wallet: action.payload
            }

        default:
            return state
    }
}

export const AppContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(appReducer, {
        search: null,
        watchlist: null,
        portfolio: null,
        wallet: null
    })

    return (
        <AppContext.Provider value={{...state, dispatch}}>
            { children }
        </AppContext.Provider>
    )
}

