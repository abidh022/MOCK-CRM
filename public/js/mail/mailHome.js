// const { default: axios } = require("axios");
// const e = require("express");

document.getElementById("compose").onclick = function() {
    window.location.href = "../../html/mail/compose.html";
};

document.getElementById("token").onclick = function() {
    const clientId = "1000.Z4UWL3MAKX12X6WX4VGIQF51TPWV1Z";  // Your Zoho client ID
    const redirectUri = "http://localhost:5000/mail";  // Your redirect URI
    const scope = "ZohoMail.messages.CREATE,ZohoMail.folders.ALL,ZohoMail.accounts.READ,ZohoMail.messages.ALL,ZohoMail.partner.organization.ALL,ZohoMail.accounts.READ,ZohoMail.folders.CREATE,ZohoCRM.users.READ,ZohoCRM.modules.ALL,ZohoMeeting.manageOrg.READ,ZohoCRM.org.READ";
    const accessType = "offline";
    const responseType = "code";
  
    const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=${responseType}&access_type=${accessType}&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
  };    

  
 async function ferchFolderId() {
   try{
       const response = await axios.get('/mail/folders');
       console.log('folders',response);
    }catch(error){
        console.error('error',error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const inboxBtn = document.getElementById('inbox');
    if (inboxBtn) {
        inboxBtn.click();
    }
}); 

// Get elements
const folderBtns = document.querySelectorAll('.namebtn');
const tabBar = document.getElementById('tabBar');
const tabsContainer = document.getElementById('tabs');
const tabContentContainer = document.getElementById('tabContentContainer');

let tabCounter = 1; // Track number of tabs
let lastActiveTab = null; // Track the last active tab

// Show tab bar when any folder button is clicked
folderBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tabName = btn.textContent.trim();
        const folderId = btn.getAttribute('data-folder-id'); // Make sure you add the data-folder-id attribute
        createNewTab(tabName, folderId);
    });
});

// Function to create a new tab based on folder name
function createNewTab(tabName, folderId) {
    const tabId = 'tab' + tabCounter;

    // Create the new tab button
    const tab = document.createElement('div');
    tab.classList.add('tab');
    tab.setAttribute('data-tab', tabId);
    tab.textContent = tabName;

    // Create the close button for the tab
    const closeTabBtn = document.createElement('button');
    closeTabBtn.classList.add('close-tab');
    closeTabBtn.textContent = 'X';
    closeTabBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeTab(tabId);
    });

    tab.appendChild(closeTabBtn);

    // Create the new tab content
    const tabContent = document.createElement('div');
    tabContent.classList.add('tab-content');
    tabContent.setAttribute('id', tabId);

    // Make fetchMailList an async function
    async function fetchMailList(folderId) {
        try {
            const response = await axios.get(`/mail/mailList?folderId=${folderId}`);
            console.log("full response", response);

            const emails = response.data.data;
            let emailRowsHTML = '';

            if (emails.length === 0) {
                // If there are no emails, show a "No mails available" message
                emailRowsHTML = `
                    <div class="no-emails">
                        <p>No mails available</p>
                    </div>
                `;
            } else {

            emails.forEach(email => {
                const sender = email.sender;
                const subject = email.subject;
                const status = email.status;
                const isOpen = Number(status) === 1;

                // Time
                const sentDateInGMT = email.receivedTime;
                const sentDate = new Date(Number(sentDateInGMT)); 
                const options = {
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric', 
                    hour: 'numeric',
                    minute: 'numeric', 
                    hour12: true
                };
                const formattedSentDate = sentDate.toLocaleString('en-US', options);
                // console.log("Formatted Sent Date:", formattedSentDate);

              // Create HTML for each email
              emailRowsHTML += `
              <div class="email-row">
                  <input type="checkbox" id="email-checkbox">
                  <span class="icon-container">
                      <!-- Show open icon if email is read (status = 1) -->
                      <i class="fa-regular fa-envelope-open" id="open-icon" style="display: ${isOpen ? 'inline' : 'none'};"></i>
                      <!-- Show closed icon if email is unread (status = 0) -->
                      <i class="fa-regular fa-envelope" id="closed-icon" style="display: ${isOpen ? 'none' : 'inline'};"></i>
                  </span>
                  <p id="mailid">${sender}</p>
                  <p id="subject">${subject}</p>
                  <p id="dateTime">${formattedSentDate}</p>
              </div>
          `;
      });
    }

      // Inject the HTML content
      tabContent.innerHTML = `
        <h2>${tabName}</h2>  
          <p id="year">2024</p>
          <div class="box">
              ${emailRowsHTML}
          </div>
      `;

        } catch (error) {
            console.error('Error', error);  
        }
    }

        // Fetch mails for the folder
        fetchMailList(folderId);

        // Add tab to tab container
        tabsContainer.appendChild(tab);
        tabContentContainer.appendChild(tabContent);

        // Show the tab bar
    tabBar.style.display = 'block';

    // Remove old content and activate the new tab
    removeOldContent();
    setActiveTab(tab, tabContent);
    
        tabCounter++;
    }

// Remove old content before displaying new content
function removeOldContent() {
    const currentActiveContent = tabContentContainer.querySelector('.tab-content.active');
    if (currentActiveContent) {
        currentActiveContent.classList.remove('active');
    }
}

// Set the clicked tab as active
function setActiveTab(tab, tabContent) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    // Add active class to the clicked tab
    tab.classList.add('active');

    // Remove active class from all contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // Display the tab content
    tabContent.classList.add('active');

    // Update the last active tab
    lastActiveTab = tab;
}

// Add event listener to handle clicking on the tab (to show content)
tabsContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('tab')) {
        const tabId = e.target.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        setActiveTab(e.target, tabContent);
    }
});

// Close individual tab and its content
function closeTab(tabId) {
    const tab = document.querySelector(`.tab[data-tab="${tabId}"]`);
    const tabContent = document.getElementById(tabId);

    // Remove the tab and its content
    tab.remove();
    tabContent.remove();

    // After closing the tab, set the last active tab (if any)
    if (tabsContainer.children.length > 0) {
        let nextTabToActivate;

        // If lastActiveTab exists, we activate it
        if (lastActiveTab && lastActiveTab !== tab) {
            nextTabToActivate = lastActiveTab;
        } else {
            // If there was no lastActiveTab or the closed tab was the only one, pick the first tab
            nextTabToActivate = tabsContainer.children[0];
        }

        const nextTabContent = document.getElementById(nextTabToActivate.getAttribute('data-tab'));
        setActiveTab(nextTabToActivate, nextTabContent);

        // Update lastActiveTab to be the new active tab
        lastActiveTab = nextTabToActivate;
    }
}

// document.addEventListener("DOMContentLoaded",ferchFolderId);
