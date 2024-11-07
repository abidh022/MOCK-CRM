//createlead/js

let leadForm=document.querySelector("#leadForm");

const leadOwner = document.querySelector("#leadOwner");
const company = document.querySelector("#company");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const title = document.querySelector("#title");
const email = document.querySelector("#email");
const fax = document.querySelector("#fax");
const mobile = document.querySelector("#mobile");
const website = document.querySelector("#website");
const leadSource = document.querySelector("#leadSource");
const leadStatus = document.querySelector("#leadStatus");
const industry = document.querySelector("#industry");
const employees = document.querySelector("#employees");
const annualRevenue = document.querySelector("#annualRevenue");
const skypeID = document.querySelector("#skypeID");
const twitter = document.querySelector("#twitter");
const secondaryEmail = document.querySelector("#secondaryEmail");
const street = document.querySelector("#street");
const city = document.querySelector("#city");
const state = document.querySelector("#state");
const country = document.querySelector("#country");
const zipCode = document.querySelector("#zipCode");
const description = document.querySelector("#description");

//photo upload
document.querySelector('#fileInput input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('uploadedImage');
            const icon = document.getElementById('personIcon');
            img.src = e.target.result;
            img.style.display = 'block'; // Show the image
            icon.style.display = 'none'; // Hide the person icon
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('btn1').addEventListener('click', function() {
    window.history.back();
});

function showToast(message) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;

    toast.classList.remove('hide'); 
    toast.style.visibility = 'visible'; 

    void toast.offsetWidth;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show'); 
        toast.classList.add('hide');

        setTimeout(() => {
            toast.style.visibility = 'hidden'; 
        }, 200); 
    }, 2000); 
}


document.getElementById('save').addEventListener('click',async  () => {
    leadForm.requestSubmit();

    let isValid = true;

    // Validate required fields
    if (!company.value) {
        setError(company);
        isValid = false;
    } else {
        setSuccess(company);
    }

    if (!lastName.value) {
        setError(lastName);
        isValid = false;
    } else {
        setSuccess(lastName);
    }

    async function insertLead(leads) {
        const result = await leadsCollection.insertOne(leads);
        console.log('Lead inserted with ID:', result);
    }

    if (isValid) {
    const leadObj = {
        "leadOwner" : leadOwner.value,
        "company" : company.value,
        "firstName" : firstName.value,
        "lastName" : lastName.value,
        "title" : title.value,
        "email" :email.value,
        "fax" : fax.value,
        "mobile" : mobile.value,
        "website" : website.value,
        "leadSource" : leadSource.value,
        "leadStatus" : leadStatus.value,
        "industry" :industry.value,
        "employees" : employees.value,
        "annualRevenue" :annualRevenue.value,
        "skypeID" : skypeID.value,
        "twitter" : twitter.value,
        "secondaryEmail" : secondaryEmail.value,
        "street" : street.value,
        "city" : city.value,
        "state" :state.value,
        "country" : country.value,
        "zipCode" :zipCode.value,
        "description" :description.value
    }; 
    insertLead(leadObj);

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadObj),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Lead saved with ID: ${data.id}`);
            showToast('Lead created successfully!');
            window.location.href = '/html/leads/leadProfile.html';
            } else {
                showToast('Failed to save lead.');
            console.error('Failed to save lead');
        }
    } catch (error) {
        showToast('Error occurred while saving lead.');
        console.error('Error:', error);
    }
}

});


document.getElementById('btn2').addEventListener('click',async  () => {
    leadForm.requestSubmit();

    let isValid = true;

    // Validate required fields
    if (!company.value) {
        setError(company);
        isValid = false;
    } else {
        setSuccess(company);
    }

    if (!lastName.value) {
        setError(lastName);
        isValid = false;
    } else {
        setSuccess(lastName);
    }

    async function insertLead(leads) {
        const result = await leadsCollection.insertOne(leads);
        console.log('Lead inserted with ID:', result);
    }

    if (isValid) {
    const leadObj = {
        "leadOwner" : leadOwner.value,
        "company" : company.value,
        "firstName" : firstName.value,
        "lastName" : lastName.value,
        "title" : title.value,
        "email" :email.value,
        "fax" : fax.value,
        "mobile" : mobile.value,
        "website" : website.value,
        "leadSource" : leadSource.value,
        "leadStatus" : leadStatus.value,
        "industry" :industry.value,
        "employees" : employees.value,
        "annualRevenue" :annualRevenue.value,
        "skypeID" : skypeID.value,
        "twitter" : twitter.value,
        "secondaryEmail" : secondaryEmail.value,
        "street" : street.value,
        "city" : city.value,
        "state" :state.value,
        "country" : country.value,
        "zipCode" :zipCode.value,
        "description" :description.value
    }; 
    insertLead(leadObj);

    try {
        const response = await fetch('/api/leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadObj),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`Lead saved with ID: ${data.id}`);
            showToast('Lead created successfully!');
            window.location.href = '/html/leads/createLead.html';
            } else {
                showToast('Failed to save lead.');  
            console.error('Failed to save lead');
        }
    } catch (error) {
        showToast('Error occurred while saving lead.');
        console.error('Error:', error);
    }
}

});

leadForm.addEventListener("submit",(e)=> {
    e.preventDefault();  
    
    if (!company.value || !lastName.value){
        !company.value  ? setError(company) : setSuccess(company);
        !lastName.value ? setError(lastName) : setSuccess(lastName);
    }
})

function setError(tag){
        tag.nextElementSibling.innerHTML="Required";
        tag.nextElementSibling.style.color="1px solid red";
        tag.style.border='1px solid red';
    }

    function setSuccess(tag){
        tag.nextElementSibling.innerHTML="";
        tag.style.border="1px solid black";

}

document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('editBtn');
    
    // Ensure that both the edit button and the leadId input exist
    const leadIdElement = document.getElementById('leadId');
    if (leadIdElement) {
        const leadId = leadIdElement.value; // Retrieve the lead ID from the hidden input
        
        // If the edit button exists, add event listener
        if (editButton) {
            editButton.addEventListener('click', () => {
                fetch(`/api/leads/${leadId}`) // Fetch lead data by ID
                    .then(response => response.json())
                    .then(lead => {
                        // Store lead data in localStorage for use on the createLead page
                        localStorage.setItem('leadData', JSON.stringify(lead));
                        window.location.href = '/createLead.html'; // Redirect to createLead.html
                    })
                    .catch(error => console.error('Error fetching lead:', error));
            });
        } else {
            console.error('Edit button not found!');
        }
    } else {
        console.error('Lead ID input element not found!');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const lead = JSON.parse(localStorage.getItem('leadData'));

    if (lead) {
        // Populate the fields with lead data
        document.getElementById('firstName').value = lead.firstName;
        document.getElementById('lastName').value = lead.lastName;
        // Add other form field populations as needed
    }

    // Optionally clear the localStorage data after loading
    localStorage.removeItem('leadData');
});


    // document.getElementById('leadForm').addEventListener('submit', async (event) => {
    //     event.preventDefault();
    //     const leadData = {
    //         firstName: document.getElementById('firstName').value,
    //         lastName: document.getElementById('lastName').value,
    //         // other fields
    //     };
    //     const leadId = new URLSearchParams(window.location.search).get('id');
    //     const response = await fetch(`/api/leads/${leadId}`, {
    //         method: 'PUT',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(leadData)
    //     });
    //     if (response.ok) {
    //         alert('Lead updated!');
    //         window.location.href = `/leadProfile.html?id=${leadId}`;
    //     } else {
    //         alert('Error updating lead');
    //     }
    // });