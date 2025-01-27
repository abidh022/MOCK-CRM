// Form and fields
let contactForm = document.querySelector("#contactForm");

const contactOwner = document.querySelector("#contactOwner");
const leadSource = document.querySelector("#leadSource");
const firstName = document.querySelector("#firstName");
const lastName = document.querySelector("#lastName");
const accountName = document.querySelector("#accountName");
const title = document.querySelector("#title");
const email = document.querySelector("#email");
const department = document.querySelector("#department");
const mobile = document.querySelector("#mobile");
const phone = document.querySelector("#phone");
const fax = document.querySelector("#fax");
const dob = document.querySelector("#dob");
const assistant = document.querySelector("#assistant");
const asstPhone = document.querySelector("#asstPhone");
const skypeID = document.querySelector("#skypeID");
const twitter = document.querySelector("#twitter");
const secondaryEmail = document.querySelector("#secondaryEmail");

const mailingStreet = document.querySelector("#mailingStreet");
const otherStreet = document.querySelector("#otherStreet");
const mailingCity = document.querySelector("#mailingCity");
const otherCity = document.querySelector("#otherCity");
const mailingState = document.querySelector("#mailingState");
const otherState = document.querySelector("#otherState");
const mailingZip = document.querySelector("#mailingZip");
const otherZip = document.querySelector("#otherZip");
const mailingCountry = document.querySelector("#mailingCountry");
const otherCountry = document.querySelector("#otherCountry");

const description = document.querySelector("#description");
const dateTime = document.querySelector("#dateTime");
const modified = document.querySelector("#modified");

// Handle file input change (photo upload)
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

    // Get the current date and time
    function updateDateTime() {
        var now = new Date();

        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        var day = now.getDate().toString().padStart(2, '0');
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        var seconds = now.getSeconds().toString().padStart(2, '0');

        var dateTimeString = day + '-' + month + '-' + year + '  ' + hours + ':' + minutes + ':' + seconds;
        document.getElementById('dateTime').value = dateTimeString;
    }
    setInterval(updateDateTime, 1000);

    function modifiedDateTime() {
        var now = new Date();

        var year = now.getFullYear();
        var month = (now.getMonth() + 1).toString().padStart(2, '0');
        var day = now.getDate().toString().padStart(2, '0');
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        var seconds = now.getSeconds().toString().padStart(2, '0');

        var dateTimeString = day + '-' + month + '-' + year + '  ' + hours + ':' + minutes + ':' + seconds;
        document.getElementById('modified').value = dateTimeString;
    }
    setInterval(updateDateTime, 1000);

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

// Toast message function
function showToast(message, isSuccess = false) {
    const toast = document.querySelector('.toast');
    toast.textContent = message;

    // Set background color based on success or failure
    toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44949'; // Green for success, Red for failure

    toast.classList.remove('hide');
    toast.style.visibility = 'visible';

    void toast.offsetWidth; // Trigger a reflow for animation
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');

        setTimeout(() => {
            toast.style.visibility = 'hidden';
        }, 200);
    }, 1500);
}

// Back button handler
document.getElementById('btn1').addEventListener('click', function() {
    window.history.back();
});


// Event listener for DOMContentLoaded to load data if editing an existing contact
document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const contactId = params.get('id'); // Get contact ID from URL

    if (contactId) {
        await loadContactData(contactId); // If there is a contact ID, load the data
    }
});

// Function to load contact data for editing
async function loadContactData(contactId) {
    try {
        // Fetch contact data from the server using the contactId
        const response = await fetch(`/contact/getContactById/${contactId}`);
        const contact = await response.json();

        if (contact) {
            // Populate form fields with existing contact data
            firstName.value = contact.firstName || '';
            lastName.value = contact.lastName || '';
            accountName.value = contact.accountName || '';
            title.value = contact.title || '';
            email.value = contact.email || '';
            department.value = contact.department || '';
            mobile.value = contact.mobile || '';
            phone.value = contact.phone || '';
            fax.value = contact.fax || '';
            dob.value = contact.dob || '';
            assistant.value = contact.assistant || '';
            asstPhone.value = contact.asstPhone || '';
            skypeID.value = contact.skypeID || '';
            twitter.value = contact.twitter || '';
            secondaryEmail.value = contact.secondaryEmail || '';
            mailingStreet.value = contact.mailingStreet || '';
            otherStreet.value = contact.otherStreet || '';
            mailingCity.value = contact.mailingCity || '';
            otherCity.value = contact.otherCity || '';
            mailingState.value = contact.mailingState || '';
            otherState.value = contact.otherState || '';
            mailingZip.value = contact.mailingZip || '';
            otherZip.value = contact.otherZip || '';
            mailingCountry.value = contact.mailingCountry || '';
            otherCountry.value = contact.otherCountry || '';
            description.value = contact.description || '';
            dateTime.value = formatCustomDate(contact.dateTime);
            modified.value = formatCustomDate(contact.modified);
        } else {
            showToast('Failed to load contact data');
            console.error('Contact not found');
        }
    } catch (error) {
        showToast('Error occurred while loading contact data');
        console.error('Error:', error);
    }
}

// Event listener for save button (for both create and update)
document.getElementById('save').addEventListener('click', async () => {
    contactForm.requestSubmit(); // Submit the form

    let isValid = true;

    // Validate required fields
    if (!lastName.value) {
        setError(lastName);
        isValid = false;
    } else {
        setSuccess(lastName);
    }

    if (!email.value) {
        setError(email);
        isValid = false;
    } else {
        setSuccess(email);
    }

    // Submit data to the server if valid
    if (isValid) {
        const contactObj = {
            "contactOwner": contactOwner.value,
            "leadSource": leadSource.value,
            "firstName": firstName.value,
            "lastName": lastName.value,
            "accountName": accountName.value,
            "title": title.value,
            "email": email.value,
            "department": department.value,
            "mobile": mobile.value,
            "phone": phone.value,
            "fax": fax.value,
            "dob": dob.value,
            "assistant": assistant.value,
            "asstPhone": asstPhone.value,
            "skypeID": skypeID.value,
            "twitter": twitter.value,
            "secondaryEmail": secondaryEmail.value,
            "mailingStreet": mailingStreet.value,
            "otherStreet": otherStreet.value,
            "mailingCity": mailingCity.value,
            "otherCity": otherCity.value,
            "mailingState": mailingState.value,
            "otherState": otherState.value,
            "mailingZip": mailingZip.value,
            "otherZip": otherZip.value,
            "mailingCountry": mailingCountry.value,
            "otherCountry": otherCountry.value,
            "description": description.value,
            "dateTime": "",
            "modified": new Date().toISOString() 
        };

        const contactId = new URLSearchParams(window.location.search).get('id'); 

        try {
            let response;
            if (contactId) {
                const existingContact = await fetch(`/contact/getContactById/${contactId}`);
                const contactData = await existingContact.json();
                // If we are editing, update the contact using PUT request
                contactObj.dateTime = contactData.dateTime;  // Keep the original dateTime from the existing lead)
                response = await fetch(`/contact/updateContact/${contactId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contactObj),
                });
            } else {
                // If creating a new contact, use POST request
                contactObj.dateTime = new Date().toISOString();  // Set dateTime to the current time for new leads

                response = await fetch('/contact/createContact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(contactObj),
                });
            }

            if (response.ok) {
                const data = await response.json();
                console.log(`Contact ${contactId ? 'updated' : 'created'} with ID: ${data.id}`);
                showToast(`Contact ${contactId ? 'updated' : 'created'} successfully!`, true);

                // After saving, disable the button and redirect after 2 seconds
                document.getElementById('save').disabled = true;
                document.body.classList.add('no-click');
                setTimeout(() => {
                    document.getElementById('save').disabled = false;
                    document.body.classList.remove('no-click');
                    window.location.href = `/html/contacts/contactHome.html`;
                }, 2000);
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

  
document.getElementById('btn2').addEventListener('click',async  () => {
    contactForm.requestSubmit();

    let isValid = true;

    // Validate required fields
    if (!lastName.value) {
        setError(lastName);
        isValid = false;
    } else {
        setSuccess(lastName);
    }

    if (!email.value) {
        setError(email);
        isValid = false;
    } else {
        setSuccess(email);
    }

    // Submit data to the server if valid
    if (isValid) {
        const contactObj = {
            "contactOwner": contactOwner.value,
            "leadSource": leadSource.value,
            "firstName": firstName.value,
            "lastName": lastName.value,
            "accountName": accountName.value,
            "title": title.value,
            "email": email.value,
            "department": department.value,
            "mobile": mobile.value,
            "phone": phone.value,
            "fax": fax.value,
            "dob": dob.value,
            "assistant": assistant.value,
            "asstPhone": asstPhone.value,
            "skypeID": skypeID.value,
            "twitter": twitter.value,
            "secondaryEmail": secondaryEmail.value,
            "mailingStreet": mailingStreet.value,
            "otherStreet": otherStreet.value,
            "mailingCity": mailingCity.value,
            "otherCity": otherCity.value,
            "mailingState": mailingState.value,
            "otherState": otherState.value,
            "mailingZip": mailingZip.value,
            "otherZip": otherZip.value,
            "mailingCountry": mailingCountry.value,
            "otherCountry": otherCountry.value,
            "description": description.value,
            "dateTime": "",
            "modified": new Date().toISOString() 
        };
        // insertLead(contactObj);
        try{    
        contactObj.dateTime = new Date().toISOString();  // Set dateTime to the current time for new leads

        response = await fetch('/contact/createContact', {
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
                    window.location.href = '/html/contacts/createContact.html';
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
    
    if (!email.value || !lastName.value){
        !email.value  ? setError(email) : setSuccess(email);
        !lastName.value ? setError(lastName) : setSuccess(lastName);
    }
});

// Set error message and styling
function setError(tag) {
    tag.nextElementSibling.innerHTML = "Required";
    tag.nextElementSibling.style.color = "red";
    tag.style.border = '1px solid red';
}

// Clear error message and reset styling
function setSuccess(tag) {
    tag.nextElementSibling.innerHTML = "";
    tag.style.border = "1px solid black";
}
