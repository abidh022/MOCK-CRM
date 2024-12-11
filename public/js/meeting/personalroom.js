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

  function copyLink() {
    const link = document.querySelector('a[href="https://meet.zoho.com/aAVxjSgwGZ"]');
    const tempInput = document.createElement("input");
    tempInput.value = link.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Link copied to clipboard!");
}