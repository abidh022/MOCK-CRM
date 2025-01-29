let accountForm = document.querySelector("#accountForm");

const accountOwner = document.querySelector("#accountOwner");
const rating = document.querySelector("#rating");
const accountName = document.querySelector("#accountName");
const phone = document.querySelector("#phone");
const accountSite = document.querySelector("#accountSite");
const fax = document.querySelector("#fax");
const parentAccount = document.querySelector("#parentAccount");
const website = document.querySelector("#website");
const accountNumber = document.querySelector("#accountNumber");
const tickerSymbol = document.querySelector("#tickerSymbol");
const accountType = document.querySelector("#accountType");
const ownership = document.querySelector("#ownership");
const industry = document.querySelector("#industry");
const employee = document.querySelector("#employee");
const annualRevenue = document.querySelector("#annualRevenue");
const SICCode = document.querySelector("#SICCode");
const dateTime = document.querySelector("#dateTime");
const modified = document.querySelector("#modified");
// Address Fields
const billingStreet = document.querySelector("#billingStreet");
const shippingStreet = document.querySelector("#shippingStreet");
const billingCity = document.querySelector("#billingCity");
const shippingCity = document.querySelector("#shippingCity");
const billingState = document.querySelector("#billingState");
const shippingState = document.querySelector("#shippingState");
const billingZip = document.querySelector("#billingZip");
const shippingZip = document.querySelector("#shippingZip");
const billingCountry = document.querySelector("#billingCountry");
const shippingCountry = document.querySelector("#shippingCountry");
// Description Information
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

    // Load account data if editing
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const accountId = params.get('id'); // Get account ID from URL

        if (accountId) {
            await loadAccountData(accountId); // If there is an account ID, load the data
        }
    });

    // Function to load account data for editing
    async function loadAccountData(accountId) {
        try {
            // Fetch account data from the server using the accountId
            const response = await fetch(`/account/getAccountById/${accountId}`);
            const account = await response.json();

            if (account) {
                // Populate form fields with existing account data
                accountOwner.value = account.accountOwner || '';
                rating.value = account.rating || '';
                accountName.value = account.accountName || '';
                phone.value = account.phone || '';
                accountSite.value = account.accountSite || '';
                fax.value = account.fax || '';
                parentAccount.value = account.parentAccount || '';
                website.value = account.website || '';
                accountNumber.value = account.accountNumber || '';
                tickerSymbol.value = account.tickerSymbol || '';
                accountType.value = account.accountType || '';
                ownership.value = account.ownership || '';
                industry.value = account.industry || '';
                employee.value = account.employee || '';
                annualRevenue.value = account.annualRevenue || '';
                SICCode.value = account.SICCode || '';
                description.value = account.description || '';
                billingStreet.value = account.billingStreet || '';
                shippingStreet.value = account.shippingStreet || '';
                billingCity.value = account.billingCity || '';
                shippingCity.value = account.shippingCity || '';
                billingState.value = account.billingState || '';
                shippingState.value = account.shippingState || '';
                billingZip.value = account.billingZip || '';
                shippingZip.value = account.shippingZip || '';
                billingCountry.value = account.billingCountry || '';
                shippingCountry.value = account.shippingCountry || '';
                dateTime.value = formatCustomDate(account.dateTime);
                modified.value = formatCustomDate(account.modified);
            } else {
                showToast('Failed to load account data');
                console.error('Account not found');
            }
        } catch (error) {
            showToast('Error occurred while loading account data');
            console.error('Error:', error);
        }
    }

    document.getElementById('save').addEventListener('click', async () => {
        // Prevent form submission until validation and all logic is done
        accountForm.requestSubmit();

        let isValid = true;

        // Validate required fields

        if (!accountName.value) {
            setError(accountName);
            isValid = false;
        } else {
            setSuccess(accountName);
        }

        if (isValid) {
            // Prepare account object with form data
            const accountObj = {
                "accountOwner": accountOwner.value,
                "rating": rating.value,
                "accountName": accountName.value,
                "phone": phone.value,
                "accountSite": accountSite.value,
                "fax": fax.value,
                "parentAccount": parentAccount.value,
                "website": website.value,
                "accountNumber": accountNumber.value,
                "tickerSymbol": tickerSymbol.value,
                "accountType": accountType.value,
                "ownership": ownership.value,
                "industry": industry.value,
                "employee": employee.value,
                "annualRevenue": annualRevenue.value,
                "SICCode": SICCode.value,
                "description": description.value,
                "billingStreet": billingStreet.value,
                "shippingStreet": shippingStreet.value,
                "billingCity": billingCity.value,
                "shippingCity": shippingCity.value,
                "billingState": billingState.value,
                "shippingState": shippingState.value,
                "billingZip": billingZip.value,
                "shippingZip": shippingZip.value,
                "billingCountry": billingCountry.value,
                "shippingCountry": shippingCountry.value,
                "dateTime": "",
                "modified": new Date().toISOString()
            };

            const accountId = new URLSearchParams(window.location.search).get('id'); 
           
        try {
            let response;
            if (accountId) {
                const existingAccount = await fetch(`/account/getAccountById/${accountId}`);
                const accountData = await existingAccount.json();

                accountObj.dateTime = accountData.dateTime;  // Keep the original dateTime from the existing account)
                response = await fetch(`/account/updateAccount/${accountId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(accountObj),
                });
            } else {
                // If no ID, create a new account (POST request)
                accountObj.dateTime = new Date().toISOString();  // Set dateTime to the current time for new accounts

                // Perform the create (POST request) 
                response = await fetch('/account/createAccount', {  // this is save
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(accountObj),
                });
            }
            
            if (response.ok) {
                    const data = await response.json();
                    console.log(`Account ${accountId ? 'updated' : 'created'} with ID: ${data.id}`);
                    showToast(`Account ${accountId ? 'updated' : 'created'} successfully!`, true);
                    
                    // save.disabled = true;
                    document.getElementById('save').disabled = true;
                    document.body.classList.add('no-click');

                    setTimeout(() => {
                        document.getElementById('save').disabled = false;
                        // save.disabled = false;
                        document.body.classList.remove('no-click');

                        window.location.href = `/html/accounts/accountsHome.html`;
                    }, 2000); // Adjust delay as needed
                } else {
                    showToast('Failed to save account.');
                    console.error('Failed to save account');
                }
            } catch (error) {
                showToast('Error occurred while saving account.');
                console.error('Error:', error);
            }
        }
    });

    accountForm.addEventListener("submit",(e)=> {
        e.preventDefault();  
        
        if (!accountName.value){
            !accountName.value ? setError(accountName) : setSuccess(accountName);
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


    function formatRevenue(input) {
        let value = input.value.replace(/[^0-9.]/g, '');
        if (value) {
            input.value = '$ ' + value;
        } else {
            input.value = '';
        }
    }


//     //photo upload
//     document.querySelector('#fileInput input').addEventListener('change', function(event) {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function(e) {
//                 const img = document.getElementById('uploadedImage');
//                 const icon = document.getElementById('personIcon');
//                 img.src = e.target.result;
//                 img.style.display = 'block'; // Show the image
//                 icon.style.display = 'none'; // Hide the person icon
//             };
//             reader.readAsDataURL(file);
//         }
//     });

//     // Get the current date and time
//     function updateDateTime() {
//         var now = new Date();

//         var year = now.getFullYear();
//         var month = (now.getMonth() + 1).toString().padStart(2, '0');
//         var day = now.getDate().toString().padStart(2, '0');
//         var hours = now.getHours().toString().padStart(2, '0');
//         var minutes = now.getMinutes().toString().padStart(2, '0');
//         var seconds = now.getSeconds().toString().padStart(2, '0');

//         var dateTimeString = day + '-' + month + '-' + year + '  ' + hours + ':' + minutes + ':' + seconds;
//         document.getElementById('dateTime').value = dateTimeString;
//     }
//     setInterval(updateDateTime, 1000);

//     function modifiedDateTime() {
//         var now = new Date();

//         var year = now.getFullYear();
//         var month = (now.getMonth() + 1).toString().padStart(2, '0');
//         var day = now.getDate().toString().padStart(2, '0');
//         var hours = now.getHours().toString().padStart(2, '0');
//         var minutes = now.getMinutes().toString().padStart(2, '0');
//         var seconds = now.getSeconds().toString().padStart(2, '0');

//         var dateTimeString = day + '-' + month + '-' + year + '  ' + hours + ':' + minutes + ':' + seconds;
//         document.getElementById('modified').value = dateTimeString;
//     }
//     setInterval(updateDateTime, 1000);

// function formatCustomDate(dateString) {
//     const date = new Date(dateString);
    
//     if (isNaN(date)) {
//         return 'Invalid Date';  // If the date is invalid
//     }
    
//     // Custom format: "DD-MM-YYYY HH:mm:ss"
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     const seconds = String(date.getSeconds()).padStart(2, '0');
    
//     return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
// }

//     //back btn
//     document.getElementById('btn1').addEventListener('click', function() {
//         window.history.back();
//     });

//     function showToast(message, isSuccess = false) {
//         const toast = document.querySelector('.toast');
//         toast.textContent = message;
//         toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44949';
//         toast.classList.remove('hide');
//         toast.style.visibility = 'visible';

//         void toast.offsetWidth;

//         toast.classList.add('show');

//         setTimeout(() => {
//             toast.classList.remove('show');
//             toast.classList.add('hide');

//             setTimeout(() => {
//                 toast.style.visibility = 'hidden';
//             }, 200);
//         }, 1500);
//     }

    
//     document.getElementById('save').addEventListener('click', async () => {
//         // Prevent form submission until validation and all logic is done
//         accountForm.requestSubmit();

//         let isValid = true;

//         // Validate required fields

//         if (!accountName.value) {
//             setError(accountName);
//             isValid = false;
//         } else {
//             setSuccess(accountName);
//         }

//         if (isValid) {
//             // Prepare lead object with form data
//             const accountObj = {
//                 "accountOwner": accountOwner.value,
//                 "rating": rating.value,
//                 "accountName": accountName.value,
//                 "phone": phone.value,
//                 "accountSite": accountSite.value,
//                 "fax": fax.value,
//                 "parentAccount": parentAccount.value,
//                 "website": website.value,
//                 "accountNumber": accountNumber.value,
//                 "tickerSymbol": tickerSymbol.value,
//                 "accountType": accountType.value,
//                 "ownership": ownership.value,
//                 "industry": industry.value,
//                 "employee": employee.value,
//                 "annualRevenue": annualRevenue.value,
//                 "SICCode": SICCode.value,
//                 "description": description.value,
//                 "billingStreet": billingStreet.value,
//                 "shippingStreet": shippingStreet.value,
//                 "billingCity": billingCity.value,
//                 "shippingCity": shippingCity.value,
//                 "billingState": billingState.value,
//                 "shippingState": shippingState.value,
//                 "billingZip": billingZip.value,
//                 "shippingZip": shippingZip.value,
//                 "billingCountry": billingCountry.value,
//                 "shippingCountry": shippingCountry.value,
//                 "dateTime": "",
//                 "modified": new Date().toISOString() 

//             };

//             const accountId = new URLSearchParams(window.location.search).get('id'); 
           
//         try {
//             let response;
//             if (accountId) {
//                 const existingAccount = await fetch(`/account/getIdForEdit/${accountId}`);
//                 const accountData = await existingAccount.json();

//                 accountObj.dateTime = accountData.dateTime;  // Keep the original dateTime from the existing lead)
//                 response = await fetch(`/accounts/updateAccount/${accountId}`, {
//                     method: 'PUT',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(accountObj),
//                 });
//             } else {
//                 // If no ID, create a new lead (POST request)
//                 accountObj.dateTime = new Date().toISOString();  // Set dateTime to the current time for new leads

//                 // Perform the create (POST request) 
//                 response = await fetch('/account/createAccount', {  // this is save
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify(accountObj),
//                 });
//             }
            
//             if (response.ok) {
//                     const data = await response.json();
//                     console.log(`Account ${accountId ? 'updated' : 'created'} with ID: ${data.id}`);
//                     showToast(`Account ${accountId ? 'updated' : 'created'} successfully!`, true);
                    
//                     save.disabled = true;
//                     document.body.classList.add('no-click');

//                     setTimeout(() => {
//                         save.disabled = false;
//                         document.body.classList.remove('no-click');

//                         window.location.href = `/html/accounts/accountProfile.html?id=${data.id}`;
//                     }, 2000); // Adjust delay as needed
//                 } else {
//                     showToast('Failed to save account.');
//                     console.error('Failed to save account');
//                 }
//             } catch (error) {
//                 showToast('Error occurred while saving lead.');
//                 console.error('Error:', error);
//             }
//         }
//     });


//         function formatRevenue(input) {
//         let value = input.value.replace(/[^0-9.]/g, '');
//         if (value) {
//             input.value = '$ ' + value;
//         } else {
//             input.value = '';
//         }
//     }
    // document.addEventListener('DOMContentLoaded', async () => {
    //     const params = new URLSearchParams(window.location.search);
    //     const accountId = params.get('id'); 

    //     if (accountId) {
    //         await loadAccountData(accountId); 
    //     }
    // });

    
//     async function loadAccountData(accountId) {
//         try {
//             // Fetch the lead data from the server
//             const response = await fetch(`/accounts/getIdForEdit/${accountId}`);
//             const account = await response.json();
// // document.querySelector('#fileInput input').addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (file) {
//         const reader = new FileReader();
//         reader.onload = function(e) {
//             const img = document.getElementById('uploadedImage');
//             const icon = document.getElementById('personIcon');
//             img.src = e.target.result;
//             img.style.display = 'block'; // Show the image
//             icon.style.display = 'none'; // Hide the person icon
//         };
//         reader.readAsDataURL(file);
//     }
// });

// // Date and time handling   
// function updateDateTime() {
//     const now = new Date();
//     const dateTimeString = now.toLocaleString();
//     document.getElementById('dateTime').value = dateTimeString;
// }
// setInterval(updateDateTime, 1000);

// function modifiedDateTime() {
//     const now = new Date();
//     const dateTimeString = now.toLocaleString();
//     document.getElementById('modified').value = dateTimeString;
// }

// // Back button functionality
// document.getElementById('backBtn').addEventListener('click', function() {
//     window.history.back();
// });

// // Form Validation
// function setError(field) {
//     field.nextElementSibling.innerHTML = "Required";
//     field.nextElementSibling.style.color = "red";
//     field.style.border = '1px solid red';
// }

// function setSuccess(field) {
//     field.nextElementSibling.innerHTML = "";
//     field.style.border = "1px solid black";
// }

// accountForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     let isValid = true;

//     // Validate required fields
//     if (!accountName.value) {
//         setError(accountName);
//         isValid = false;
//     } else {
//         setSuccess(accountName);
//     }

//     if (!phone.value) {
//         setError(phone);
//         isValid = false;
//     } else {
//         setSuccess(phone);
//     }

//     if (!website.value) {
//         setError(website);
//         isValid = false;
//     } else {
//         setSuccess(website);
//     }

//     if (isValid) {
//         saveAccountData();
//     }
// });

// async function saveAccountData() {
//     const accountObj = {
//         "accountOwner": accountOwner.value,
//         "rating": rating.value,
//         "accountName": accountName.value,
//         "phone": phone.value,
//         "accountSite": accountSite.value,
//         "fax": fax.value,
//         "parentAccount": parentAccount.value,
//         "website": website.value,
//         "accountNumber": accountNumber.value,
//         "tickerSymbol": tickerSymbol.value,
//         "accountType": accountType.value,
//         "ownership": ownership.value,
//         "industry": industry.value,
//         "employee": employee.value,
//         "annualRevenue": annualRevenue.value,
//         "SICCode": SICCode.value,
//         "dateTime": dateTime.value,
//         "modified": modified.value,
//         "description": description.value,
//         "billingStreet": billingStreet.value,
//         "shippingStreet": shippingStreet.value,
//         "billingCity": billingCity.value,
//         "shippingCity": shippingCity.value,
//         "billingState": billingState.value,
//         "shippingState": shippingState.value,
//         "billingZip": billingZip.value,
//         "shippingZip": shippingZip.value,
//         "billingCountry": billingCountry.value,
//         "shippingCountry": shippingCountry.value
//     };

//     const accountId = new URLSearchParams(window.location.search).get('id');

//     try {
//         let response;
//         if (accountId) {
//             // Edit existing account
//             const existingAccount = await fetch(`/accounts/getIdForEdit/${accountId}`);
//             const accountData = await existingAccount.json();

//             accountObj.dateTime = accountData.dateTime;  // Keep the original dateTime from the existing account
//             response = await fetch(`/accounts/updateAccount/${accountId}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(accountObj),
//             });
//         } else {
//             // Create new account
//             accountObj.dateTime = new Date().toISOString();
//             response = await fetch('/accounts/create', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(accountObj),
//             });
//         }

//         if (response.ok) {
//             const data = await response.json();
//             console.log(`Account ${accountId ? 'updated' : 'created'} with ID: ${data.id}`);
//             showToast(`Account ${accountId ? 'updated' : 'created'} successfully!`, true);
//             setTimeout(() => {
//                 window.location.href = `/html/accounts/accountProfile.html?id=${data.id}`;
//             }, 1500);
//         } else {
//             showToast('Failed to save account.');
//             console.error('Failed to save account');
//         }
//     } catch (error) {
//         showToast('Error occurred while saving account.');
//         console.error('Error:', error);
//     }
// }

// function showToast(message, isSuccess = false) {
//     const toast = document.querySelector('.toast');
//     toast.textContent = message;
//     toast.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44949';
//     toast.classList.remove('hide');
//     toast.style.visibility = 'visible';

//     void toast.offsetWidth; // trigger reflow

//     toast.classList.add('show');

//     setTimeout(() => {
//         toast.classList.remove('show');
//         toast.classList.add('hide');

//         setTimeout(() => {
//             toast.style.visibility = 'hidden';
//         }, 200);
//     }, 1500);
// }

// // Back button event listener
// document.getElementById('backBtn').addEventListener('click', function() {
//     window.history.back();
// });