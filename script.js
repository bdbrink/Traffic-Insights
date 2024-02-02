async function fetchGoogleAnalyticsData() {
    try {
      const response = await fetch('/analytics-data'); // Fetch data from server-side endpoint
      const analyticsData = await response.json();
      return analyticsData;
    } catch (error) {
      console.error("Error fetching Google Analytics data:", error);
      throw error; // Rethrow to handle errors in renderDashboard()
    }
  }
  
  function createWidget(title, data) {
    const widget = document.createElement("div");
    widget.classList.add("widget");
    widget.innerHTML = `<h2>${title}</h2><p>${data}</p>`;
    return widget;
  }
  
  async function renderDashboard() {
    const widgetArea = document.querySelector(".widget-area");
  
    try {
      const analyticsData = await fetchGoogleAnalyticsData();
  
      // Add widgets for Google Analytics data
      widgetArea.appendChild(createWidget("GA Pageviews", analyticsData.pageviews));
      widgetArea.appendChild(createWidget("GA Unique Visitors", analyticsData.uniqueVisitors));
      widgetArea.appendChild(createWidget("GA Sessions", analyticsData.sessions));
      widgetArea.appendChild(createWidget("GA Bounce Rate", analyticsData.bounceRate));
    } catch (error) {
      console.error("Error rendering Google Analytics data:", error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  }
  
  renderDashboard();