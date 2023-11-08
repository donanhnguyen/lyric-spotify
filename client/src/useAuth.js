import {useEffect, useState, useContext} from 'react';
import axios from 'axios';
import GlobalContext from './GlobalContext';

export default function useAuth(code) {

    const [accessToken, setAccessToken] = useState();
    const [refreshToken, setRefreshToken] = useState();
    const [expiresIn, setExpiresIn] = useState();

    const {renderURL} = useContext(GlobalContext);

    useEffect(() => {
        axios.post(`${renderURL}/login`, {code})
            .then((response) => {
                // console.log(response.data)
                setAccessToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
                setExpiresIn(response.data.expiresIn);
                // window.history.pushState({}, null, "/")
            })
            .catch(() => {
                // console.log("errorrr log in")
                // window.location = '/' 
            })
    }, [code]) 
 
    useEffect(() => {
        if (!refreshToken || !expiresIn) {
            return
        } else {
           const timeOut = setInterval(() => {
                axios.post(`${renderURL}/refresh`, {refreshToken})
                    .then((response) => {
                        // console.log(response.data) 
                        setAccessToken(response.data.accessToken);
                        setExpiresIn(response.data.expiresIn);    
                    })
                    .catch(() => {
                        // console.log("errorrr refresh")
                        // window.location = '/'
                    })
                }, (expiresIn -60) * 1000)

            return () => clearTimeout(timeOut) 
        }
        
    }, [refreshToken, expiresIn])

    return accessToken
} 
