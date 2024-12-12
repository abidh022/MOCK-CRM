function changeSection(section) {
    // Remove active class from all headers
    const headers = document.querySelectorAll('.header');
    headers.forEach(header => {
      header.classList.remove('active');
    });

    // Add active class to the clicked header
    const activeHeader = document.getElementById(section);
    activeHeader.classList.add('active');
  }

  // Set 'Upcoming' as the default active section when the page loads
  window.onload = function() {
    changeSection('personalroom');
  };    


  window.onload = function() {
    const currentPage = window.location.pathname;
    if (currentPage.includes("myMeeting.html")) {
      document.getElementById('upcoming').classList.add('active');
    } else if (currentPage.includes("past.html")) {
      document.getElementById('past').classList.add('active');
    } else if (currentPage.includes("personalroom.html")) {
      document.getElementById('personalroom').classList.add('active');
    }
  };


  function togglePasswordRow() {
    var passwordRow = document.getElementById('passwordRow');
    var alwaysLocked = document.getElementById('alwaysLocked');
    var passwordCheckbox = document.getElementById('passwordCheckbox');

    // Show the password row only when 'Password protected' is checked
    if (passwordCheckbox.checked) {
        passwordRow.style.display = 'table-row';
    } else {
        passwordRow.style.display = 'none';
    }
    
    // If 'Always locked' is clicked, hide the password row
    if (alwaysLocked.checked) {
        passwordRow.style.display = 'none';
    }
}
// Modal behavior
var modal = document.getElementById("invitationModal");
var openInvitation = document.getElementById("openInvitation");
var closeBtn = document.getElementsByClassName("close")[0];
var cancelBtn = document.getElementById("cancelBtn");
var copyBtn = document.getElementById("copyBtn");


closeBtn.onclick = function() {
    modal.style.display = "none";
}

cancelBtn.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

async function getZuid() {
  try {
    const response = await axios.get("/auth/getZuid");
    if (response.data && response.data.zuid) {
      return response.data.zuid;
    }
  } catch (error) {
    console.error("Error fetching ZUID:", error);
  }
  return null; 
}

async function createInstantMeeting() {
  console.log("Creating Instant Meeting...");

  const zuid = await getZuid();
  if (!zuid) {
    alert("Unable to fetch ZUID.");
    return;
  }

  console.log(zuid);
  const meetingDetails = {
    topic: "Instant Meeting", // You can customize this as needed
    date: new Date().toISOString().split('T')[0], // Current date
    time: new Date().toLocaleTimeString().split(' ')[0], // Current time
    duration_hours: 1, // Default duration (1 hour)
    duration_minutes: 0, // Default duration (0 minutes)
    timezone: "Asia/Calcutta", 
  };
  
  // Create the starting time based on current date and time
  let startTime = new Date(`${meetingDetails.date}T${meetingDetails.time}`);
  
  // Add 10 minutes to the start time
  startTime.setMinutes(startTime.getMinutes() + 10);
  
  // Format the new time (10 minutes later)
  const formattedStartTime = startTime.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  
  // Ensure the formatting is consistent with your previous format
  const finalFormattedTime = formattedStartTime.replace(/, (\d{4}),/, ", $1");
  
  console.log(finalFormattedTime);
  
  // Create meeting data with the updated start time
  const meetingData = {
    session: {
      topic: meetingDetails.topic,
      presenter: zuid,
      startTime: finalFormattedTime,
      timezone: meetingDetails.timezone,
    },
  };
  
  console.log(meetingData);

  try {
    const response = await axios.post('/auth/personalmeeting', {
      session: meetingData,
      meetingKey: meetingKey,
    });

    if (response.status === 200) {
      alert("Meeting Scheduled Successfully!");
      const meetingKey = response.data.session.meetingKey;
      document.getElementById("meetingKey").textContent = meetingKey;
      const joinLink = response.data.session.joinLink
      document.getElementById("meetinglink").textContent = joinLink;
      const pwd = response.data.session.pwd
      document.getElementById("pwd").textContent = pwd;
      const topic = response.data.session.topic
      document.getElementById("topic").textContent = topic;
      

      const button = document.getElementById("startmeetingbtn");
      button.addEventListener("click", function() {
        window.open(joinLink, "_blank");
      });
      
      openInvitation.onclick = function() {
        modal.style.display = "block";
        document.getElementById('topic').textContent = topic;
        document.getElementById('meetingKeypop').textContent = meetingKey;
        document.getElementById('meetinglinkpop').textContent = joinLink;
        document.getElementById('pwdpop').textContent = pwd;
        console.log("pop",meetingKey);
        console.log("pop",topic);
        console.log("pop",joinLink);  
        console.log("pop",pwd);
    }

    const shareBtn = document.getElementById("sharebtn");
    shareBtn.addEventListener("click", function () {
        const topic = document.getElementById("topic").innerText;
        const meetingKey = document.getElementById("meetingKeypop").innerText;
        const meetingLink = document.getElementById("meetinglinkpop").innerText;
        const password = document.getElementById("pwdpop").innerText;
        const shareMessage = `
You're invited to join a meeting:

Title: ${topic}
Meeting Key: ${meetingKey}
Link: ${meetingLink}
Password: ${password}
        `;    
        const encodedMessage = encodeURIComponent(shareMessage);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    });
    
      copyBtn.onclick = function() {
        navigator.clipboard.writeText(joinLink).then(function() {
          alert("Meeting link copied to clipboard!");
        }, function() {
          alert("Failed to copy meeting link.");
        });
      }
    } else {
      console.error("Error scheduling meeting:", response.data);
      alert("Failed to schedule the meeting.");
    }
  } catch (error) {
    console.error("Error during meeting creation:", error);
    alert("An error occurred while creating the meeting.");
  }
}
document.getElementById("createMeetingButton").addEventListener("click", createInstantMeeting);