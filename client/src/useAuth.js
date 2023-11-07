import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function useAuth(code) {
    const [accessToken, setAccessToken] = React.useState();
    const [refreshToken, setRefreshToken] = React.useState();
    const [expiresIn, setExpiresIn] = React.useState();

    useEffect(() => {
        axios.post("http://localhost:3001/login", {code})
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
                axios.post("http://localhost:3001/refresh", {refreshToken})
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
