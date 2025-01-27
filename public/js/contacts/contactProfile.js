    
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
            const contactId = new URLSearchParams(window.location.search).get('id'); // Get the lead ID from URL
        
            if (contactId) {
                window.location.href = `/html/contacts/createContact.html?id=${contactId}`;
            } else {
                alert("contact ID is missing.");
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
async function fetchLeadData(contactId) {
    try {
        const response = await fetch(`/contact/data/${contactId}`,{ method : 'GET' }); // fetch data
        if (!response.ok) throw new Error('contact not found');
        const data = response;        
        console.log(data);
        return await response.json() // Return the lead data
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
    const contactId = params.get('id');

    if (contactId) {
        const contact = await fetchLeadData(contactId);

        if (contact) {
            console.log(contact);
            // Update the profile data on the page
            document.getElementById('contactNameHeader').textContent = `${contact.firstName} ${contact.lastName}`;
            document.getElementById('contactName').textContent = `${contact.firstName} ${contact.lastName}`;
            document.getElementById('accountName').textContent = contact.accountName || 'N/A';
            document.getElementById('email').textContent = contact.email || 'N/A';
            document.getElementById('dob').textContent = contact.dob || 'N/A';
            document.getElementById('mobile').textContent = contact.mobile || 'N/A';
            document.getElementById('phone').textContent = contact.phone || 'N/A';
            document.getElementById('fax').textContent = contact.fax || 'N/A';
            document.getElementById('title').textContent = contact.title || 'N/A';
            document.getElementById('department').textContent = contact.department || 'N/A';
            document.getElementById('leadSource').textContent = contact.leadSource || 'N/A';
            document.getElementById('skypeID').textContent = contact.skypeID || 'N/A';
            document.getElementById('twitter').textContent = contact.twitter || 'N/A';
            document.getElementById('secondaryEmail').textContent = contact.secondaryEmail || 'N/A';
            document.getElementById('description').textContent = contact.description || 'N/A';
            // Address Information
            document.getElementById('mailingStreet').textContent = contact.mailingStreet || 'N/A';
            document.getElementById('mailingCity').textContent = contact.mailingCity || 'N/A';
            document.getElementById('mailingState').textContent = contact.mailingState || 'N/A';
            document.getElementById('mailingCountry').textContent = contact.mailingCountry || 'N/A';
            document.getElementById('mailingZip').textContent = contact.mailingZip || 'N/A';

            document.getElementById('otherStreet').textContent = contact.otherStreet || 'N/A';
            document.getElementById('otherCity').textContent = contact.otherCity || 'N/A';
            document.getElementById('otherState').textContent = contact.otherState || 'N/A';
            document.getElementById('otherCountry').textContent = contact.otherCountry || 'N/A';
            document.getElementById('otherZip').textContent = contact.otherZip || 'N/A';
             // Format and display created time and modified time
            //  document.getElementById('dateTime').textContent = formatCustomDate(contact.dateTime);
            //  document.getElementById('modified').textContent = formatCustomDate(contact.modified);

            document.getElementById('dateTime').textContent = formatCustomDate(contact.dateTime);

            const modificationHistory = contact.modifications || [];
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
            // console.log(contact.modifications);
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


async function deleteLead() {
    const contactId = new URLSearchParams(window.location.search).get('id');
    if (!contactId) {
        alert("Contact ID is missing.");
        return;
    }
    const isConfirmed = window.confirm("Are you sure you want to delete this Contact? This action cannot be undone.");
    if (!isConfirmed) {
        alert("Deletion cancelled.");
        return;
    }

    try {
        const response = await fetch(`/contact/deleteContact/${contactId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Sucessfully deleted")
            window.location.href = '/html/contacts/contactHome.html';  // Redirect to home page after deletion
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
document.getElementById('delete').addEventListener('click',deleteLead);

// Event listener to detect the 'Delete' key press
document.addEventListener('keydown' , function(event) {
    if (event.key === 'Delete') {
        document.getElementById('delete').click();  // Trigger the button's click event
    }
});



document.addEventListener('DOMContentLoaded', renderLeadProfile);