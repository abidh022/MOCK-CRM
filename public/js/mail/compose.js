// Function to send the email
function sendEmail() {
    const fromEmail = document.querySelector("input[placeholder='Your email']").value;
    const toEmail = document.querySelector("input[placeholder='Recipient email']").value;
    const ccEmail = document.querySelector("input[placeholder='CC email']").value;
    const bccEmail = document.querySelector("input[placeholder='BCC email']").value;
    const subject = document.querySelector("input[placeholder='Email subject']").value;
    const body = document.querySelector("textarea[placeholder='Compose your email']").value;

    if (!fromEmail || !toEmail || !subject || !body) {
        alert('Please fill in all required fields.');
        return;
    }

    console.log("Sending email...");
    console.log(`From: ${fromEmail}`);
    console.log(`To: ${toEmail}`);
    console.log(`CC: ${ccEmail}`);
    console.log(`BCC: ${bccEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Perform actual email sending logic here (e.g., via an API or server-side script).
}

// Function to save the draft
function saveDraft() {
    const fromEmail = document.querySelector("input[placeholder='Your email']").value;
    const toEmail = document.querySelector("input[placeholder='Recipient email']").value;
    const ccEmail = document.querySelector("input[placeholder='CC email']").value;
    const bccEmail = document.querySelector("input[placeholder='BCC email']").value;
    const subject = document.querySelector("input[placeholder='Email subject']").value;
    const body = document.querySelector("textarea[placeholder='Compose your email']").value;

    localStorage.setItem('draft', JSON.stringify({ fromEmail, toEmail, ccEmail, bccEmail, subject, body }));
    alert('Draft saved successfully!');
}

// Function to share the draft
function shareDraft() {
    const draft = JSON.parse(localStorage.getItem('draft'));
    
    if (!draft) {
        alert('No draft found to share.');
        return;
    }

    alert('Sharing draft...\n' + JSON.stringify(draft));
    // Perform actual sharing logic here (e.g., sharing via an API or sending to another user).
}

// Function to delete the email
function deleteEmail() {
    const confirmation = confirm("Are you sure you want to Reser this email?");
    if (confirmation) {
        document.querySelector("input[placeholder='Your email']").value = '';
        document.querySelector("input[placeholder='Recipient email']").value = '';
        document.querySelector("input[placeholder='CC email']").value = '';
        document.querySelector("input[placeholder='BCC email']").value = '';
        document.querySelector("input[placeholder='Email subject']").value = '';
        document.querySelector("textarea[placeholder='Compose your email']").value = '';
    }
}

// Function to send email later
function sendLater() {
    alert("Your email will be sent later.");
    // Logic to handle the scheduling of the email (e.g., via server-side scheduling).
}

// Function to attach a file
function attachFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = function () {
        alert(`File ${fileInput.files[0].name} attached.`);
    };
    fileInput.click();
}

// Function to mark the email as high priority
function setHighPriority() {
    alert("This email is marked as High Priority!");
    // Additional logic to visually indicate high priority or flag it for sending with priority.
}

function closemail(){
    window.location.href = "../../html/mail/mailHome.html";
}

// Add event listeners for buttons
document.querySelector("#leftsidebtns button:nth-child(1)").addEventListener("click", sendEmail); // Send
document.querySelector("#leftsidebtns button:nth-child(2)").addEventListener("click", sendLater); // Send Later
document.querySelector("#leftsidebtns button:nth-child(3)").addEventListener("click", attachFile); // Attach File
document.querySelector("#leftsidebtns button:nth-child(4)").addEventListener("click", setHighPriority); // High Priority

document.querySelector("#rightsidebtns button:nth-child(1)").addEventListener("click", saveDraft); // Save Draft
document.querySelector("#rightsidebtns button:nth-child(2)").addEventListener("click", shareDraft); // Share Draft
document.querySelector("#rightsidebtns button:nth-child(3)").addEventListener("click", deleteEmail); // Delete
document.querySelector("#rightsidebtns button:nth-child(4)").addEventListener("click", closemail); // Delete
