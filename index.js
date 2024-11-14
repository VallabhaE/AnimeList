import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
const port = 3000;
const BASEURL = 'https://kitsu.io/api/edge';

// Middleware to serve static files from the 'public' folder
app.use(express.static('public'));

// Middleware to parse URL-encoded data (from form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// Default route rendering the home page
app.get('/', async (req, res) => {
  try {
    // Rendering index.ejs without any API data for the homepage
    res.render('index.ejs');
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Search route handling form submissions (POST method)
app.post('/search', async (req, res) => {
  try {
    // Get the search term from the POST request body
    const searchQuery = req.body.searchData;

    // Fetch anime data from the API based on the search query
    const response = await axios.get(`${BASEURL}/anime?filter[text]=${searchQuery}`);
    
    // Pass the data to the view for rendering
    res.render('index.ejs', { dataIn: response.data });
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Advanced search route (for anime with a specific category)
app.get('/adv', async (req, res) => {
  try {
    // Fetch anime data with a filter for the 'adventure' category
    const response = await axios.get(`${BASEURL}/anime?filter[categories]=adventure`);
    
    // Pass the data to the view for rendering
    res.render('index.ejs', { dataIn: response.data });
  } catch (error) {
    console.error('Error fetching data from API:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
