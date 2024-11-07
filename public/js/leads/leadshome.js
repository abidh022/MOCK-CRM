document.querySelector('#createButton')?.addEventListener('click', () => {
    window.location.href = '/html/leads/createLead.html';
});

let leads = []; // Store the fetched leads

const records = [
    "Touched Records",
    "Untouched Records",
    "Record Action",
    "Related Records Action",
    "Locked",
    "Email Sentiment",
    "Latest Email Status",
    "Activities",
    "Notes",
    "Campaigns",
    "Annual Revenue",
    "City",
    "Company",
    "Converted Account",
    "Converted Contact",
    "Converted Deal",
    "Country",
    "Created By",
    "Created Time",
    "Email",
    "Email Opt Out",
    "Fax",
    "First Name",
    "Industry",
    "Last Activity Time",
    "Last Name",
    "Lead Conversion Time",
    "Lead Name",
    "Lead Owner",
    "Lead Source",
    "Lead Status",
    "Mobile",
    "Modified By",
    "Modified Time",
    "No. of Employees",
    "Phone",
    "Rating",
    "Salutation",
    "Secondary Email",
    "Skype ID",
    "State",
    "Street",
    "Tag",
    "Title",
    "Twitter",
    "Unsubscribed Mode",
    "Unsubscribed Time",
    "Website",
    "Zip Code"
];

// Function to render records in the left container
function renderRecords() {
    const recordList = document.getElementById('recordList');
    records.forEach(record => {
        const item = document.createElement('div');
        item.classList.add('record-item');
        item.innerHTML = `
            <input type="checkbox">
            <span>${record}</span>
        `;
        recordList.appendChild(item);
    });
}

// Function to filter records based on search input
function filterRecords() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const recordItems = document.querySelectorAll('.record-item');

    recordItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchInput) ? 'flex' : 'none';
    });
}


//leadshome
async function fetchLeads() {
    try {
        const response = await fetch('/api/leads'); 
        if (!response.ok) throw new Error('Failed to fetch leads');
        return await response.json();
    } catch (error) {
        console.error('Error fetching leads:', error);
        return [];
    }
}

async function renderLeads() {
    const dataContainer = document.getElementById('dataContainer');
    const totalRecordsElement = document.getElementById('totalRecords');
    const leads = await fetchLeads();
    console.log('Fetched Leads:', leads); // Log the fetched leads for debugging

    // Update total records count
    totalRecordsElement.textContent = `Total Records: ${leads.length}`;

    leads.reverse();

    dataContainer.innerHTML = '';

    if (leads.length > 0) {
        leads.forEach(lead => {
            const row = document.createElement('div');
            row.classList.add('data-row');
            row.setAttribute('data-id', lead._id);
            row.innerHTML = `
                <input type="checkbox" class="lead-checkbox">
                <span>${lead.firstName} ${lead.lastName}</span>
                <span>${lead.company}</span>
                <span>${lead.email}</span>
                <span>${lead.mobile || 'N/A'}</span>
                <span>${lead.leadSource || 'N/A'}</span>
            `;
            //  row.addEventListener('click', () => {
            //     const leadId = row.getAttribute('data-id');
            //     window.location.href = `leadProfile.html?id=${leadId}`; // Redirect to leadProfile with the lead ID in the URL
            // });

            dataContainer.appendChild(row);
        });
    } else {
        dataContainer.innerHTML = '<p>No leads found.</p>'; // Message if no leads
    }
}

// Function to toggle select all checkboxes
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.lead-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
}
document.addEventListener('DOMContentLoaded', renderLeads);


// Add event listener for clicking on a lead row
document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.addEventListener('click', (event) => {
        if (event.target.closest('.data-row')) {
            const leadId = event.target.closest('.data-row').getAttribute('data-id');
            window.location.href = `leadProfile.html?id=${leadId}`; // Redirect to the profile page with the lead ID in the URL
        }
    });

// Initial render
// renderLeads();
renderRecords();

});

