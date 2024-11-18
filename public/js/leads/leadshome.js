document.querySelector('#createButton')?.addEventListener('click', () => {
    window.location.href = '/html/leads/createLead.html';
});

let leads = []; 

const records = [
    "Touched Records","Untouched Records","Record Action","Related Records Action","Locked","Email Sentiment","Latest Email Status","Activities","Notes","Campaigns","Annual Revenue","City","Company","Converted Account","Converted Contact","Converted Deal","Country","Created By","Created Time","Email","Email Opt Out","Fax","First Name","Industry","Last Activity Time","Last Name","Lead Conversion Time","Lead Name","Lead Owner","Lead Source","Lead Status","Mobile","Modified By","Modified Time","No. of Employees","Phone","Rating","Salutation","Secondary Email","Skype ID","State","Street","Tag","Title","Twitter","Unsubscribed Mode","Unsubscribed Time","Website","Zip Code"
];

// Function to render records in the left container
function renderRecords() {
    const recordList = document.getElementById('recordList');
    records.forEach(record => {
        const item = document.createElement('div');
        item.classList.add('record-item');
        item.innerHTML = 
            `<input type="checkbox">
            <span>${record}</span>`;
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

// Function to fetch leads
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

// Function to render the leads in the right container
async function renderLeads() {
    const dataContainer = document.getElementById('dataContainer');
    const totalRecordsElement = document.getElementById('totalRecords');
    leads = await fetchLeads();
    console.log('Fetched Leads:', leads);

    // Update total records count
    totalRecordsElement.textContent = `Total Records: ${leads.length}`;

    leads.reverse();


    dataContainer.innerHTML = ''; // Clear the existing data container

    if (leads.length > 0) {
        leads.forEach(lead => {
            const row = document.createElement('div');
            row.classList.add('data-row');
            row.setAttribute('data-id', lead._id);
            row.innerHTML = 
                `<input type="checkbox" class="lead-checkbox">
                <span class="lead-name">${lead.firstName} ${lead.lastName}</span>
                <span class="lead-company">${lead.company}</span>
                <span class="lead-email">${lead.email}</span>
                <span class="lead-mobile">${lead.mobile || 'N/A'}</span>
                <span class="lead-source">${lead.leadSource || 'N/A'}</span>`;
            dataContainer.appendChild(row);
        });
    } else {
        dataContainer.innerHTML = '<img src="/assets/No-data-cuate.png" alt="No Leads Available">'; 
   }
}

// Function to update the "Total Records Selected" and show action buttons
function updateTotalRecordsSelected() {
    const selectedCheckboxes = document.querySelectorAll('.lead-checkbox:checked');
    const totalSelected = selectedCheckboxes.length;
    const totalRecordsElement = document.getElementById('totalRecords');
    const actionButtons = document.getElementById('action-buttons');
    const actionSelectBox = document.getElementById('actionbtn');
    const recBox = document.getElementById('recBox');
    const allActionButtons = recBox.querySelectorAll('button, select'); // All buttons and selects inside recBox
    const actionBtns = recBox.querySelectorAll('#action-buttons button'); // The specific action buttons

    // If any records are selected, show the action buttons and hide the rest
    if (totalSelected > 0) {
        // Update the total selected count
        totalRecordsElement.textContent = `Total Records Selected: ${totalSelected}`;

        // Hide all buttons and selects in recBox
        allActionButtons.forEach(btn => btn.style.display = 'none');

        // Show the action buttons (6 specific buttons)
        actionBtns.forEach(btn => btn.style.display = 'inline-block');  // or 'flex', depending on layout
        actionButtons.style.display = 'flex'; // Ensure action buttons are visible
        
        // Hide the original action select box (dropdown)
        actionSelectBox.style.display = 'none';
    } else {
        // If no records are selected, show the total records available
        totalRecordsElement.textContent = `Total Records: ${leads.length}`;

        // Show the original action select box and hide the action buttons
        actionSelectBox.style.display = 'block';
        actionButtons.style.display = 'none';

        // Show all other buttons (filters, select box, etc.)
        allActionButtons.forEach(btn => btn.style.display = 'inline-block');
    }
}

// Event listener to handle changes to the 'select all' checkbox
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('selectAll').addEventListener('change', toggleSelectAll);
    document.getElementById('dataContainer').addEventListener('change', (event) => {
        if (event.target.classList.contains('lead-checkbox')) {
            updateSelectAllState();
        }
    });
});

// Update selected count on checkbox change within data container
document.getElementById('dataContainer').addEventListener('change', (event) => {
    if (event.target.classList.contains('lead-checkbox')) {
        updateTotalRecordsSelected();
    }
});

// Function to toggle select all checkboxes
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.lead-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    updateTotalRecordsSelected();  // Update the selected records count
}

// Function to update the 'select all' checkbox state based on individual checkboxes
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.lead-checkbox');
    const totalCheckboxes = checkboxes.length;
    const selectedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;

    selectAllCheckbox.checked = selectedCheckboxes === totalCheckboxes;
    selectAllCheckbox.indeterminate = selectedCheckboxes > 0 && selectedCheckboxes < totalCheckboxes;
    
    updateTotalRecordsSelected();  // Update the selected records count
}

// Initial render of total records count
document.addEventListener('DOMContentLoaded', () => {
    updateTotalRecordsSelected(); // Call on page load to display the correct total
    renderLeads(); // Render the leads after the page is loaded
    renderRecords(); // Render the record filters on page load
});

// Add event listener for clicking on a lead row
document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.addEventListener('click', (event) => {
        if (event.target.closest('.lead-name') || event.target.closest('.lead-company') ||event.target.closest('.lead-email') ||event.target.closest('.lead-mobile') ||event.target.closest('.lead-source')) {
            const leadId = event.target.closest('.data-row').getAttribute('data-id');
            window.location.href = `leadProfile.html?id=${leadId}`; 
        }
        const checkboxes = document.querySelectorAll('.data-row input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent checkbox click from triggering row click
            });
        });
    });
});

async function deleteSelectedLeads() {
    const checkboxes = document.querySelectorAll('.lead-checkbox:checked');
    const leadIds = Array.from(checkboxes).map(checkbox => checkbox.closest('.data-row').getAttribute('data-id'));

    if (leadIds.length === 0) {
        alert("No leads selected for deletion.");
        return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to delete ${leadIds.length} lead(s)? This action cannot be undone.`);

    if (!isConfirmed) {
        alert("Deletion cancelled.");
        return;
    }

    try {
        // Send DELETE requests for each selected lead
        const deletePromises = leadIds.map(leadId => 
            fetch(`/api/leads/${leadId}`, { method: 'DELETE' })
        );
        
        const responses = await Promise.all(deletePromises);
        const allSuccessful = responses.every(response => response.ok);

        if (allSuccessful) {
            window.location.reload();  // Refresh the page to show updated leads
        } else {
            alert("Some leads could not be deleted. Please check the console for details.");
            responses.forEach(async (response, index) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Delete failed for lead ID ${leadIds[index]}:`, errorData);
                }
            });
        }
    } catch (error) {
        console.error('Error deleting leads:', error);
        alert('An error occurred while deleting leads.');
    }
}
// Attach the delete function to the button
document.getElementById('deleteSelected').addEventListener('click', deleteSelectedLeads);

// Function to clear all selections
function clearSelection() {
    const checkboxes = document.querySelectorAll('.lead-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck each checkbox
    });
    updateSelectAllState(); // Update the select all checkbox state
    updateTotalRecordsSelected(); // Update the total records display
}
document.getElementById('clearSelection').addEventListener('click', clearSelection);

document.getElementById('sendEmail').addEventListener('click', function(){
    window.location.href = 'mailto:example@example.com?subject=Your Subject&body=Your message here';
})