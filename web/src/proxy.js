// Import necessary modules
import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express(); // Create express application
const PORT = 4000; // Set server port
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Get access token from environment variable

app.use(express.static('public')); // Serve static files from 'public' directory

// Middleware function for logging request information
app.use((req, res, next) => {
  console.log(`Request URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  next(); // Call next middleware function in the stack
});

// Route for '/search', async to allow await inside
app.get('/search', async (req, res) => {
  try {
    const query = req.query.query; // Extract 'query' parameter from request query
    const escapedQuery = encodeURIComponent(query); // Encode query parameter

    // Fetch data from Spotify API
    const response = await fetch(`https://api.spotify.com/v1/search?q=${escapedQuery}&type=track`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`, // Use access token for authorization
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Log response status and headers
    console.log(`Response status: ${response.status}`);
    console.log(`Response headers: ${JSON.stringify(response.headers)}`);

    // Check if response is ok, else throw error
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    // Parse response data as JSON
    const data = await response.json();

    // Check if any tracks are found, else throw error
    if (!data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
      throw new Error('No tracks found');
    }

    // Map tracks data to specific format
    const tracks = data.tracks.items.map((item) => {
      const image = item.album.images.find(image => image.height === 300); // Find image with height 300
      return {
        title: item.name, // Set track title
        url: image.url, // Set image url
        artist: item.album.artists[0].name, // Set artist name
        duration: item.duration_ms, // Set track duration
        id: item.id // Set track id
      };
    });

    console.log(tracks); // Log tracks data
    res.send(tracks); // Send tracks data as response
  } catch (err) {
    console.error(err); // Log error
    res.status(500).send('Internal server error'); // Send 500 status code for server error
  }
});

// Start server listening on specified port
app.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`);
});
