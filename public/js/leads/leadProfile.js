    
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
            overviewContent.style.display = 'block'; 
            timelineContent.style.display = 'none';  
        });

        button2.addEventListener('click', () => {
            indicator.style.left = '50%';
            overviewContent.style.display = 'none';  
            timelineContent.style.display = 'block'; 
        });

document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.getElementById('edit');

    if (editButton) {
        editButton.addEventListener('click', () => {
            const leadId = document.getElementById('leadId'); 

            if (leadId) { 
                const id = leadId.value;
                fetch(`/api/leads/${id}`)
                    .then(response => response.json())
                    .then(lead => {
                        localStorage.setItem('leadData', JSON.stringify(lead));
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
        return await response.json(); 
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
            const companyElement = document.getElementById('company');
            const emailElement = document.getElementById('email');
            const phoneElement = document.getElementById('mobile');
            const faxElement = document.getElementById('fax');
            const leadStatusElement = document.getElementById('leadStatus');
            const websiteElement = document.getElementById('website');
            const leadSourceElement = document.getElementById('leadSource');
            const annualRevenueElement = document.getElementById('annualRevenue');
            const industryElement = document.getElementById('industry');
            const employeesElement = document.getElementById('employees');
            const skypeIDElement = document.getElementById('skypeID');
            const twitterElement = document.getElementById('twitter');
            const secondaryEmailElement = document.getElementById('secondaryEmail');
            const streetElement = document.getElementById('street');
            const cityElement = document.getElementById('city');
            const stateElement = document.getElementById('state');
            const countryElement = document.getElementById('country');
            const zipCodeElement = document.getElementById('zipCode');
            const descriptionElement = document.getElementById('description');
            
            leadName.textContent = (leadNameElement) ? `${lead.firstName} ${lead.lastName}` : `N/A` ;
            // Safely update the elements
            if (leadNameElement) leadNameElement.textContent = `${lead.firstName} ${lead.lastName}`;
            if (leadName) leadName.textContent = `${lead.firstName} ${lead.lastName}`;
            if (companyElement) companyElement.textContent = lead.company || 'N/A';
            if (emailElement) emailElement.textContent = lead.email || 'N/A';
            if (phoneElement) phoneElement.textContent = lead.mobile || 'N/A';
            if (faxElement) faxElement.textContent = lead.fax || 'N/A';
            if (leadStatusElement) leadStatusElement.textContent = lead.leadStatus || 'N/A';
            if (websiteElement) websiteElement.textContent = lead.website || 'N/A';
            if (leadSourceElement) leadSourceElement.textContent = lead.leadSource || 'N/A';
            if (annualRevenueElement) annualRevenueElement.textContent = lead.annualRevenue || 'N/A';
            if (industryElement) industryElement.textContent = lead.industry || 'N/A';
            if (employeesElement) employeesElement.textContent = lead.employees || 'N/A';
            if (skypeIDElement) skypeIDElement.textContent = lead.skypeID || 'N/A';
            if (twitterElement) twitterElement.textContent = lead.twitter || 'N/A';
            if (secondaryEmailElement) secondaryEmailElement.textContent = lead.secondaryEmail || 'N/A';
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

// console.log(leadSource);

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
document.addEventListener('keydown', function(event) {
    if (event.key === 'Delete') {
        document.getElementById('delete').click();  // Trigger the button's click event
    }
});

document.addEventListener('DOMContentLoaded', renderLeadProfile);