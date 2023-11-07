const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors")
const bodyParser = require("body-parser")
const axios = require('axios');

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
require('dotenv').config();

// refresh

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000',
        refreshToken
    })
    spotifyApi.refreshAccessToken()
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                expiresIn: data.body.expires_in
            })
        }).catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
})

// login

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'http://localhost:3000',
    }) 
    spotifyApi.authorizationCodeGrant(code)
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
        }).catch((err) => {
            console.log(err)
            res.sendStatus(400)
        })
})

// find lyrics

app.get('/lyrics', async (req, res) => {

    const options = {
        method: 'GET',
        url: 'https://musixmatch-lyrics-songs.p.rapidapi.com/songs/lyrics',
        params: {
          t: req.query.track,
          a: req.query.artist,
          type: 'json'
        },
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_API_KEY,
          'X-RapidAPI-Host': 'musixmatch-lyrics-songs.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          res.json(response.data);
      } catch (error) {
          console.error(error.data);
      }
})

 app.listen(3001);