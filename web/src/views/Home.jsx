import React, {useCallback, useState} from 'react';
import MelodyTaxi from '../assets/MelodyTaxi.png';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTrack, setActiveTrack] = useState(null);

  const handleSearchInputChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const msToMin = (ms) => Math.floor(ms / (1000 * 60));

  const fetchSearchResults = async () => {
    if (searchQuery === '') return;

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:4000/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      const tracks = data.map((item) => ({
        title: item.title,
        artist: item.artist,
        duration: item.duration,
        image: item.url,
        id: item.id
      }));
      setSearchResults(tracks);
    } catch (err) {
      console.error(err);
      setSearchResults([]);
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  const handleClickTrack = (id) => {
    setActiveTrack(id);
  };

  return (
    <div className="container">
      <div className="navbar">
        <div className="logo-container">
          <img src={MelodyTaxi} alt="Logo" className="logo"/>
        </div>
        <div className="search-box-container">
          <div className="search-box">
            <input type="text" placeholder="Search music" className="search-input" value={searchQuery} onChange={handleSearchInputChange}/>
            <button className="search-button" onClick={fetchSearchResults} disabled={loading || searchQuery === ""}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      <div className="card-container">
        {searchResults.map((result,
                             index) => (
          <div className="card-wrapper" key={index}>
            <div className="card">
              <div className="card-image">
                <img src={result.image} alt={result.title} height={200} width={200} onClick={() => handleClickTrack(result.id)}/>
              </div>
              <div className="card-content">
                <div className="card-title">{result.title}</div>
                <div className="card-text">─ {result.artist}</div>
                <div className="card-small-text">Duration: {msToMin(result.duration)}:00</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="spotify-player-wrapper">
        <div className="spotify-player">
          <iframe
            src={activeTrack ? `https://open.spotify.com/embed/track/${activeTrack}` : ""}
            width="100%"
            height="80"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media">
            autoplay={activeTrack ? "true" : "false"}
          </iframe>
        </div>
      </div>
    </div>
  );
}

export default Home;
