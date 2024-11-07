// class HeaderBelowHeader extends HTMLElement {
//     constructor() {
//         super();

//         const shadow = this.attachShadow({mode : 'open'});

//         const hbh = document.createElement('div');
//         hbh.innerHTML= `
//         <div id=recBox>
//                 <select class="selectBox">My Leads
//                     <option>My Leads</option>
//                     <option>  Public Views </option>
//                     <option>  All Leads </option>
//                     <option> All Locked Leads</option>
//                     <option>Converted Leads</option>
//                     <option> Junk Leads</option>
//                     <option> Mailing Labels</option>
//                     <option>My Converted Leads</option>
//                  </select>
//             <div id=createAndImport >
//                 <button id="createButton">Create Lead</button>
//                 <select id=selectt >
//                     <option class="hidden">select</option>
//                     <option  value="import-leads">import leads</option>
//                     <option  value="import-notes">import notes</option>
//                  </select>
//             </div>
            
//                  <select name="action" id='actionbtn'>
//                     <option value="" class="hidden">Actions</option>
//                     <option value="mass_delete">Mass Delete</option>
//                     <option value="mass_update">Mass Update</option>
//                     <option value="mass_convert">Mass Convert</option>
//                     <option value="manage_tags">Manage Tags</option>
//                     <option value="drafts">Drafts</option>
//                     <option value="mass_email">Mass Email</option>
//                     <option value="autoresponders">Autoresponders</option>
//                     <option value="approve_leads">Approve Leads</option>
//                     <option value="deduplicate_leads">Deduplicate Leads</option>
//                     <option value="add_to_campaigns">Add to Campaigns</option>
//                     <option value="create_client_script">Create Client Script</option>
//                     <option value="export_leads">Export Leads</option>
//                     <option value="zoho_sheet_view">Zoho Sheet View</option>
//                  </select>
//             </div>
//             <link rel="stylesheet" href="/css/custom/headerBelowheader.css">
//             </div>
//         `;

//         shadow.appendChild(hbh);

//     }

//     connectedCallback() {
//         this.shadowRoot.querySelector('#createButton').addEventListener('click', () => {
//             window.location.href = '/html/leads/createLead.html'; 
//         });
//     }
    
// }

// customElements.define('header-below-header', HeaderBelowHeader);

//     <div>
//         <h1>Lead List</h1>
//         <button id="sortCompanyAsc">Sort A-Z</button>
//         <button id="sortCompanyDesc">Sort Z-A</button>
//         <button id="sortDateAsc">Sort Date Asc</button>
//         <button id="sortDateDesc">Sort Date Desc</button>
//     </div>

    