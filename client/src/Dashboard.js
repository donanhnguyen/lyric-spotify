import {useState, useEffect} from 'react'
import useAuth from './useAuth';
import { Container, Form } from 'react-bootstrap';
import SpotifyWebApi from 'spotify-web-api-node';
import TrackSearchResult from './TrackSearchResult';
import Player from './Player';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi({
  clientId: '3762e76b0589453c882fd03dc454aa60',
}) 

export default function Dashboard({code}) {

  const accessToken = useAuth(code);
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [currentlyPlaying, setCurrentlyPlaying] = useState();
  const [songLyrics, setSongLyrics] = useState("");

  // console.log("accesstoken or not")
  // console.log(!accessToken)

  // console.log("search results")
  // console.log(searchResults)

  function selectTrack(track) {
    setCurrentlyPlaying(track);
    setSearch('');
    setSongLyrics('');
  }

  useEffect(() => {
    if (!currentlyPlaying) {
      return
    }
    let params = {
      track: currentlyPlaying.title,
      artist: currentlyPlaying.artist
    }
    axios.get('http://localhost:3001/lyrics', {params})
        .then((response) => {
          setSongLyrics(response.data)
        })
    
  }, [currentlyPlaying])

  useEffect(() => {
    if (!accessToken) return
    spotifyApi.setAccessToken(accessToken)
  }, [accessToken])


  useEffect(() => {
    if (!search) return setSearchResults([])
    if (!accessToken) {
        alert("Please log in again.")
        window.location = '/' 
    }

    let cancel = false;
 
    spotifyApi.searchTracks(search)
      .then((response) => {

        if (cancel) return

          const results = response.body.tracks.items.map((track) => {
            const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
              if (image.height < smallest.height) {
                return image
              }
              return smallest
            }, track.album.images[0])

            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url
            }
          })

          setSearchResults(results);
        
      })
      .catch((err) => {
        console.log(err)
      })

      return () => cancel = true;

  }, [search, accessToken])

  return (
    <Container className='d-flex flex-column py-2' style={{height: '100vh'}}>
    
      <Form.Control 
        type='search' 
        placeholder='Search Songs or Artists' 
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
      />

      <div className='flex-grow-1 my-2' style={{overflowY: 'auto'}}>

          {searchResults.map((track) => {
            return (
              <TrackSearchResult key={track.uri} track={track} selectTrack={selectTrack}/>
            )
          })}

          {searchResults.length === 0 && (
            <div className='text-center' style={{whiteSpace: 'pre', color: 'white'}}>
              
              {songLyrics.length > 0 && songLyrics.map((lyric, i) => {
                  return (
                    <div key={i}>{lyric.text}</div>
                  )
              })}

            </div>
          )}

      </div>

      <div>
        <Player accessToken={accessToken} trackUri={currentlyPlaying?.uri}/>
      </div>

    </Container>
  )
}
