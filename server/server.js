const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        clientId: '3762e76b0589453c882fd03dc454aa60',
        clientSecret: '519db0a8c6de4f508dbffb00814dd0e5',
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

app.post('/login', (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        clientId: '3762e76b0589453c882fd03dc454aa60',
        clientSecret: '519db0a8c6de4f508dbffb00814dd0e5',
        redirectUri: 'http://localhost:3000'
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

 app.listen(3001);