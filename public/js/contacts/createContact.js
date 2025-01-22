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

// Save button handler (Submit the form)
document.getElementById('save').addEventListener('click', async () => {
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

    // Submit data to server if valid
    if (isValid) {
        const contactObj = {
            contactOwner: contactOwner.value,
            leadSource: leadSource.value,
            firstName: firstName.value,
            lastName: lastName.value,
            accountName: accountName.value,
            title: title.value,
            email: email.value,
            department: department.value,
            mobile: mobile.value,
            phone: phone.value,
            fax: fax.value,
            dob: dob.value,
            assistant: assistant.value,
            asstPhone: asstPhone.value,
            skypeID: skypeID.value,
            twitter: twitter.value,
            secondaryEmail: secondaryEmail.value,
            mailingStreet: mailingStreet.value,
            otherStreet: otherStreet.value,
            mailingCity: mailingCity.value,
            otherCity: otherCity.value,
            mailingState: mailingState.value,
            otherState: otherState.value,
            mailingZip: mailingZip.value,
            otherZip: otherZip.value,
            mailingCountry: mailingCountry.value,
            otherCountry: otherCountry.value,
            description: description.value
        };

        try {
            const response = await fetch('/contact/createContact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(contactObj),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Contact saved with ID: ${data.id}`);
                showToast('Contact created successfully!', true);

                // After saving, disable the button and redirect after 2 seconds
                document.getElementById('save').disabled = true;
                document.body.classList.add('no-click');
                setTimeout(() => {
                    document.getElementById('save').disabled = false;
                    document.body.classList.remove('no-click');
                    window.location.href = '/html/contacts/contactHome.html';
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

// Prevent form submission if validation fails
contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!lastName.value) {
        !firstName.value ? setError(firstName) : setSuccess(firstName);
        !lastName.value ? setError(lastName) : setSuccess(lastName);
    }
});

// Handling the edit button functionality if present
document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('editBtn');
    const contactIdElement = document.getElementById('contactId');

    if (contactIdElement && editButton) {
        const contactId = contactIdElement.value;

        editButton.addEventListener('click', () => {
            fetch(`/api/contacts/${contactId}`)
                .then(response => response.json())
                .then(contact => {
                    localStorage.setItem('contactData', JSON.stringify(contact));
                    window.location.href = '/createContact.html';
                })
                .catch(error => console.error('Error fetching contact:', error));
        });
    }
});

// Fill the form fields with the contact data from localStorage (for editing purposes)
document.addEventListener('DOMContentLoaded', function () {
    const contact = JSON.parse(localStorage.getItem('contactData'));

    if (contact) {
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('accountName').value = contact.accountName;
        document.getElementById('title').value = contact.title;
        document.getElementById('email').value = contact.email;
        document.getElementById('department').value = contact.department;
        document.getElementById('mobile').value = contact.mobile;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('fax').value = contact.fax;
        document.getElementById('dob').value = contact.dob;
        document.getElementById('assistant').value = contact.assistant;
        document.getElementById('asstPhone').value = contact.asstPhone;
        document.getElementById('skypeID').value = contact.skypeID;
        document.getElementById('twitter').value = contact.twitter;
        document.getElementById('secondaryEmail').value = contact.secondaryEmail;

        document.getElementById('mailingStreet').value = contact.mailingStreet;
        document.getElementById('otherStreet').value = contact.otherStreet;
        document.getElementById('mailingCity').value = contact.mailingCity;
        document.getElementById('otherCity').value = contact.otherCity;
        document.getElementById('mailingState').value = contact.mailingState;
        document.getElementById('otherState').value = contact.otherState;
        document.getElementById('mailingZip').value = contact.mailingZip;
        document.getElementById('otherZip').value = contact.otherZip;
        document.getElementById('mailingCountry').value = contact.mailingCountry;
        document.getElementById('otherCountry').value = contact.otherCountry;
        document.getElementById('description').value = contact.description;
    }

    localStorage.removeItem('contactData');
});
