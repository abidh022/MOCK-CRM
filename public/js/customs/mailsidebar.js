class SidebarNav extends HTMLElement {
        constructor() {
            super();

            // Attach shadow DOM
            const shadow = this.attachShadow({ mode: 'open' });

            // Create the sidebar structure
            shadow.innerHTML = `
                <style>
                    .nav {
                        display: flex;
                        background-color: #242933;

                    }
                    #sidebarapps {
                        background-color: #242933;
                        width: 5%;
                        height: 91.8vh;
                    }
                    #sidebarapps img {
                        width: 25px;
                        height: 25px;
                        margin-top: 5px;
                    }
                    #sidebarapps a {
                        color: white !important;
                        font-size: 11px;
                        margin-left: 2px;
                        margin-top: 5px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        text-decoration: none;
                        opacity: 0.8;
                    }
                    #sidebarapps a:hover {
                        opacity: 1.1;
                    }
                    .apptext {
                        font-size: 11px;
                        text-decoration: none;
                        font-family: "Lato 2", "Segoe UI", "Roboto", "Ubuntu", "Cantarell", "Noto Sans", sans-serif;
                        margin-top: 2px;
                        text-align: center;
                    }
                    .navigaionNames {
                        display: flex;
                        flex-direction: column;
                        background-color: #242933;
                        width: 10%;
                        height: 91.8vh;
                        margin-left: 1.5%;
                    }
                    button {
                        margin-top: 10px;
                        background-color: #242933;
                        text-align: start;
                        color: white;
                        
                    }
                    #navheader {
                        color: #5E93FF;
                    }
                </style>
                <div class="nav">
                    <div id="sidebarapps">
                        <a href="/html/mail/mailHome.html">
                            <img src="/assets/mailapp.png" alt="Mail">
                            <p class="apptext">Mail</p>
                        </a>
                        <a href="/calendarpage.html">
                            <img src="/assets/calendarapp.png" alt="Calendar">
                            <p class="apptext">Calendar</p>
                        </a>
                        <a href="/todopage.html">
                            <img src="/assets/todoapp.png" alt="To Do">
                            <p class="apptext">To Do</p>
                        </a>
                        <a href="/notespage.html">
                            <img src="/assets/notesapp.png" alt="Notes">
                            <p class="apptext">Notes</p>
                        </a>
                        <a href="/contactspage.html">
                            <img src="/assets/contactsapp.jpg" alt="Contacts">
                            <p class="apptext">Contacts</p>
                        </a>
                        <a href="/bookmarkspage.html">
                            <img src="/assets/bookmarkapp.png" alt="Bookmarks">
                            <p class="apptext">Bookmarks</p>
                        </a>
                    </div>
                    <div class="navigaionNames">
                        <p id="navheader">Folders</p>
                        <button id="inbox">Inbox</button>
                        <button id="draft">Draft</button>
                        <button id="templates">Templates</button>
                        <button id="snoozed">Snoozed</button>
                        <button id="sent">Sent</button>
                        <button id="spam">Spam</button>
                        <button id="trash">Trash</button>
                        <button id="outbox">Outbox</button>
                        <button id="newslatter">Newsletter</button>
                        <button id="notification">Notification</button>
                    </div>
                </div>
            `;
        }
    }

    // Define the custom element
    customElements.define('sidebar-nav', SidebarNav);