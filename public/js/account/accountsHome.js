document.querySelector('#createButton')?.addEventListener('click', () => {
    window.location.href = '/html/accounts/createAccount.html';
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
    try{
        const response = await fetch('/api/contacts');
        if (!response.ok) throw new Error('Failed to fetch Contacts');
        return await response.json();
    }catch (error) {
        console.log('Error fetching contacts:',error);
        return [];
        
    }
}

async function renderContacts() {
    const dataContainer = document.getElementById('dataContainer');
    const totalRecordsElement = document.getElementById('totalRecords');
    const contacts = await fetchContacts();
    console.log('Fetched Contacts:',contacts);

    totalRecordsElement.textContent =  `Total Records: ${contacts.lenght}`;
    
    contacts.reverse();

    if (contacts.length > 0){
        contacts.forEach(contact => {
            const row = document.createElement('div');
            row.classList.add('data-row');
            row.setAttribute('data-id',contact._id);
            row.innerHTML = `
                <input type = "checkbox" class = "contact-checkbox">
                <span class="contact-name">${contact.fisrtName} ${contact.lastName}</span>
                <span class= "account-name">${contact.account}</span>
                <span class= "contact-email">${contact.email}</span>
                <span class="contact-mobile">${contact.mobile || 'N/A'}</span>
                <span class="lead-source">${lead.leadSource || 'N/A'}</span>
            `;
            dataContainer.appendChild(row);
        });
    }else{
        dataContainer.innerHTML = '<P> No contacts found.</p>';
    }
}