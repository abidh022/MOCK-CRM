function updateTimeAndDate() {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const day = currentTime.toLocaleDateString("en-US", { weekday: 'long',day: 'numeric', year: 'numeric', month: 'long',  });
    
    // Format
    const timeString = `${hours % 12 || 12}:${minutes < 10 ? '0' + minutes : minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
    
    let icon;
    if (hours >= 5 && hours < 12) {
        icon = "🌅"; 
    } else if (hours >= 12 && hours < 17) { 
        icon = "🌞";
    } else if (hours >= 17 && hours < 19) { 
        icon = "🌇"; 
    } else { 
        icon = "🌙";
    }
    
    const currentTimeElement = document.getElementById("currentTime");
    if (!currentTimeElement.classList.contains("fade-in")) {
        currentTimeElement.classList.add("fade-in");
    }
    currentTimeElement.innerHTML = `
        <div class="icon">${icon}</div>
        <div class="time">${timeString}</div>
        <div class="date">${day}</div>
    `;
}
updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);



document.getElementById("getaccesstoken").onclick = function() {
    const clientId = "1000.S610TJ281EO27RRU7M6P0EQJ50ADLT";  // Your Zoho client ID
    const redirectUri = "https://mock-crm.vercel.app/auth";  // Your redirect URI
    const scope = "ZohoCRM.users.READ,ZohoCRM.modules.ALL,ZohoMeeting.manageOrg.READ,ZohoCRM.org.READ,ZohoMeeting.meeting.ALL,ZohoMeeting.meeting.CREATE,ZohoMeeting.meeting.READ,ZohoMeeting.meeting.DELETE";
    const responseType = "code";  
    const accessType = "offline"; 
    const loc = process.env.ZOHO_REGION === 'IN' ? ".in" : ".com";  // Choose .in for 'IN' or .com for others
  
    const authUrl = `https://accounts.zoho${loc}/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=${responseType}&access_type=${accessType}&redirect_uri=${redirectUri}`;    
    window.location.href = authUrl;
  };

    