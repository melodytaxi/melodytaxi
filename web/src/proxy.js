import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 4000;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// ... rest of your code

app.use(express.static('public'));

app.use((req, res, next) => {
  console.log(`Request URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next();
});

app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const escapedQuery = encodeURIComponent(query);

    const response = await fetch(`https://api.spotify.com/v1/search?q=${escapedQuery}&type=track`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers: ${JSON.stringify(response.headers)}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();

    if (!data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
      throw new Error('No tracks found');
    }

    const tracks = data.tracks.items.map((item) => {
      const image = item.album.images.find(image => image.height === 300);
      return {
        title: item.name,
        url: image.url,
        artist: item.album.artists[0].name,
        duration: item.duration_ms,
        id: item.id // Include the track id
      };
    });

    console.log(tracks);
    res.send(tracks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
