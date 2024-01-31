const express = require('express');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const port = 3999;

async function fetchGoogleAnalyticsData() {
  // Initialize the GoogleAuth client
  const auth = new GoogleAuth();
  const client = await auth.getClient({
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  // Initialize the Google Analytics Reporting API
  const analyticsReporting = google.analyticsreporting({
    version: 'v4',
    auth: client,
  });

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

  // Send the report request and handle the response
  try {
    const response = await analyticsReporting.reports.batchGet({ requestBody: report });
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
  try {
    const analyticsData = await fetchGoogleAnalyticsData();
    res.json(analyticsData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
