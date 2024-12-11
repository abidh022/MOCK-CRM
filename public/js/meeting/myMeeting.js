// document.getElementById("getaccesstoken").onclick = function() {
//   const clientId = "1000.Z4UWL3MAKX12X6WX4VGIQF51TPWV1Z";  // Your Zoho client ID
//   const redirectUri = "http://localhost:5000/auth";  // Your redirect URI
//   const scope = "ZohoCRM.users.READ,ZohoCRM.modules.ALL,ZohoMeeting.manageOrg.READ,ZohoCRM.org.READ,ZohoMeeting.meeting.ALL,ZohoMeeting.meeting.CREATE,ZohoMeeting.meeting.READ,ZohoMeeting.meeting.DELETE";
//   const responseType = "code";  
//   const accessType = "offline"; 

//   const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=${responseType}&access_type=${accessType}&redirect_uri=${redirectUri}`;    
//   window.location.href = authUrl;
// };

 
 
 function changeSection(section) {
      // Remove active class from all headers
      const headers = document.querySelectorAll('.header');
      headers.forEach(header => {
        header.classList.remove('active');
      });

      const activeHeader = document.getElementById(section);
      activeHeader.classList.add('active');
    }
    window.onload = function() {
      changeSection('upcoming');
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

//display meetinggg
async function fetchMeetings() {
  try {
    const response = await axios.get('/auth/meetingslist');
    // console.log('Full Response:', response);

    const meetings = response.data.data.session;
    console.log('Meetings:', meetings);  

    if (meetings.length === 0) {
      // If there are no meetings, show a friendly message
      const meetlistboxContainer = document.getElementById('data-container');
      meetlistboxContainer.innerHTML = `
        <div class="no-meetings-message">
          <img src="/assets/no-upcoming-meeting.png" alt="No Upcoming Meetings" class="no-meetings-image">
          <h2>No Upcoming Meetings</h2>
          <p>You can either start an instant meeting or schedule a meeting.</p>
          <button class="button" id="meetnow">Meet Now</button>
          <button class="schedule" id="schedule" onclick="window.location.replace('/html/meeting/schedule.html')">Schedule</button>
      </div>
      `;
      return;
    }

    function getRemainingTime(startTimeMillis) {
      const now = new Date().getTime(); // Current time
      const diff = startTimeMillis - now;
    
      const days = Math.floor(diff / (1000 * 60 * 60 * 24)); // Calculate days
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Calculate hours
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)); // Calculate minutes
    
      // Ensure no negative values
      return {
        days: days < 0 ? 0 : days,
        hours: hours < 0 ? 0 : hours,
        minutes: minutes < 0 ? 0 : minutes,
      };
    }
    
    const meetlistboxContainer = document.getElementById('meetlistbox-container');
    meetlistboxContainer.innerHTML = '';  

    meetings.forEach(meeting => {
      const startTimeMillis = parseInt(meeting.startTimeMillis);
      const remainingTime = getRemainingTime(startTimeMillis);

      const meetlistbox = document.createElement('div');
      meetlistbox.classList.add('meetlistbox');

      let timePeriod = meeting.timePeriod ? meeting.timePeriod.toLowerCase() : setTimePeriod(startTimeMillis);
      const timeOfDayImage = getTimeOfDayImage(timePeriod);
            
      meetlistbox.onclick = (e) => {
        if (e.target.id !== 'start') {
          // When clicking anywhere except the start button, navigate to meeting details
          window.location.replace(`/html/meeting/meetingDetails.html?meetingKey=${meeting.meetingKey}`);
        }
      };

        let buttonText = "Start";
        let meetingStatusMessage = "";
        let meetingTimeText = `Starts in ${remainingTime.days} days ${remainingTime.hours} hrs, ${remainingTime.minutes} mins`;
  
        // If the meeting is over
        if (remainingTime.days === 0 && remainingTime.hours === 0 && remainingTime.minutes === 0) {
          buttonText = "View";
          meetingStatusMessage = "<p>The meeting has completed...</p>";
          meetingTimeText = ""; 
        }

      const presenterAvatar = meeting.presenterAvatar || '/assets/default-avatar.png'; 

      // Add meeting details to the inner HTML
      meetlistbox.innerHTML = `
        <div id="timelogo">
          <img src="${timeOfDayImage}" alt="Time of Day Image">
        </div>
        <div id="datetime">
          <div id="day">${formatDate(startTimeMillis)}</div>
          <div id="time">${formatTime(startTimeMillis)}</div> 
        </div>
        <div id="meetTopic">
          ${meeting.presenterFullName} - ${meeting.topic || 'No Topic'}
        </div>
        <div id="zohoaccount">
          <img id="presenterImage" src="${presenterAvatar}" alt="${meeting.presenterFullName}'s Image">
          <div id="nameanddept">
            <div id="name">${meeting.presenterFullName}</div>
            <div id="department">${meeting.department || 'No Department'}</div>
          </div>
        </div>
          <div id="startdiv">
            <button id="start">${buttonText}</button> 
            <div id="starttime">
            <p>${meetingTimeText}</p>
            ${meetingStatusMessage}
          </div>
        </div>
      `;

      const startButton = meetlistbox.querySelector('#start');  
      startButton.addEventListener('click', (e) => {
        e.stopPropagation();  
        if (buttonText === "Start") {
          window.open(meeting.joinLink, '_blank');
        } else {
          window.location.replace(`/html/meeting/meetingDetails.html?meetingKey=${meeting.meetingKey}`);
        }
      });

      meetlistboxContainer.appendChild(meetlistbox);
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
  }
}

function getTimeOfDayImage(timePeriod) {
  timePeriod = timePeriod.toLowerCase();

  switch (timePeriod) {
    case "morning":
      return '/assets/new-morning.png';
    case "afternoon":
      return '/assets/new-afternoon.png';
    case "evening":
      return '/assets/new-evening.png';
    case "night":
      return '/assets/new-night.png';
    default:
      return '/assets/new-night.png';  
  }
}

function getRemainingTime(startTimeMillis) {
  const now = new Date().getTime(); // Current time
  const diff = startTimeMillis - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    days: days < 0 ? 0 : days,
    hours: hours < 0 ? 0 : hours,
    minutes: minutes < 0 ? 0 : minutes,
  };
}

function formatDate(startTimeMillis) {
  const date = new Date(startTimeMillis);
  const options = { weekday: 'short', day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-US', options);
}

function formatTime(startTimeMillis) {
  const date = new Date(startTimeMillis);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

document.addEventListener("DOMContentLoaded", fetchMeetings);

