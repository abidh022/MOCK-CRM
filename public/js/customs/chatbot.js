 // Define the custom element <chat-widget>
 class ChatWidget extends HTMLElement {
    constructor() {
      super();
      
      const shadow = this.attachShadow({mode: 'open'});

      const container = document.createElement('div');
      container.id = 'chat-container';

      shadow.appendChild(container);

      // Create and insert the Tawk.to script dynamically into the shadow DOM
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = `
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function() {
          var s1 = document.createElement('script'), s0 = document.getElementsByTagName('script')[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/6776702249e2fd8dfe019c7b/1igjac208';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `;
      
      shadow.appendChild(script);
    }
  }

  // Register the custom element with the tag name 'chat-widget'
  customElements.define('chat-widget', ChatWidget);