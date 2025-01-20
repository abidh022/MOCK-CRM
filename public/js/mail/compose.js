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


function closemail(){
    window.location.href = "../../html/mail/mailHome.html";
}
document.querySelector("#close").addEventListener("click", closemail);


const urlParams = new URLSearchParams(window.location.search);
const replyToMessageId = urlParams.get('replyTo');
const folderId = urlParams.get('folderId');  
const actionType = urlParams.get('actionType'); 
console.log(replyToMessageId,folderId,actionType);

if (replyToMessageId) {
    axios.get(`/mail/getReplyMail?messageId=${replyToMessageId}&folderId=${folderId}`)    
    .then(response => {
        console.log("Email data fetched:", response.data);
        const emailContent = response.data.content.data.content;
        const emailDetails = response.data.details;

        console.log(emailContent);
        console.log("details",emailDetails);
        console.log("details", emailDetails.data.fromAddress);
        console.log("details", emailDetails.data.toAddress);


        const fromAddress = emailDetails.data.fromAddress;
        const toAddress = emailDetails.data.toAddress;
        const ccAddress = emailDetails.data.ccAddress;
        const subject = emailDetails.data.subject || 'No Subject';
        const receivedTime = emailDetails.data.receivedTime;

        const dateObj = new Date(parseInt(receivedTime));  
        
        const formattedDate = dateObj.toLocaleString("en-US", {
            weekday: 'short',   // Mon
            day: '2-digit',     // 13
            month: 'short',     // Jan
            year: 'numeric',    // 2025
            hour: '2-digit',    // 17
            minute: '2-digit',  // 41
            second: '2-digit',  // 14
            hour12: false,      // 24-hour format
        }).replace(",", "");  // Remove the comma after the weekday
        
        const htmlContent = emailContent;
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlContent; 
        const plainTextContent = tempDiv.textContent || tempDiv.innerText || "";

        // let fullMessage = '';

        if (actionType === 'reply') {
            // Format for Reply
            const oldMessageHeader = `\n\n\n\n\n\n\n\n\n---- On ${formattedDate} <${fromAddress}> wrote ---\n`;
            fullMessage = oldMessageHeader + plainTextContent;
        } else if (actionType === 'forward') {
            // Format for Forward
            const forwardedHeader = `\n\n\n\n\n\n============ Forwarded message ============\nFrom: ${fromAddress}\nTo: ${toAddress}\nDate: ${formattedDate}\nSubject: ${subject}\n============ Forwarded message ============\n\n`;
            fullMessage = forwardedHeader + plainTextContent;
        }

        console.log("msg:",fullMessage);
        
        const cleanFromAddress = fromAddress.replace(/[<>]/g, '').replace(/&lt;/g, '').replace(/&gt;/g, '').trim();
        const cleanToAddress = fromAddress.replace(/[<>]/g, '').replace(/&lt;/g, '').replace(/&gt;/g, '').trim();
        const cleanCcAddress = ccAddress === "Not Provided" ? "" : ccAddress.replace(/[<>]/g, '').replace(/&lt;/g, '').replace(/&gt;/g, '').trim();
        // const displayToAddress = (cleanFromAddress === cleanToAddress) ? cleanFromAddress : cleanToAddress;

        // document.getElementById('fromAddress').value = cleanFromAddress;
        document.getElementById('toAddress').value = cleanToAddress;
        document.getElementById('ccAddress').value = cleanCcAddress;
        document.getElementById('subject').value = subject;
        document.getElementById('content').value = fullMessage;
        })
    .catch(error => {
        console.error("Error fetching email data:", error);
        alert("Failed to load email data for reply.");
    });
}   

document.getElementById('reset').addEventListener('click', function(){
    window.location.href = "/html/mail/compose.html";
})

document.getElementById('shareDraft').addEventListener('click', function() {

    // Check if the Web Share API is supported
    if (navigator.share) {
        navigator.share({
            url: window.location.href  // You can optionally share the current URL
        })
        .then(() => {
            console.log("Share was successful.");
        })
        .catch((error) => {
            console.error("Error sharing:", error);
        });
    } else {
        // If Web Share API is not supported, fallback to an alternative method
        alert("Web Share API is not supported on this browser.");
    }
});