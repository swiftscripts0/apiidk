const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

// Function to extract the iframe src from HTML content
function extractIframeSrc(html) {
    const iframeMatch = html.match(/<iframe[^>]*src=["']([^"']+)["'][^>]*>/);
    return iframeMatch ? iframeMatch[1] : null;
}

// Movie endpoint
app.get('/movie/:id', async (req, res) => {
    const { id } = req.params;
    const apiUrl = `https://turbovid.eu/api/req/movie/${id}`;

    try {
        // Fetch movie data from the API
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Referer': 'https://stigstream.com',
            }
        });

        // Check if the response is valid
        if (!response.ok) {
            return res.status(500).json({ error: `Failed to fetch data from proxy: ${response.statusText}` });
        }

        // Get HTML response
        const html = await response.text();

        // Extract iframe src URL
        const iframeSrc = extractIframeSrc(html);

        if (!iframeSrc) {
            return res.status(404).json({ error: "Couldn't extract iframe URL from response" });
        }

        // Send iframe src as the response
        res.json({ iframeSrc });

    } catch (error) {
        console.error('Error fetching from proxy:', error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
