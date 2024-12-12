class CustomSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }); 
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        #sidebar {
          width: 90px;
          height: 100vh;
          background-color: #1C2A40;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: fixed;
          left: 0;
        }

        .sidebar-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10px;
          width: 72%;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .sidebar-item:hover {
          background-color: #34495E;
        }

        .sidebar-item i {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .sidebar-item span {
          display: block;
          padding: 8px 16px;
          background-color: #34495E;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .sidebar-item:hover span {
          background-color: #3498db;
        }

        .active {
          border-left: 5px solid #3498db;
          background-color: #34495E;
        }
      </style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <div id="sidebar">
        <div class="sidebar-item" id="home" data-url="/html/meeting/meetingHome.html">
          <i class="fa-solid fa-house-chimney"></i>   
          Home
        </div>
        <div class="sidebar-item" id="meetings" data-url="/html/meeting/myMeeting.html">
          <i class="fas fa-calendar-check"></i>
          Meetings
        </div>
        <div class="sidebar-item" id="webinars" data-url="/html/meeting/webinars.html">
          <i class="fas fa-video"></i>
          Webinars
        </div>
        <div class="sidebar-item" id="calendar" data-url="/html/meeting/calendar.html">
          <i class="fas fa-calendar-alt"></i>
          Calendar
        </div>
        <div class="sidebar-item" id="rooms" data-url="/html/meeting/rooms.html">
          <i class="fas fa-door-open"></i>
          Rooms
        </div>
        <div class="sidebar-item" id="files" data-url="/html/meeting/files.html">
          <i class="fas fa-file-alt"></i>
          Files
        </div>
        <div class="sidebar-item"  id="more" style="cursor: not-allowed;">
          <i class="fas fa-ellipsis-h"></i>
          More
        </div>
      </div>
    `;

    // Add event listeners after rendering
    this.addEventListeners();

    // Automatically highlight the active page on load
    this.setActivePage();
  }

  addEventListeners() {
    const sidebarItems = this.shadowRoot.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
      if (item.id === 'more') return;
      const url = item.getAttribute('data-url');
      item.addEventListener('click', () => {
        window.location.replace(url);
      });
    });
  }

  setActivePage() {
    const currentPath = window.location.pathname;
    const sidebarItems = this.shadowRoot.querySelectorAll('.sidebar-item');
    
    // Remove the active class from all items
    sidebarItems.forEach(item => {
      item.classList.remove('active');
    });

    if (
      currentPath.includes('past.html') || 
      currentPath.includes('personalroom.html')
    ) {
      const meetingsItem = this.shadowRoot.querySelector('#meetings');
      if (meetingsItem) {
        meetingsItem.classList.add('active');
      }
    }

    sidebarItems.forEach(item => {
      const itemLink = item.getAttribute('data-url');
      if (itemLink === currentPath) {
        item.classList.add('active');
      }
    });
  }
}

customElements.define('custom-sidebar', CustomSidebar);
