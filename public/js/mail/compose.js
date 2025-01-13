document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/mail/getMailAddress');
        const data = await response.json();

        if (data.mailaddress) {
            document.querySelector('#fromAddress').value = data.mailaddress; 
        } else {
            console.error('Mail address not found');
        }
    } catch (error) {
        console.error('Error fetching mail address:', error);
    }
});

document.getElementById('attachment').addEventListener('click', function() {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const files = event.target.files;
    const attachmentDisplay = document.getElementById('attachmentdisplay');
    // attachmentDisplay.innerHTML = ''; 

    Array.from(files).forEach(file => {
        const fileContainer = document.createElement('div');
        const fileName = document.createElement('p');
        fileName.textContent = `File name: ${file.name}`;

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                img.style.maxWidth = '200px';
                fileContainer.appendChild(img);
                fileContainer.appendChild(fileName);
                attachmentDisplay.appendChild(fileContainer);
            };
            reader.readAsDataURL(file);
        } else {
            fileContainer.appendChild(fileName);
            attachmentDisplay.appendChild(fileContainer);
        }
    });
});


document.querySelector('#send').addEventListener('click', async () => {
    const fromAddress = document.querySelector('#fromAddress').value;
    const toAddress = document.querySelector('#toAddress').value;
    const ccAddress = document.querySelector('#ccAddress').value;
    const subject = document.querySelector('#subject').value;
    const content = document.querySelector('#content').value;
    const attachmentFiles = document.querySelector('#fileInput').files;


    if (!fromAddress || !toAddress || !content) {
        alert("Please fill in all required fields.");
        return;
    }

    const emailData = {
        from: fromAddress,
        to: toAddress,
        cc: ccAddress,
        subject: subject,
        message: content,
        attachments: []
    };

    // If there is a file, upload it
    for (const file of attachmentFiles) {
        const formData = new FormData();
        formData.append('file', file);
    
        const fileUploadResponse = await fetch('/mail/uploadAttachment', {
            method: 'POST',
            body: formData
        });
    
        const fileUploadData = await fileUploadResponse.json();
    
        if (fileUploadResponse.ok) {
            emailData.attachments.push({
                storeName: fileUploadData.storeName,
                attachmentPath: fileUploadData.attachmentPath,
                attachmentName: fileUploadData.attachmentName
            });
        } else {
            alert('Failed to upload file');
            return;
        }
    }

    try {
        const response = await fetch('/mail/sendMail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const responseData = await response.json();

        if (response.ok) {
            alert('Email sent successfully!');
            window.location.href = '/html/mail/compose.html';
        } else {
            alert('Failed to send email: ' + responseData.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending email.');
    }
});

// document.addEventListener('DOMContentLoaded', () => {
//     document.querySelector('#send').addEventListener('click', async () => {
//         console.log('Send button clicked');

//         const fromAddress = document.querySelector('#fromAddress').value;
//         const toAddress = document.querySelector('#toAddress').value;
//         const ccAddress = document.querySelector('#ccAddress').value;
//         const subject = document.querySelector('#subject').value;
//         const content = document.querySelector('#content').value;
//         const attachmentFile = document.querySelector('#attachment').files[0]; 

//         if (!fromAddress || !toAddress || !content) {
//             alert("Please fill in all required fields.");
//             return;
//         }

//         console.log("Sending email...");
//         console.log(`From: ${fromAddress}`);
//         console.log(`To: ${toAddress}`);
//         console.log(`CC: ${ccAddress}`);
//         console.log(`Subject: ${subject}`);
//         console.log(`Body: ${content}`);

//         const emailData = {
//             from: fromAddress,
//             to: toAddress,
//             cc: ccAddress,
//             subject: subject,
//             message: content,
//             attachments : []
//         };        

//         if (attachmentFile) {
//             const formData = new FormData();
//             formData.append('file',attachmentFile);

//             try{

//                 const fileUploadResponse = await fetch('/mail/uploadAttachment',{
//                     method : 'POST',
//                     body : formData
//                 });

//                 const fileUploadData = await fileUploadResponse.json();

//                 if (fileUploadResponse.ok) {
//                     // Add the uploaded file details to the email data
//                     emailData.attachments.push({
//                         storeName: fileUploadData.storeName,
//                         attachmentPath: fileUploadData.attachmentPath,
//                         attachmentName: fileUploadData.attachmentName
//                     });
//                 } else {
//                     alert('Failed to upload file');
//                     return;
//                 }
//             } catch (error) {
//                 console.error('Error uploading attachment:', error);
//                 alert('Error uploading attachment.');
//                 return;
//             }
//         }
//         try {
//             const response = await fetch('/mail/sendMail', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(emailData)
//             });

//             const responseData = await response.json();

//             if (response.ok) {
//                 alert('Email sent successfully!');

//                 document.querySelector('#fromAddress').value = '';
//                 document.querySelector('#toAddress').value = '';
//                 document.querySelector('#ccAddress').value = '';
//                 document.querySelector('#subject').value = '';
//                 document.querySelector('#content').value = '';
//                 document.querySelector('#attachment').value = ''; 
//             } else {
//                 alert('Failed to send email: ' + responseData.error);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             alert('Error sending email.');
//         }
//     });
// });

function closemail(){
    window.location.href = "../../html/mail/mailHome.html";
}
document.querySelector("#close").addEventListener("click", closemail);

// // Function to attach a file
// function attachFile() {
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.onchange = function () {
//         alert(`File ${fileInput.files[0].name} attached.`);
//     };
//     fileInput.click();
// }
// document.querySelector("#attachment").addEventListener("click", attachFile); // Attach File

    // Trigger the file input when the button is clicked
    // document.getElementById('attachment').addEventListener('click', function() {
    //     document.getElementById('fileInput').click();
    // });

    // // Display the attached files in the given div
    // document.getElementById('fileInput').addEventListener('change', function(event) {
    //     const files = event.target.files;
    //     const attachmentDisplay = document.getElementById('attachmentdisplay');

    //     // Loop through each selected file and display its details or preview
    //     Array.from(files).forEach(file => {
    //         const fileContainer = document.createElement('div');
    //         const fileName = document.createElement('p');
    //         fileName.textContent = `File name: ${file.name}`;

    //         // Optionally display an image preview if the file is an image
    //         if (file.type.startsWith('image/')) {
    //             const reader = new FileReader();
    //             reader.onload = function(e) {
    //                 const img = document.createElement('img');
    //                 img.src = e.target.result;
    //                 img.alt = file.name;
    //                 img.style.maxWidth = '200px';
    //                 fileContainer.appendChild(img);
    //                 fileContainer.appendChild(fileName);
    //                 attachmentDisplay.appendChild(fileContainer);
    //             };
    //             reader.readAsDataURL(file);
    //         } else {
    //             // If it's not an image, just display the file name
    //             fileContainer.appendChild(fileName);
    //             attachmentDisplay.appendChild(fileContainer);
    //         }
    //     });
    // });

// // Function to save the draft
// function saveDraft() {
//     const fromEmail = document.querySelector("input[placeholder='Your email']").value;
//     const toEmail = document.querySelector("input[placeholder='Recipient email']").value;
//     const ccEmail = document.querySelector("input[placeholder='CC email']").value;
//     const bccEmail = document.querySelector("input[placeholder='BCC email']").value;
//     const subject = document.querySelector("input[placeholder='Email subject']").value;
//     const body = document.querySelector("textarea[placeholder='Compose your email']").value;

//     localStorage.setItem('draft', JSON.stringify({ fromEmail, toEmail, ccEmail, bccEmail, subject, body }));
//     alert('Draft saved successfully!');
// }

// // Function to share the draft
// function shareDraft() {
//     const draft = JSON.parse(localStorage.getItem('draft'));
    
//     if (!draft) {
//         alert('No draft found to share.');
//         return;
//     }

//     alert('Sharing draft...\n' + JSON.stringify(draft));
//     // Perform actual sharing logic here (e.g., sharing via an API or sending to another user).
// }

// // Function to delete the email
// function deleteEmail() {
//     const confirmation = confirm("Are you sure you want to Reser this email?");
//     if (confirmation) {
//         document.querySelector("input[placeholder='Your email']").value = '';
//         document.querySelector("input[placeholder='Recipient email']").value = '';
//         document.querySelector("input[placeholder='CC email']").value = '';
//         document.querySelector("input[placeholder='BCC email']").value = '';
//         document.querySelector("input[placeholder='Email subject']").value = '';
//         document.querySelector("textarea[placeholder='Compose your email']").value = '';
//     }
// }

// // Function to send email later
// function sendLater() {
//     alert("Your email will be sent later.");
//     // Logic to handle the scheduling of the email (e.g., via server-side scheduling).
// }




// // Function to mark the email as high priority
// function setHighPriority() {
//     alert("This email is marked as High Priority!");
//     // Additional logic to visually indicate high priority or flag it for sending with priority.
// }




// // Add event listeners for buttons
// document.querySelector("#send").addEventListener("click", ); // Send
// document.querySelector("#leftsidebtns button:nth-child(2)").addEventListener("click", sendLater); // Send Later
// document.querySelector("#leftsidebtns button:nth-child(4)").addEventListener("click", setHighPriority); // High Priority

// document.querySelector("#rightsidebtns button:nth-child(1)").addEventListener("click", saveDraft); // Save Draft
// document.querySelector("#rightsidebtns button:nth-child(2)").addEventListener("click", shareDraft); // Share Draft
// document.querySelector("#rightsidebtns button:nth-child(3)").addEventListener("click", deleteEmail); // Delete
