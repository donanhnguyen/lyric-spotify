import {useContext} from 'react'
import {Container, Image} from 'react-bootstrap';
import GlobalContext from './GlobalContext';

export default function Login() {

  const {SpotifyRedirectURI} = useContext(GlobalContext);

  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=3762e76b0589453c882fd03dc454aa60&response_type=code&redirect_uri=${SpotifyRedirectURI}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`

  return (
    <Container className='d-flex flex-column justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
      <Image src={require('./spotifylogo.jpg')} alt="Spotify Logo" fluid /> {/* Add the image here */}
      <a className='btn btn-success btn-lg mt-3' href={AUTH_URL}>
        Login with Spotify
      </a>
    </Container>
  );
}
