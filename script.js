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
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.innerHTML = `<h2>${title}</h2><p>${data}</p>`;
    return widget;
  }
  
  // Initial dashboard rendering
  async function renderDashboard() {
    const data = await fetchWebsiteData();
    const widgetArea = document.querySelector('.widget-area');
  
    // Add widgets for different metrics
    widgetArea.appendChild(createWidget('Pageviews', data.pageviews));
    widgetArea.appendChild(createWidget('Unique Visitors', data.uniqueVisitors));
    widgetArea.appendChild(createWidget('Sessions', data.sessions));
    widgetArea.appendChild(createWidget('Bounce Rate', data.bounceRate));
  }

  async function fetchWebsiteData() {
    // Import the Google Analytics Reporting API library
    const { analyticsReporting } = await google.auth.getClient({
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
  
    // Define your report configuration
    const report = {
      viewId: '<YOUR_VIEW_ID>', // Replace with your Google Analytics View ID
      dateRanges: [{ startDate: '2024-01-29', endDate: '2024-01-29' }], // Modify date range as needed
      metrics: ['ga:pageviews', 'ga:users', 'ga:sessions', 'ga:bounceRate'], // Select desired metrics
    };
  
    // Send the report request and handle the response
    try {
      const response = await analyticsReporting.data.ga().get({ report });
      const data = response.reports[0].data.rows[0]; // Extract first row of data
      return {
        pageviews: data.values[0],
        uniqueVisitors: data.values[1],
        sessions: data.values[2],
        bounceRate: data.values[3],
      }; // Map response data to desired format
    } catch (error) {
      console.error('Error fetching data:', error);
      return {}; // Return empty data on error
    }
  }
  
  renderDashboard();
  