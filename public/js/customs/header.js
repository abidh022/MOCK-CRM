{/* <custom-header></custom-header>
<script src="./../../js/customs/header.js"></script> */}

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
                <li><a href="#" id="contacts">Contacts</a></li>
                <li><a href="#" id="accounts">Accounts</a></li>
                <li><a href="./deals/deal.html">Deals</a></li>
                <li><a href="#" id="meeting">Meetings</a></li>
                
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

nav ul li.crm a::before {
    content: "";
    display: inline-block;
    width: 25px;
    height: 25px;
    background-image: url('/assets/crmlogo.png');
    background-size: cover;
    vertical-align: middle;
}

nav ul li a:hover::after {
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

nav ul li a:hover {
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

        `;
        const fontAwesomeLink = document.createElement('link');
        fontAwesomeLink.setAttribute('rel', 'stylesheet');
        fontAwesomeLink.setAttribute('href', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
        shadow.appendChild(fontAwesomeLink);
        shadow.appendChild(style);
    }

    connectedCallback() {
        // this.shadowRoot.querySelector('#home').addEventListener('click', this.navigate.bind(this, 'home'));
        

    }

}

customElements.define('custom-header', Header);


