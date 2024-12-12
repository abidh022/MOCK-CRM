// const { default: axios } = require("axios");

document.getElementById('back').addEventListener('click', function() {
    window.location.replace('/html/meeting/myMeeting.html');
});

async function getMeetingDetails() {
    try {
        // Retrieve the meetingKey from the URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const meetingKey = urlParams.get('meetingKey');
        
        const response = await axios.get(`/auth/getmeetingdetails?meetingKey=${meetingKey}`);

        if (response.data && response.data.data) {
            const meetingDetails = response.data.data;
            console.log(meetingDetails);
            
            document.getElementById('meetingname').innerText = meetingDetails.session.topic || 'No Meeting Name';
            document.getElementById('startmeeting').addEventListener('click', function(event) {
                const link = meetingDetails.session.joinLink;
                if (!link) return alert('No meeting link available.');
                window.open(link,'_blank');
            });            
            document.getElementById('agendaText').innerText = meetingDetails.session.agenda || 'No Agenda Available';
            // console.log(meetingDetails.session.timeFormat);    
            const startDate = new Date(meetingDetails.session.startTime);
            const formattedStartDate = startDate.toLocaleString();
            const durationMinutes = meetingDetails.session.duration ? meetingDetails.session.duration / 60000 : 0;
            
            // document.getElementById('dateText').innerText = `Date and Time: ${formattedStartDate} (${durationMinutes} mins)`;
            document.getElementById('dateText').innerText = `Date and Time: ${meetingDetails.session.timeFormat} (${durationMinutes} mins)`;
            document.getElementById('timezone').innerText = meetingDetails.session.timezone || 'Not Available';
            document.getElementById('hostName').innerText = meetingDetails.session.presenterEmail || 'Host Not Available';
            document.getElementById('link').innerText = meetingDetails.session.joinLink || 'No Link Available';
            document.getElementById('link').setAttribute('href', meetingDetails.session.joinLink || '#');  
            document.getElementById('meetingId').innerText = meetingDetails.session.meetingKey || 'No Meeting ID';
            document.getElementById('password').innerText = meetingDetails.session.pwd || 'No Password';
            document.getElementById('copylink').setAttribute('data-clipboard-text', meetingDetails.session.joinLink);
            document.getElementById('analytics').querySelector('.text').innerText = 'View meeting analytics';

            document.getElementById('copylink').addEventListener('click', function() {
                const link = meetingDetails.session.joinLink || '';
                navigator.clipboard.writeText(link).then(() => alert('Link copied'));
            });
            
            document.getElementById('link').addEventListener('click', function(event) {
                const link = meetingDetails.session.joinLink;
                if (!link) return alert('No meeting link available.');
                window.open(link,'_blank');
            });

             // Check if the meeting has already started or not
             const currentTime = new Date();
             const meetingStartTime = new Date(meetingDetails.session.startTime);
             if (currentTime >= meetingStartTime) {
                 document.getElementById('edit').style.display = 'none';
             } else {
                 document.getElementById('edit').style.display = 'block';
             }
            
        } else {
            console.error('Meeting details are missing in the response.');
        }
    } catch (error) {
        console.error('Error fetching meeting details:', error);
    }
}
document.addEventListener("DOMContentLoaded", getMeetingDetails);


async function deleteMeeting() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const meetingKey = urlParams.get('meetingKey');
        
        if (!meetingKey) {
            throw new Error("Meeting Key is missing from the URL.");
        }

        const confirmDelete = confirm("Are you sure you want to delete this meeting?");
        if (!confirmDelete) return;

        const response = await axios.delete('/auth/deletemeeting', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: { meetingKey: meetingKey },
        });

        if (response.status === 200) {
            console.log('Meeting deleted successfully');
            alert('Meeting deleted successfully');
            window.location.replace('/html/meeting/myMeeting.html');
        } else {
            console.error('Failed to delete the meeting');
            alert('Failed to delete the meeting. Please try again later.');
        }
    } catch (error) {
        console.error('Error deleting meeting:', error.message);
        alert('Failed to delete the meeting. Please try again later.');
    }
}

document.getElementById("cancel").addEventListener("click", deleteMeeting);


document.getElementById("edit").addEventListener("click", async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const meetingKey = urlParams.get('meetingKey');

    if (!meetingKey) {
        alert('Meeting key is missing');
        return;
    }

    try {
        const response = await fetch(`/auth/getMeetingDetails?meetingKey=${meetingKey}`);
        const meetingData = await response.json();

        console.log(meetingData);

        window.location.href = `/html/meeting/schedule.html?meetingKey=${meetingKey}`;

    } catch (error) {
        console.error('Error fetching meeting data:', error);
    }
});