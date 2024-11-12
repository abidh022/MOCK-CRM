//createcontact/js

let contactForm=document.querySelector("#contactForm");

const contactOwner = document.querySelector("#contactOwner");
const company = document.querySelector("#company");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const title = document.querySelector("#title");
const email = document.querySelector("#email");
const fax = document.querySelector("#fax");
const mobile = document.querySelector("#mobile");
const website = document.querySelector("#website");
const contactsource = document.querySelector("#contactsource");
const contactstatus = document.querySelector("#contactstatus");
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

function showToast(message, isSuccess = false) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;

    // Set background color based on success or failure
    toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44949'; // Green for success, Red for failure

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
    }, 1500);
}


document.getElementById('save').addEventListener('click',async  () => {
    contactForm.requestSubmit();

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

    async function insertcontact(contacts) {
        const result = await contactsCollection.insertOne(contacts);
        console.log('contact inserted with ID:', result);
    }

    if (isValid) {
    const contactObj = {
        "contactOwner" : contactOwner.value,
        "company" : company.value,
        "firstName" : firstName.value,
        "lastName" : lastName.value,
        "title" : title.value,
        "email" :email.value,
        "fax" : fax.value,
        "mobile" : mobile.value,
        "website" : website.value,
        "contactsource" : contactsource.value,
        "contactstatus" : contactstatus.value,
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
    insertcontact(contactObj);

    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactObj),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`contact saved with ID: ${data.id}`);
            showToast('contact created successfully!', true); 
            save.disabled =true;
            document.body.classList.add('no-click');
            setTimeout(() => {
                save.disabled = false;
                document.body.classList.remove('no-click');
                window.location.href = '/html/contacts/contactshome.html';
            }, 2000);
        } else {
            showToast('Failed to save contact.');
            console.error('Failed to save contact');
        }
        
    } catch (error) {
        showToast('Error occurred while saving contact.');
        console.error(' Error:', error);
    }
}



});



document.getElementById('btn2').addEventListener('click',async  () => {
    contactForm.requestSubmit();

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

    async function insertcontact(contacts) {
        const result = await contactsCollection.insertOne(contacts);
        console.log('contact inserted with ID:', result);
    }

    if (isValid) {
    const contactObj = {
        "contactOwner" : contactOwner.value,
        "company" : company.value,
        "firstName" : firstName.value,
        "lastName" : lastName.value,
        "title" : title.value,
        "email" :email.value,
        "fax" : fax.value,
        "mobile" : mobile.value,
        "website" : website.value,
        "contactsource" : contactsource.value,
        "contactstatus" : contactstatus.value,
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
    insertcontact(contactObj);

    try {
        const response = await fetch('/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(contactObj),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`contact saved with ID: ${data.id}`);
            showToast('contact created successfully!', true);
            setTimeout(() => {
                window.location.href = '/html/contacts/createcontact.html';
            }, 1500);
            } else {
                showToast('Failed to save contact.');  
            console.error('Failed to save contact');
        }
    } catch (error) {
        showToast('Error occurred while saving contact.');
        console.error('Error:', error);
    }
}

});

contactForm.addEventListener("submit",(e)=> {
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
    
    // Ensure that both the edit button and the contactId input exist
    const contactIdElement = document.getElementById('contactId');
    if (contactIdElement) {
        const contactId = contactIdElement.value; // Retrieve the contact ID from the hidden input
        
        // If the edit button exists, add event listener
        if (editButton) {
            editButton.addEventListener('click', () => {
                fetch(`/api/contacts/${contactId}`) // Fetch contact data by ID
                    .then(response => response.json())
                    .then(contact => {
                        // Store contact data in localStorage for use on the createcontact page
                        localStorage.setItem('contactData', JSON.stringify(contact));
                        window.location.href = '/createcontact.html'; // Redirect to createcontact.html
                    })
                    .catch(error => console.error('Error fetching contact:', error));
            });
        } else {
            console.error('Edit button not found!');
        }
    } else {
        console.error('contact ID input element not found!');
    }
});


document.addEventListener('DOMContentLoaded', function () {
    const contact = JSON.parse(localStorage.getItem('contactData'));

    if (contact) {
        // Populate the fields with contact data
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        // Add other form field populations as needed
    }

    // Optionally clear the localStorage data after loading
    localStorage.removeItem('contactData');
});


    // document.getElementById('contactForm').addEventListener('submit', async (event) => {
    //     event.preventDefault();
    //     const contactData = {
    //         firstName: document.getElementById('firstName').value,
    //         lastName: document.getElementById('lastName').value,
    //         // other fields
    //     };
    //     const contactId = new URLSearchParams(window.location.search).get('id');
    //     const response = await fetch(`/api/contacts/${contactId}`, {
    //         method: 'PUT',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(contactData)
    //     });
    //     if (response.ok) {
    //         alert('contact updated!');
    //         window.location.href = `/contactProfile.html?id=${contactId}`;
    //     } else {
    //         alert('Error updating contact');
    //     }
    // });