const express = require('express');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const port = 3999;

async function fetchGoogleAnalyticsData() {
  console.log('--- Starting Google Analytics data fetch ---');

  // Initialize the GoogleAuth client
  try {
    const auth = new GoogleAuth();
    const client = await auth.getClient({
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });
    console.log('Client successfully initialized:', client.projectId);
  } catch (error) {
    console.error('Error initializing GoogleAuth client:', error);
    throw error;
  }

  // Initialize the Google Analytics Reporting API
  try {
    const analyticsReporting = google.analyticsreporting({
      version: 'v4',
      auth: client,
    });
    console.log('Analytics Reporting API client initialized');
  } catch (error) {
    console.error('Error initializing Analytics Reporting API:', error);
    throw error;
  }

  // Define your report configuration
  const report = {
    reportRequests: [
      {
        viewId: "<YOUR_VIEW_ID>", // Replace with your Google Analytics View ID
        dateRanges: [{ startDate: "2024-01-29", endDate: "2024-01-29" }], // Modify date range as needed
        metrics: [
          { expression: "ga:pageviews" },
          { expression: "ga:users" },
          { expression: "ga:sessions" },
          { expression: "ga:bounceRate" },
        ], // Select desired metrics
      },
    ],
  };

  console.log('Report configuration:', report);

  // Send the report request and handle the response
  try {
    const response = await analyticsReporting.reports.batchGet({ requestBody: report });
    console.log('Analytics Reporting API response received:', response.statusText);
    const data = response.data.reports[0].data.rows[0]; // Extract first row of data

    return {
      pageviews: data.metrics[0].values[0],
      uniqueVisitors: data.metrics[1].values[0],
      sessions: data.metrics[2].values[0],
      bounceRate: data.metrics[3].values[0],
    }; // Map response data to desired format
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
    throw error;
  }
}

app.get('/analytics-data', async (req, res) => {
  console.log('Received request for analytics data at:', new Date());
  try {
    const analyticsData = await fetchGoogleAnalyticsData();
    console.log('Successfully retrieved analytics data:', analyticsData);
    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
