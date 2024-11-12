{/* <custom-loader></custom-loader> */}
{/* <script src="js/customs/loader.js"></script> */}

class Loader extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const loader = document.createElement('div');
        loader.innerHTML = `
        <div id="loader-container">
            <img src="/assets/zoho-zoholics.gif" alt="Zoho Logo" id="zoho-logo">
        </div>
        `;
        shadow.appendChild(loader);

        const style = document.createElement('style');
        style.textContent = `
        #loader-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100vw;
            padding-top: 50px;
            height: 100vh;
            background-color: rgba(255, 255, 255, 0.92);
        }

        #zoho-logo {
            width: 150px;
            animation: spinAndScale 2s infinite linear;
        }

        #content {
            display: none;
        }
        `;
        shadow.appendChild(style);
    }
}

customElements.define('custom-loader', Loader);

window.onload = function() {
    const loaderElement = document.querySelector('custom-loader').shadowRoot.querySelector('#loader-container');
    const contentElement = document.querySelector('custom-loader').shadowRoot.querySelector('#content');

    setTimeout(function() {
        loaderElement.style.display = 'none';
        contentElement.style.display = 'block';
    }, 1000);
};
