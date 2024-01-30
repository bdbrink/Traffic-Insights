const { GoogleAuth } = require('google-auth-library');

// Initial placeholder data
const websiteData = {
  pageviews: 1000,
  uniqueVisitors: 500,
  sessions: 200,
  bounceRate: 40,
};

function fetchWebsiteData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(websiteData);
    }, 1000);
  });
}

// Function to create a widget element
function createWidget(title, data) {
  const widget = document.createElement("div");
  widget.classList.add("widget");
  widget.innerHTML = `<h2>${title}</h2><p>${data}</p>`;
  return widget;
}

// Initial dashboard rendering
async function renderDashboard() {
  const data = await fetchWebsiteData();
  const widgetArea = document.querySelector(".widget-area");

  // Add widgets for different metrics
  widgetArea.appendChild(createWidget("Pageviews", data.pageviews));
  widgetArea.appendChild(createWidget("Unique Visitors", data.uniqueVisitors));
  widgetArea.appendChild(createWidget("Sessions", data.sessions));
  widgetArea.appendChild(createWidget("Bounce Rate", data.bounceRate));

  // Fetch and render Google Analytics data
  try {
    const analyticsData = await fetchGoogleAnalyticsData();
    widgetArea.appendChild(createWidget("GA Pageviews", analyticsData.pageviews));
    widgetArea.appendChild(createWidget("GA Unique Visitors", analyticsData.uniqueVisitors));
    widgetArea.appendChild(createWidget("GA Sessions", analyticsData.sessions));
    widgetArea.appendChild(createWidget("GA Bounce Rate", analyticsData.bounceRate));
  } catch (error) {
    console.error("Error fetching Google Analytics data:", error);
  }
}

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

renderDashboard();
