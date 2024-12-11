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

async function scheduleMeeting(event) {
  event.preventDefault(); 

  // Collect form data
  const formData = new FormData(event.target);
  const meetingDetails = {
    topic: formData.get("topic"),
    meetingType: formData.get("meetingType"),
    date: formData.get("date"),
    time: formData.get("time"),
    duration_hours: formData.get("duration_hours"),
    duration_minutes: formData.get("duration_minutes"),
    timezone: formData.get("timezone"),
    // host: formData.get('host'),
    participants: formData.get("participants"),
    agenda: formData.get("agenda"),
  };

  if (
    !meetingDetails.topic ||
    !meetingDetails.agenda ||
    !meetingDetails.date ||
    !meetingDetails.time ||
    !meetingDetails.duration_hours ||
    !meetingDetails.duration_minutes || 
    !meetingDetails.meetingType  ) {
    alert("Missing required meeting details.");
    return;
  }

  const startTime = new Date(
    `${meetingDetails.date}T${meetingDetails.time}:00`
  );

  const formattedStartTime = startTime.toLocaleString("en-US", {
    month: "short", // Abbreviated month (e.g., Jun)
    day: "2-digit", // Two-digit day (e.g., 19)
    year: "numeric", // Full year (e.g., 2020)
    hour: "2-digit", // Two-digit hour (e.g., 07)
    minute: "2-digit", // Two-digit minute (e.g., 00)
    hour12: true, // 12-hour format (e.g., PM)
  });

  const finalFormattedTime = formattedStartTime.replace(/, (\d{4}),/, ", $1");

  const duration_minutes =
    parseInt(meetingDetails.duration_hours) * 60 +
    parseInt(meetingDetails.duration_minutes);
  const duration_in_ms = duration_minutes * 60 * 1000; // Convert to milliseconds

  // Ensure participants are valid
  const participantEmails = meetingDetails.participants.split(",").map((email) => email.trim());
  if (participantEmails.some((email) => !validateEmail(email))) {
    alert("One or more email addresses are invalid.");
    return;
  }

  const zuid = await getZuid();
  if (!zuid) {
    alert("Unable to fetch ZUID.");
    return;
  }

  // Prepare data to send to the server
  const meetingData = {
    session: {
      topic: meetingDetails.topic,
      agenda: meetingDetails.agenda,
      presenter: zuid,
      startTime: finalFormattedTime,
      duration: duration_in_ms,
      timezone: meetingDetails.timezone,
      participants: participantEmails.map((email) => ({ email })), 
    },
  };

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const meetingKey = urlParams.get("meetingKey");

    const endpoint = meetingKey ? "/auth/updatemeeting" : "/auth/schedulingmeeting";
    const method = meetingKey ? "put" : "post";

    const response = await axios[method](endpoint, {
      session: meetingData,
      meetingKey: meetingKey,
    });
    
    if (response.status === 200) {
      if (meetingKey) {
        alert("Meeting Scheduled Successfully!");
        window.location.href=`/html/meeting/meetingDetails.html?meetingKey=${meetingKey}`;
      } else {
        const newMeetingKey = response.data.session.meetingKey;        
        window.location.href=`/html/meeting/meetingDetails.html?meetingKey=${newMeetingKey}`;
      }
    } else {
      console.error("Failed to schedule meeting:", response.data);
      alert("Failed to schedule meeting with Zoho.");
    }
  } catch (error) {
    console.error("Error scheduling the meeting:", error);
  }
}

document.getElementById("scheduleMeetingForm").addEventListener("submit", scheduleMeeting);

// Email validation function
function validateEmail(email) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
}

// Function to set the current date, time, and duration
function initializeForm() {
  // Set the current date
  const dateInput = document.getElementById("date");
  const currentDate = new Date().toISOString().split("T")[0]; // This will output "2024-12-09"
  dateInput.value = currentDate;

  // Set the time to 1 hour later and rounded to the next full hour
  const timeInput = document.getElementById("time");
  const currentTime = new Date();
  currentTime.setHours(currentTime.getHours() + 1);
  currentTime.setMinutes(0);
  currentTime.setSeconds(0);
  currentTime.setMilliseconds(0);

  const hours = currentTime.getHours().toString().padStart(2, "0");
  const minutes = currentTime.getMinutes().toString().padStart(2, "0");
  timeInput.value = `${hours}:${minutes}`;

  // Set the default duration to 1 hour and 00 minutes
  document.getElementById("duration-hours").value = 1;
  document.getElementById("duration-minutes").value = 0;
}

async function fetchMeetingDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const meetingKey = urlParams.get("meetingKey");

  // if (!meetingKey) {
  //     alert('Meeting key is missing');
  //     return;
  // }

  try {
    const response = await fetch(`/auth/getmeetingdetails?meetingKey=${meetingKey}`);
    const meetingData = await response.json();

    populateForm(meetingData.data.session);
  } catch (error) {
    console.error("Error fetching meeting data:", error);
  }
}
function populateForm(meetingDetails) {
  if (!meetingDetails) return;

  document.getElementById("title").value = meetingDetails.topic || "";
  document.getElementById("agenda").value = meetingDetails.agenda || "";
  document.getElementById("zone").value = meetingDetails.timeZoneOriginal || "";  

}
document.addEventListener("DOMContentLoaded", function () {
  initializeForm(); //function to set date, time, and duration
  fetchMeetingDetails();
});
