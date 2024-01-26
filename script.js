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
  
  renderDashboard();
  