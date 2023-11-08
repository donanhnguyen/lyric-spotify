import { createContext } from "react";

const GlobalContext = createContext();

export function GlobalProvider( {children} ) {

    let renderURL;
    let SpotifyRedirectURI;
    if (process.env.NODE_ENV === "development") {
        renderURL = "http://localhost:3001";
        SpotifyRedirectURI = "http://localhost:3000"
    } else if (process.env.NODE_ENV === 'production') {
        renderURL = "https://lyric-spotify-backend.onrender.com";
        SpotifyRedirectURI = "https://lyric-spotify.onrender.com";
    };
    
    return (
        <GlobalContext.Provider value={ {
            renderURL,
            SpotifyRedirectURI
        } }>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext;