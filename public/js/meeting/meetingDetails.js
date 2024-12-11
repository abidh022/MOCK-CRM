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


// async function updatemeeting() {
//     try {
//         const urlParams = new URLSearchParams(window.location.search);
//         const meetingKey = urlParams.get('meetingKey');

//         // Collect updated details from the form (assuming you have input fields for topic, agenda, etc.)
//         const form = document.getElementById("updateMeetingForm");
//         if (!form) {
//             throw new Error('Form element not found');
//         }

//         const formData = new FormData(form);
//         const meetingDetails = {
//             topic: formData.get('topic'),
//             agenda: formData.get('agenda'),
//             presenter: formData.get('presenter'),
//             startTime: formData.get('startTime'),
//             duration: formData.get('duration'),
//             timezone: formData.get('timezone'),
//             participants: formData.get('participants')
//         };
        
//     } catch (error) {
//         console.error('Error updating meeting:', error.message);
//         alert('Failed to update the meeting. Please try again later.');
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     document.getElementById("edit").addEventListener("click", updatemeeting);
// });


// async function updatemeeting() {
//     try{
//         const urlParams = new URLSearchParams(window.location.search);
//         const meetingKey = urlParams.get('meetingKey');

//         const response = await axios.put('/auth/updatemeeting',{
//             headers: {
//                 'Content-type': 'application/json',
//             },
//             data:{
//                 meetingKey : meetingKey },
//             });
//             if (response.status === 200){
//                 console.log('Meeting Updated successfully');
//                 alert('Meeting updated successfully');
//                 // window.location.replace('html/')
//             }
//     }catch (error){
//         console.error('Error updating meeting:', error.message);
//         alert('Failed to updating the meeting. Please try again later.');
//     }
// }

// document.getElementById("edit").addEventListener("click", updatemeeting);

// document.getElementById("edit").addEventListener("click", async function() {
//     // Get the meetingKey from the URL query params
//     const urlParams = new URLSearchParams(window.location.search);
//     const meetingKey = urlParams.get('meetingKey');

//     // Check if meetingKey is present
//     if (!meetingKey) {
//         alert('Meeting key is missing from the URL.');
//         return;
//     }

//     try {
//         // Fetch meeting details using the meetingKey
//         const meetingData = await fetchMeetingDetails(meetingKey);

//         if (meetingData) {
//             // Store the meeting data in localStorage for use on the schedule page
//             localStorage.setItem('meetingData', JSON.stringify(meetingData));
//             window.location.href = '/html/meeting/schedule.html';  // Adjust the path as necessary
//         } else {
//             alert('Failed to fetch meeting details.');
//         }
//     } catch (error) {
//         console.error('Error fetching meeting details:', error);
//         alert('An error occurred while fetching meeting details.');
//     }
// });

    // // Function to fetch meeting details from the server
    // async function fetchMeetingDetails(meetingKey) {
    //     try {
    //         const response = await axios.get(`/auth/getMeetingDetails/${meetingKey}`);  // Adjust the URL as necessary
    //         return response.data;  // Assuming the data is returned in response.data
    //     } catch (error) {
    //         console.error('Error fetching meeting details:', error);
    //         return null;
    //     }
    // }


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