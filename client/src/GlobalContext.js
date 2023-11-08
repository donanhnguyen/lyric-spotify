import { createContext } from "react";

const GlobalContext = createContext();

export function GlobalProvider( {children} ) {

    let renderURL = "";
    if (process.env.NODE_ENV === "development") {
        renderURL = "http://localhost:3001";
    } else if (process.env.NODE_ENV === 'production') {
        renderURL = "https://lyric-spotify-backend.onrender.com";
    };
    
    return (
        <GlobalContext.Provider value={ {
            renderURL,
        } }>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;