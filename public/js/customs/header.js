// {/* <custom-header></custom-header>
// <script src="./../../js/customs/header.js"></script> */}

class Header extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const header = document.createElement('header');
        header.innerHTML = `
        <nav>
            <ul class="main-nav">
                <li class="crm"><a href="#" id="crm">CRM</a></li>
                <li><a href="/index.html" id="home">Home</a></li>
                <li><a href="/html/leads/leadshome.html" id="leads">Leads</a></li>
                <li><a href="/html/contacts/contactHome.html" id="contacts">Contacts</a></li>
                <li><a href="/html/accounts/accountsHome.html" id="accounts">Accounts</a></li>
                <li><a href="/html/deals/dealsHome.html" id="deals">Deals</a></li>
                <li><a href="/html/meeting/meetingHome.html" id="meeting">Meetings</a></li>
                <li><a href="/html/mail/mailHome.html" id="mail">Mail</a></li>

            </ul>
            <ul class="nav-icons">
                <li><a href="#" id="search" title="Search"><i class="fas fa-search"></i></a></li>
                <li><a href="#" id="profile" title="Profile"><i class="fas fa-user-circle"></i></a></li>
                <li><a href="#" id="notifications" title="Notifications"><i class="fas fa-bell"></i></a></li>
                <li><a href="#" id="settings" title="Settings"><i class="fas fa-cogs"></i></a></li>
                <li><a href="#" id="calendar" title="Calendar"><i class="fas fa-calendar-alt"></i></a></li>
            </ul>
        </nav>
        `;

        shadow.appendChild(header);
        const style = document.createElement('style');
        style.textContent = `
        header {
            background: #313949;
            color: white;
            height: 50px;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 10px;
        }

        nav ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
        }

        nav ul.main-nav {
            flex-grow: 1;
            justify-content: flex-start;
        }

        nav ul.nav-icons {
            justify-content: flex-end;
            align-items: center;
        }

        nav ul li {
            padding: 0 10px;
        }

        nav ul li a {
            color: white;
            text-decoration: none;
            position: relative;
            font-family: sans-serif;
        }

        #crm{
        font-size:17px;
        }
        
        nav ul li.crm a::before {
            content: "";
            display: inline-block;
            width: 32px;
            height: 32px;
            background-image: url('/assets/crmlogo.png');
            background-size: cover;
            vertical-align: middle;
        }

        nav ul li a:hover::after, nav ul li.active a::after {
            content: "";
            position: absolute;
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: white;
            transform: scaleX(1);
            transition: transform 0.3s ease-in-out;
            
        }


        nav ul li a:hover, nav ul li.active a {
            padding-bottom: 3px; 
        }

        nav ul li a::after {
            content: "";
            bottom: -5px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: white;
            transform: scaleX(0);
            transition: transform 0.3s ease-in-out;
        }

        nav ul.nav-icons li a {
            color: white;
            font-size: 18px;
        }

        nav ul.nav-icons li a:hover {
            color: #585854;
        }
        nav ul li.crm a,
        nav ul li.crm span {
            pointer-events: none; /* Make it non-clickable */
            color: white; /* Ensure the text color stays white */
            text-decoration: none; /* Remove any underline */
        }

        nav ul li.crm:hover::after,
        nav ul li.crm.active::after {
            content: none; /* Ensure no hover effect or underline appears */
        }
        `;
        
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.setAttribute('rel', 'stylesheet');
        fontAwesomeLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        shadow.appendChild(fontAwesomeLink);
        shadow.appendChild(style);
    }

    connectedCallback() {
        // Check current URL and highlight the active link
        const currentPath = window.location.pathname;

        // Remove active class from all links first
        const navLinks = this.shadowRoot.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });

        // Add active class to the link corresponding to the current page
        if (currentPath.includes('/index.html')) {
            this.shadowRoot.querySelector('#home').parentElement.classList.add('active');
        } else if (currentPath.includes('/html/leads/')) {  // Check if the URL includes '/leads/'
            this.shadowRoot.querySelector('#leads').parentElement.classList.add('active');
        } else if (currentPath.includes('/html/contacts/')) {
            this.shadowRoot.querySelector('#contacts').parentElement.classList.add('active');
        } else if (currentPath.includes('/html/accounts/')) {
            this.shadowRoot.querySelector('#accounts').parentElement.classList.add('active');
        } else if (currentPath.includes('/html/deals/')) {
            this.shadowRoot.querySelector('#deals').parentElement.classList.add('active');
        } else if (currentPath.includes('/html/meeting/')) {
            this.shadowRoot.querySelector('#meeting').parentElement.classList.add('active');
        }

        // this.shadowRoot.querySelector("#mail").onclick = function() {
        //     const clientId = "1000.Z4UWL3MAKX12X6WX4VGIQF51TPWV1Z";  // Your Zoho client ID
        //     const redirectUri = "http://localhost:5000/auth";  // Your redirect URI
        //     const scope = "ZohoCRM.users.READ,ZohoCRM.modules.ALL,ZohoMeeting.manageOrg.READ,ZohoCRM.org.READ,ZohoMeeting.meeting.ALL,ZohoMeeting.meeting.CREATE,ZohoMeeting.meeting.READ,ZohoMeeting.meeting.DELETE";
        //     const responseType = "code";  
        //     const accessType = "offline"; 

        //     const authUrl = `https://accounts.zoho.in/oauth/v2/auth?scope=${scope}&client_id=${clientId}&response_type=${responseType}&access_type=${accessType}&redirect_uri=${redirectUri}`;    
        //     window.location.href = authUrl;
        // };
    }
}

customElements.define('custom-header', Header);

