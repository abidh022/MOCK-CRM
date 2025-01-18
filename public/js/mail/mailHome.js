document.getElementById("compose").onclick = function() {
    window.location.href = "../../html/mail/compose.html";
};

document.getElementById("token").onclick = function() {
    const clientId = "1000.Z4UWL3MAKX12X6WX4VGIQF51TPWV1Z";  
    const redirectUri = "http://localhost:5000/mail"; 
    const scope = "ZohoMail.messages.READ,ZohoMail.messages.CREATE,ZohoMail.folders.ALL,ZohoMail.accounts.READ,ZohoMail.messages.ALL,ZohoMail.partner.organization.ALL,ZohoMail.accounts.READ,ZohoMail.folders.CREATE,ZohoCRM.users.READ,ZohoCRM.modules.ALL,ZohoMeeting.manageOrg.READ,ZohoCRM.org.READ";
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
                const fromAddress = email.fromAddress;
                const subject = email.subject;
                const status = email.status;
                const messageId = email.messageId;
                const folderId = email.folderId; 
                // const accountId = email.accountId;
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
              <div class="email-row" data-message-id="${messageId}" data-folder-id="${folderId}">
                  <input type="checkbox">
                  <span class="icon-container">
                      <!-- Show open icon if email is read (status = 1) -->
                      <i class="fa-regular fa-envelope-open" id="open-icon" style="display: ${isOpen ? 'inline' : 'none'};"></i>
                      <!-- Show closed icon if email is unread (status = 0) -->
                      <i class="fa-regular fa-envelope" id="closed-icon" style="display: ${isOpen ? 'none' : 'inline'};"></i>
                  </span>
                  <p id="mailid">${fromAddress}</p>
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

        document.getElementById('tabContentContainer').addEventListener('click', function(e) {
            if (e.target.closest('.email-row')) { 
                const row = e.target.closest('.email-row');
                console.log('Email row clicked:', row);
        
                const subject = row.querySelector('#subject').textContent;
                const sender = row.querySelector('#mailid').textContent;
                const dateTime = row.querySelector('#dateTime').textContent;
                const messageId = row.dataset.messageId;
                const folderId = row.dataset.folderId;
                
                const emailContentOpen = document.getElementById('emailcontentopen');
                emailContentOpen.classList.add('open');
                emailContentOpen.style.display = 'block';
        
                document.getElementById('subject-details').textContent = "Subject: " + subject;
                document.querySelector('.sender-email').textContent = sender;
                document.querySelector('.date').textContent = dateTime;
                console.log('Fetching email with messageId:', messageId, 'and folderId:', folderId);

                // Use axios to fetch the email content
                        axios.get(`/mail/getDetailedMail?messageId=${messageId}&folderId=${folderId}`)
                        .then(response => {
                            console.log("Fetched email :", response.data);
                            console.log("Fetched email content:", response.data.data.content);
                            // Display the email content (assuming 'content' contains the email body)
                            // document.getElementById('messagecontent').textContent = response.data.data.content || "No content available";
                            let emailContent = response.data.data.content || "No content available";
                            // Convert the email content from HTML to plain text
                            emailContent = htmlToPlainText(emailContent);
                            // Display the plain text email content
                            document.getElementById('messagecontent').textContent = emailContent;

                             // Add delete button functionality
                             document.getElementById('deleteMailBtn').addEventListener('click', function() {
                                deleteMail(messageId, folderId, row);
                            });

                        })
                        
                        .catch(error => {
                            console.error('Error fetching email content:', error);
                            alert('Failed to fetch email content');
                        });
                }
                // Function to convert HTML to plain text
                function htmlToPlainText(html) {
                    // Create a temporary DOM element to convert HTML to plain text
                    let doc = new DOMParser().parseFromString(html, 'text/html');
                    
                    // Handle bold text
                    let boldElements = doc.querySelectorAll('b, strong');
                    boldElements.forEach(element => {
                        element.replaceWith('*' + element.textContent + '*'); // Use markdown-style bold (asterisks)
                    });
                    
                    // Convert unordered lists to bullet points
                    let ulElements = doc.querySelectorAll('ul');
                    ulElements.forEach(ul => {
                        let listItems = ul.querySelectorAll('li');
                        let listText = Array.from(listItems).map(item => `• ${item.textContent}`).join('\n');
                        ul.replaceWith(listText); // Replace <ul> with bullet-pointed text
                    });
                    
                    // Convert ordered lists to numbered points
                    let olElements = doc.querySelectorAll('ol');
                    olElements.forEach(ol => {
                        let listItems = ol.querySelectorAll('li');
                        let listText = Array.from(listItems).map((item, index) => `${index + 1}. ${item.textContent}`).join('\n');
                        ol.replaceWith(listText); // Replace <ol> with numbered list
                    });
                    
                    // Convert <br /> to a new line
                    let brElements = doc.querySelectorAll('br');
                    brElements.forEach(br => {
                        br.replaceWith('\n'); // Replace <br /> with new line
                    });
                    
                    // Convert paragraphs to plain text
                    let paragraphs = doc.querySelectorAll('p');
                    paragraphs.forEach(p => {
                        p.replaceWith(p.textContent + '\n');
                    });
                    
                    // Convert the final HTML to plain text (ignoring any other tags)
                    return doc.body.textContent.trim();
                }
            });

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

// Optionally, you can close the email content view when the close button is clicked
document.querySelector('.close-btn').addEventListener('click', function() {
    const emailContentOpen = document.getElementById('emailcontentopen');
    emailContentOpen.classList.remove('open');  // Remove the 'open' class to hide the div
    emailContentOpen.style.display = 'none';  // Hide the email content div
});


// Function to delete email
function deleteMail(messageId, folderId, row) {
    axios.delete(`/mail/deleteMail?messageId=${messageId}&folderId=${folderId}`)
        .then(response => {
            console.log("Email deleted:", response.data);
            row.remove();  // Remove the email row from the UI
            alert('Email deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting email:', error);
            alert('Failed to delete email');
        });
}