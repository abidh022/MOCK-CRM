    
    document.getElementById('back').addEventListener('click', function() {
        window.history.back();
    });        

    document.getElementById('sendEmail').addEventListener('click', function(){
        window.location.href = 'mailto:example@example.com?subject=Your Subject&body=Your message here';
    })

    document.getElementById('convert').addEventListener('click', function(){
            window.location.href= '/html/leads/convert.html';
    }) 

        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        const indicator = document.getElementById('indicator');
        const overviewContent = document.getElementById('overview');
        const timelineContent = document.getElementById('timeline');

        button1.addEventListener('click', () => {
            indicator.style.left = '0';
            overviewContent.style.display = 'block'; 
            timelineContent.style.display = 'none';  
        });

        button2.addEventListener('click', () => {
            indicator.style.left = '50%';
            overviewContent.style.display = 'none';  
            timelineContent.style.display = 'block'; 
        });

        document.getElementById('edit').addEventListener('click', async () => {
            const leadId = new URLSearchParams(window.location.search).get('id'); // Get the lead ID from URL
        
            if (leadId) {
                window.location.href = `/html/leads/createLead.html?id=${leadId}`;
            } else {
                alert("Lead ID is missing.");
            }
        });

            const toggleButton = document.getElementById('toggleButton');
            const leftContainer = document.getElementById('leftContainer');
            const rightContainer = document.getElementById('rightContainer');
            const mainContainer = document.getElementById('mainContainer');

            // Toggle function to hide/show left container and resize the right container
            toggleButton.addEventListener('click', () => {
                leftContainer.classList.toggle('hidden');
                if (leftContainer.classList.contains('hidden')) {
                    rightContainer.style.width = '100%';
                } else {
                    rightContainer.style.width = '80%';
                }
            });

// Fetch a specific lead based on the ID in the URL
async function fetchLeadData(leadId) {
    try {
        const response = await fetch(`/api/leads/${leadId}`);
        if (!response.ok) throw new Error('Lead not found');
        return await response.json(); // Return the lead data
    } catch (error) {
        console.error('Error fetching lead data:', error);
        document.getElementById('leadName').textContent = 'Lead not found';
    }
}
// Function to format an ISO string into a custom format
function formatCustomDate(dateString) {
    const date = new Date(dateString);
    
    if (isNaN(date)) {
        return 'Invalid Date';  // If the date is invalid
    }
    
    // Custom format: "DD-MM-YYYY HH:mm:ss"
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

// Render the lead profile after the page loads or after an update
async function renderLeadProfile() {
    const params = new URLSearchParams(window.location.search);
    const leadId = params.get('id');

    if (leadId) {
        const lead = await fetchLeadData(leadId);

        if (lead) {
            // Update the profile data on the page
            document.getElementById('leadName').textContent = `${lead.firstName} ${lead.lastName}`;
            document.getElementById('leadN').textContent = `${lead.firstName} ${lead.lastName}`;
            document.getElementById('company').textContent = lead.company || 'N/A';
            document.getElementById('email').textContent = lead.email || 'N/A';
            document.getElementById('mobile').textContent = lead.mobile || 'N/A';
            document.getElementById('fax').textContent = lead.fax || 'N/A';
            document.getElementById('leadStatus').textContent = lead.leadStatus || 'N/A';
            document.getElementById('website').textContent = lead.website || 'N/A';
            document.getElementById('leadSource').textContent = lead.leadSource || 'N/A';
            document.getElementById('annualRevenue').textContent = lead.annualRevenue || 'N/A';
            document.getElementById('industry').textContent = lead.industry || 'N/A';
            document.getElementById('employees').textContent = lead.employees || 'N/A';
            document.getElementById('skypeID').textContent = lead.skypeID || 'N/A';
            document.getElementById('twitter').textContent = lead.twitter || 'N/A';
            document.getElementById('secondaryEmail').textContent = lead.secondaryEmail || 'N/A';
            document.getElementById('street').textContent = lead.street || 'N/A';
            document.getElementById('city').textContent = lead.city || 'N/A';
            document.getElementById('state').textContent = lead.state || 'N/A';
            document.getElementById('country').textContent = lead.country || 'N/A';
            document.getElementById('zipCode').textContent = lead.zipCode || 'N/A';
            document.getElementById('description').textContent = lead.description || 'N/A';
             // Format and display created time and modified time
            //  document.getElementById('dateTime').textContent = formatCustomDate(lead.dateTime);
            //  document.getElementById('modified').textContent = formatCustomDate(lead.modified);

            document.getElementById('dateTime').textContent = formatCustomDate(lead.dateTime);

            const modificationHistory = lead.modifications || [];
            const modificationList = document.getElementById('modification-history');
            modificationList.innerHTML = '';  // Clear existing entries

            // Loop through modifications and create timeline items
            modificationHistory.forEach(modTime => {
                const modItem = document.createElement('li');
                modItem.classList.add('timeline-item');
                modItem.innerHTML = `
                    <i class="fa-solid fa-pencil timeline-icon"></i>
                    <span>Last modified on: ${formatCustomDate(modTime)}</span>
                `;
                modificationList.appendChild(modItem);
            });

            // Show the modification history if any
            const modifiedField = document.getElementById('modified');
            if (modificationHistory.length > 0) {
                modifiedField.style.display = 'block';
            } else {
                modifiedField.style.display = 'none';
            }
        }
    }   
}


// leadProfile.js
async function deleteLead() {
    const leadId = new URLSearchParams(window.location.search).get('id');
    
    // Check if the leadId exists
    if (!leadId) {
        alert("Lead ID is missing.");
        return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete this lead? This action cannot be undone.");

    if (!isConfirmed) {
        alert("Deletion cancelled.");
        return;
    }

    try {
        // Send the DELETE request to the server
        const response = await fetch(`/api/leads/${leadId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            window.location.href = '/html/leads/leadshome.html';  // Redirect to home page after deletion
        } else {
            const errorData = await response.json();
            console.error('Delete failed:', errorData);
            alert(`Error: ${errorData.error || 'Failed to delete lead'}`);
        }
    } catch (error) {
        console.error('Error deleting lead:', error);
        alert('An error occurred while deleting the lead.');
    }
}
// Event listener to detect the 'Delete' key press
document.addEventListener('keydown' , function(event) {
    if (event.key === 'Delete') {
        document.getElementById('delete').click();  // Trigger the button's click event
    }
});



document.addEventListener('DOMContentLoaded', renderLeadProfile);