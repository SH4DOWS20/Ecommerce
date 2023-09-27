/*// Import required modules
const http = require('http'); // Import the 'http' module for creating an HTTP server
const fs = require('fs'); // Import the 'fs' module for working with the file system
const path = require('path'); // Import the 'path' module for handling file paths

// Create an HTTP server
const server = http.createServer((req, res) => {
  // Check if the request method is GET and the URL is '/api/users'
  if (req.method === 'GET' && req.url === '/api/users') {
    // Read user data from a file using fs and path modules
    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
      if (err) {
        // Handle internal server error (500) if reading the file fails
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      // Respond with a successful status (200) and the user data in JSON format
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else {
    // If the requested URL doesn't match, respond with a Not Found (404) error
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server on port 3000
/*server.listen(3000, () => {
  console.log('Server running on <http://localhost:3000/>');
});*/
