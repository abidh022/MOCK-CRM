    
    document.getElementById('back').addEventListener('click', function() {
        window.history.back();
    });        

        const button1 = document.getElementById('button1');
        const button2 = document.getElementById('button2');
        const indicator = document.getElementById('indicator');
        const overviewContent = document.getElementById('overview');
        const timelineContent = document.getElementById('timeline');

        button1.addEventListener('click', () => {
            indicator.style.left = '0';
            overviewContent.style.display = 'block';  // Show Overview content
            timelineContent.style.display = 'none';  // Hide Timeline content
        });

        button2.addEventListener('click', () => {
            indicator.style.left = '50%';
            overviewContent.style.display = 'none';  // Hide Overview content
            timelineContent.style.display = 'block';  // Show Timeline content
        });

       // Ensure that the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('edit');

    // Check if the editButton and leadId element exist
    if (editButton) {
        editButton.addEventListener('click', () => {
            const leadId = document.getElementById('leadId'); // Get the lead ID input element

            if (leadId) { // Check if leadId exists
                const id = leadId.value; // Get the value of the leadId
                fetch(`/api/leads/${id}`)
                    .then(response => response.json())
                    .then(lead => {
                        localStorage.setItem('leadData', JSON.stringify(lead)); // Save to localStorage
                        window.location.href = '/html/leads/createLead.html';
                    })
                    .catch(error => console.error('Error fetching lead:', error));
            } else {
                console.error('Lead ID input element not found!');
            }
        });
    } else {
        console.error('Edit button not found!');
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
                    // When left container is hidden, make right container full width
                    rightContainer.style.width = '100%';
                } else {
                    // When left container is visible, make right container 80% width
                    rightContainer.style.width = '80%';
                }
            });

// Fetch a specific lead based on the ID in the URL
async function fetchLeadData(leadId) {
    try {
        const response = await fetch(`/api/leads/${leadId}`); // Fetch lead data from the server using the leadId
        if (!response.ok) throw new Error('Lead not found');
        return await response.json(); // Return the JSON data of the lead
    } catch (error) {
        console.error('Error fetching lead data:', error);
        document.getElementById('leadName').textContent = 'Lead not found';
    }
}

// Render lead profile data on the page
async function renderLeadProfile() {
    const params = new URLSearchParams(window.location.search);
    const leadId = params.get('id'); // Get the leadId from the URL

    if (leadId) {
        const lead = await fetchLeadData(leadId); // Fetch the lead data using the ID

        if (lead) {
            // Check if the element exists before setting the textContent
            const leadNameElement = document.getElementById('leadName');
            const leadName = document.getElementById('leadN');
            const emailElement = document.getElementById('email');
            const phoneElement = document.getElementById('mobile');
            const statusElement = document.getElementById('status');
            const leadStatusElement = document.getElementById('leadStatus');
            const companyElement = document.getElementById('company');
            const streetElement = document.getElementById('street');
            const cityElement = document.getElementById('city');
            const stateElement = document.getElementById('state');
            const countryElement = document.getElementById('country');
            const zipCodeElement = document.getElementById('zipCode');
            const descriptionElement = document.getElementById('description');
            
            // Safely update the elements
            if (leadNameElement) leadNameElement.textContent = `${lead.firstName} ${lead.lastName}`;
            if (leadName) leadName.textContent = `${lead.firstName} ${lead.lastName}`;
            if (emailElement) emailElement.textContent = lead.email || 'N/A';
            if (phoneElement) phoneElement.textContent = lead.mobile || 'N/A';
            if (statusElement) statusElement.textContent = lead.status || 'N/A';
            if (leadStatusElement) leadStatusElement.textContent = lead.leadStatus || 'N/A';
            if (companyElement) companyElement.textContent = lead.company || 'N/A';
            if (streetElement) streetElement.textContent = lead.street || 'N/A';
            if (cityElement) cityElement.textContent = lead.city || 'N/A';
            if (stateElement) stateElement.textContent = lead.state || 'N/A';
            if (countryElement) countryElement.textContent = lead.country || 'N/A';
            if (zipCodeElement) zipCodeElement.textContent = lead.zipCode || 'N/A';
            if (descriptionElement) descriptionElement.textContent = lead.description || 'N/A';
        } else {
            console.error('Lead data not found');
        }
    }
}

// document.addEventListener('DOMContentLoaded', () => {
//     const deleteButton = document.getElementById('delete');
//     deleteButton.addEventListener('click', deleteLead);
// });

// leadProfile.js

async function deleteLead() {
    // Extract lead ID from the URL query string
    const leadId = new URLSearchParams(window.location.search).get('id');
    
    // Check if the leadId exists
    if (!leadId) {
        alert("Lead ID is missing.");
        return;
    }

    // Show confirmation dialog before proceeding with deletion
    const isConfirmed = window.confirm("Are you sure you want to delete this lead? This action cannot be undone.");

    if (!isConfirmed) {
        alert("Deletion cancelled.");
        return; // If the user clicks "Cancel", stop the deletion process
    }

    try {
        // Send the DELETE request to the server
        const response = await fetch(`/api/leads/${leadId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Lead deleted successfully!');
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

// Ensure that the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', renderLeadProfile);

// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', renderLeadProfile);

