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
    const dateTime = document.querySelector("#dateTime");
    const modified = document.querySelector("#modified");

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

    //back btn
    document.getElementById('btn1').addEventListener('click', function() {
        window.history.back();
    });

    function showToast(message, isSuccess = false) {
        const toast = document.querySelector('.toast');
        toast.textContent = message;
        toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44949';
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

    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const leadId = params.get('id'); 

        if (leadId) {
            await loadLeadData(leadId); 
        }
    });

    async function loadLeadData(leadId) {
        try {
            // Fetch the lead data from the server
            const response = await fetch(`/api/leads/${leadId}`);
            const lead = await response.json();

            if (lead) {
                // Populate the form fields with the lead data
                firstName.value = lead.firstName || '';
                lastName.value = lead.lastName || '';
                title.value = lead.title || '';
                company.value = lead.company || '';
                email.value = lead.email || '';
                fax.value = lead.fax || '';
                mobile.value = lead.mobile || '';
                website.value = lead.website || '';
                leadSource.value = lead.leadSource || '';
                leadStatus.value = lead.leadStatus || '';
                industry.value = lead.industry || '';
                employees.value = lead.employees || '';
                annualRevenue.value = lead.annualRevenue || '';
                skypeID.value = lead.skypeID || '';
                twitter.value = lead.twitter || '';
                secondaryEmail.value = lead.secondaryEmail || '';
                street.value = lead.street || '';
                city.value = lead.city || '';
                state.value = lead.state || '';
                country.value = lead.country || '';
                zipCode.value = lead.zipCode || '';
                description.value = lead.description || '';
                dateTime.value = formatCustomDate(lead.dateTime);
                modified.value = formatCustomDate(lead.modified);

            } else {
                showToast('Failed to load lead data');
                console.error('Lead not found');
            }
        } catch (error) {
            showToast('Error occurred while loading lead data');
            console.error('Error:', error);
        }
    }

    document.getElementById('save').addEventListener('click', async () => {
        // Prevent form submission until validation and all logic is done
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

        if (isValid) {
            // Prepare lead object with form data
            const leadObj = {
                "leadOwner": leadOwner.value,
                "company": company.value,
                "firstName": firstName.value,
                "lastName": lastName.value,
                "title": title.value,
                "email": email.value,
                "fax": fax.value,
                "mobile": mobile.value,
                "website": website.value,
                "leadSource": leadSource.value,
                "leadStatus": leadStatus.value,
                "industry": industry.value,
                "employees": employees.value,
                "annualRevenue": annualRevenue.value,
                "skypeID": skypeID.value,
                "twitter": twitter.value,
                "secondaryEmail": secondaryEmail.value,
                "street": street.value,
                "city": city.value,
                "state": state.value,
                "country": country.value,
                "zipCode": zipCode.value,
                "description": description.value,
                "dateTime": "",
                "modified": new Date().toISOString() 

            };

            const leadId = new URLSearchParams(window.location.search).get('id'); // Get the ID from URL

           
        try {
            let response;
            if (leadId) {
                // If we have an ID, it's an update (PUT request)
                // Do not change dateTime when updating an existing lead
                const existingLead = await fetch(`/api/leads/${leadId}`);
                const leadData = await existingLead.json();

                leadObj.dateTime = leadData.dateTime;  // Keep the original dateTime from the existing lead

                // Perform the update (PUT request)
                response = await fetch(`/api/leads/${leadId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(leadObj),
                });
            } else {
                // If no ID, create a new lead (POST request)
                leadObj.dateTime = new Date().toISOString();  // Set dateTime to the current time for new leads

                // Perform the create (POST request)
                response = await fetch('/api/leads', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(leadObj),
                });
            }
            
            if (response.ok) {
                    const data = await response.json();
                    console.log(`Lead ${leadId ? 'updated' : 'created'} with ID: ${data.id}`);
                    showToast(`Lead ${leadId ? 'updated' : 'created'} successfully!`, true);
                    
                    // Disable button to prevent multiple submissions
                    save.disabled = true;
                    document.body.classList.add('no-click');

                    setTimeout(() => {
                        // Enable the save button and remove the "no-click" class after a short delay
                        save.disabled = false;
                        document.body.classList.remove('no-click');

                        // Redirect to lead profile page with the new/updated lead ID
                        window.location.href = `/html/leads/leadProfile.html?id=${data.id}`;
                    }, 2000); // Adjust delay as needed
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


    function formatRevenue(input) {
        let value = input.value.replace(/[^0-9.]/g, '');
        if (value) {
            input.value = '$ ' + value;
        } else {
            input.value = '';
        }
    }

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
            "description" :description.value,
            "dateTime" :dateTime.value
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
                showToast('Lead created successfully!', true);
                setTimeout(() => {
                    window.location.href = '/html/leads/createLead.html';
                }, 1500);
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