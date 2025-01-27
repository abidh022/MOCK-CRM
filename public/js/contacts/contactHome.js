document.querySelector('#createButton')?.addEventListener('click', () => {
    window.location.href = '/html/contacts/createContact.html';
});

let contacts = []; 


const records = [
    "Touched Records","Untouched Records","Record Action","Related Records Action","Locked","Email Sentiment","Latest Email Status","Activities","Notes","Campaigns","Annual Revenue","City","Company","Converted Account","Converted Contact","Converted Deal","Country","Created By","Created Time","Email","Email Opt Out","Fax","First Name","Industry","Last Activity Time","Last Name","Lead Conversion Time","Lead Name","Lead Owner","Lead Source","Lead Status","Mobile","Modified By","Modified Time","No. of Employees","Phone","Rating","Salutation","Secondary Email","Skype ID","State","Street","Tag","Title","Twitter","Unsubscribed Mode","Unsubscribed Time","Website","Zip Code"
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
renderRecords();

async function fetchContacts() {
    try {
        const response = await fetch("/contact/getAllContacts", {
            method: "GET",
            headers: { 
                "Content-Type": "application/json" 
            }
        });
        if (!response.ok) throw new Error(`${response?.status} ${response?.statusText}`);
        return await response?.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

document.querySelector('#sorting').addEventListener('change', async (event) => {
    const sortValue = event.target.value;
    contacts = await sortContacts(sortValue);
    renderContacts(); 
});

// For sort options
async function sortContacts(sortValue) {
    let sortedContacts = await fetchContacts();  

    switch (sortValue) {
        case 'date created asc':
            sortedContacts.sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
            break;
        case 'date created desc':
            sortedContacts.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
            break;
        case 'A-Z':
            sortedContacts.sort((a, b) => a.firstName.localeCompare(b.firstName));
            break;
        case 'Z-A':
            sortedContacts.sort((a, b) => b.firstName.localeCompare(a.firstName));
            break;
        case 'email asc':
            sortedContacts.sort((a, b) => a.email.localeCompare(b.email));
            break;
        case 'email desc':
            sortedContacts.sort((a, b) => b.email.localeCompare(a.email));
            break;
        default:
            break;
    }
    return sortedContacts; 
}


async function renderContacts() {
    const dataContainer = document.getElementById('dataContainer');
    const totalRecordsElement = document.getElementById('totalRecords');
    
    totalRecordsElement.textContent = `Total Records: ${contacts.length}`;
    
    dataContainer.innerHTML = ''; 
    
    if (contacts.length > 0) {
        contacts.reverse();
        contacts.forEach(contact => {
            const row = document.createElement('div');
            row.classList.add('data-row');
            row.setAttribute('data-id', contact._id);
            row.innerHTML = 
                `<input type="checkbox" class="contact-checkbox">
                <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
                <span class="contact-email">${contact.accountName}</span>
                <span class="contact-email">${contact.email}</span>
                <span class="contact-phone">${contact.phone || 'N/A'}</span>
                <span class="contact-company">${contact.contactOwner || 'N/A'}</span>`;
            dataContainer.appendChild(row);
            console.log(contact);
            
        });
    } else {
        dataContainer.innerHTML = '<img src="/assets/No-data-cuate.png" alt="No Contacts Available">'; 
    }
}

function updateTotalRecordsSelected() {
    const selectedCheckboxes = document.querySelectorAll('.contact-checkbox:checked');
    const totalSelected = selectedCheckboxes.length;
    const totalRecordsElement = document.getElementById('totalRecords');
    const actionButtons = document.getElementById('action-buttons');
    const actionSelectBox = document.getElementById('actionbtn');
    const recBox = document.getElementById('recBox');
    const allActionButtons = recBox.querySelectorAll('button, select'); 
    const actionBtns = recBox.querySelectorAll('#action-buttons button');

    // If any records are selected, show the action buttons and hide the rest
    if (totalSelected > 0) {
        totalRecordsElement.textContent = `Total Records Selected: ${totalSelected}`;
        allActionButtons.forEach(btn => btn.style.display = 'none');
        // Show 6 buttons
        actionBtns.forEach(btn => btn.style.display = 'inline-block');  
        actionButtons.style.display = 'flex';
        
        actionSelectBox.style.display = 'none';
    } else {
        totalRecordsElement.textContent = `Total Records: ${contacts.length}`;
        actionSelectBox.style.display = 'block';
        actionButtons.style.display = 'none';
        allActionButtons.forEach(btn => btn.style.display = 'inline-block');
    }
}

// Event listener to handle changes to the 'select all' checkbox
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('selectAll').addEventListener('change', toggleSelectAll);
    document.getElementById('dataContainer').addEventListener('change', (event) => {
        if (event.target.classList.contains('contact-checkbox')) {
            updateSelectAllState();
        }
    });
});

// Function to toggle select all checkboxes
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.contact-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    updateTotalRecordsSelected(); 
}

// Function to update the 'select all' checkbox state based on individual checkboxes
function updateSelectAllState() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.contact-checkbox');
    const totalCheckboxes = checkboxes.length;
    const selectedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;

    selectAllCheckbox.checked = selectedCheckboxes === totalCheckboxes;
    selectAllCheckbox.indeterminate = selectedCheckboxes > 0 && selectedCheckboxes < totalCheckboxes;
    
    updateTotalRecordsSelected(); 
}


//delete
async function deleteSelectedContacts() {
    const checkboxes = document.querySelectorAll('.contact-checkbox:checked');
    const contactIds = Array.from(checkboxes).map(checkbox => checkbox.closest('.data-row').getAttribute('data-id'));

    if (contactIds.length === 0) {
        alert("No contacts selected for deletion.");
        return;
    }

    const isConfirmed = window.confirm(`Are you sure you want to delete ${contactIds.length} contact(s)? This action cannot be undone.`);

    if (!isConfirmed) {
        alert("Deletion cancelled.");
        return;
    }

    try {
        const deletePromises = contactIds.map(contactId => 
            fetch(`/contact/deleteContact/${contactId}`, { method: 'DELETE' })
        );
        
        const responses = await Promise.all(deletePromises);
        const allSuccessful = responses.every(response => response.ok);

        if (allSuccessful) {
            window.location.reload();  // Refresh the page to show updated contacts
        } else {
            alert("Some contacts could not be deleted. Please check the console for details.");
            responses.forEach(async (response, index) => {
                if (!response.ok) {
                    const errorData = await response.json().catch(err => response.text());
                    console.error(`Delete failed for contact ID ${contactIds[index]}:`, errorData);
                }
            });
        }
    } catch (error) {
        console.error('Error deleting contacts:', error);
        alert('An error occurred while deleting contacts.');
    }
}
document.getElementById('deleteSelected').addEventListener('click', deleteSelectedContacts);


// Function to clear all selections
function clearSelection() {
    const checkboxes = document.querySelectorAll('.contact-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false; // Uncheck each checkbox
    });
    updateSelectAllState(); // Update the select all checkbox state
    updateTotalRecordsSelected(); // Update the total records display
}
document.getElementById('clearSelection').addEventListener('click', clearSelection);


document.addEventListener('DOMContentLoaded', () => {
    const dataContainer = document.getElementById('dataContainer');
    dataContainer.addEventListener('click', (event) => {
        if (event.target.closest('.contact-name') || event.target.closest('.contact-company') ||event.target.closest('.contact-email') ||event.target.closest('.contact-phone')) {
            const contactId = event.target.closest('.data-row').getAttribute('data-id');
            window.location.href = `contactProfile.html?id=${contactId}`; 
        }
        const checkboxes = document.querySelectorAll('.data-row input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent checkbox click from triggering row click
            });
        });
    });
});

//Searchhh
document.querySelector('#search').addEventListener('input', async (event) => {
    const searchTerm = event.target.value.toLowerCase();
    contacts = await searchContacts(searchTerm);
    renderContacts();
});

// Function to search contacts based on the search term in real-time
async function searchContacts(searchTerm) {
    let filteredContacts = await fetchContacts();  

    if (searchTerm.trim() !== "") {
        filteredContacts = filteredContacts.filter(contact => {
            return (
                (contact.firstName && contact.firstName.toLowerCase().includes(searchTerm)) ||
                (contact.lastName && contact.lastName.toLowerCase().includes(searchTerm)) ||
                (contact.accountName && contact.accountName.toLowerCase().includes(searchTerm)) ||
                (contact.phone && contact.phone.toLowerCase().includes(searchTerm)) ||
                (contact.email && contact.email.toLowerCase().includes(searchTerm))
            );
        });
    }

    return filteredContacts;
}


document.addEventListener('DOMContentLoaded', async() => {
    updateTotalRecordsSelected(); 
    contacts = await fetchContacts();
    renderContacts(); 
    renderRecords(); 
});

