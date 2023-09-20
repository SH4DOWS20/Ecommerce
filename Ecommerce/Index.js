// Import the 'http' module to create an HTTP server.
const http = require('http');

// Define a function to handle incoming requests.
const handleRequest = (req, res) => {
  // Check if the request method is 'GET' and the URL is the root ('/').
  if (req.method === 'GET' && req.url === '/') {
    // If it is a valid request, respond with a '200 OK' status and a plain text message.
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to Ecommerce');
  } else {
    // If the request is for a different URL or method, respond with a '404 Not Found' status.
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

// Define the port number. Use the value from the environment variable 'PORT', or default to 3001.
const PORT = process.env.PORT || 3000;

// Create an HTTP server and pass the request handling function to it.
const server = http.createServer(handleRequest);

// Start the server on the specified port and log a message to the console.
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Add an error event listener to handle server-related errors.
server.on('error', (err) => {
  console.error('Server error:', err);
});
