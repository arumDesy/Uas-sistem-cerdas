const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from multiple directories
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Serve HTML files
app.use(express.static(path.join(__dirname, 'html')));

// Root route - serve index.html from html folder
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Page Not Found</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container {
          text-align: center;
        }
        h1 {
          font-size: 6rem;
          margin: 0;
        }
        p {
          font-size: 1.5rem;
        }
        a {
          color: white;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>404</h1>
        <p>Page Not Found</p>
        <a href="/">← Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 AI Makeup Recommender Server running on port ${PORT}`);
    console.log(`📱 Visit: http://localhost:${PORT}`);
});
