import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

// dynamically change head title
document.title = environment.appTitle;

if (environment.production) {
    enableProdMode();
}

if (environment.showFeedback) {
    const script = document.createElement('script');
    const userBackElement = document.createTextNode(`
          Userback = window.Userback || {};
          Userback.access_token = '1915|18757|K7w3HKMNyrvdvpdryY9RVATTfJS8TFNDMkHu5thDUMRqc4RL20';

          (function(id) {
              if (document.getElementById(id)) {return;}
              var s = document.createElement('script');
              s.id = id;
              s.async = 1;
              s.src = 'https://static.userback.io/widget/v1.js';
              var parent_node = document.head || document.body;
              parent_node.appendChild(s);
          })('userback-sdk');`);
    script.appendChild(userBackElement);
    document.head.appendChild(script);
}

if(environment.cookie.cookie_lib === 'acceptio'){
    //That mean we are using accept.io
    const scriptIo = document.createElement('script');
    const acceptIo = document.createTextNode(`
        window.axeptioSettings = {
            clientId : "6013e5b14b0e005e71e97c5b",
            userCookiesDomain: "${environment.cookie.domain}",
            userCookiesDuration : 182
        };

        (function(d, s) {
        var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
        e.async = true; e.src = "//static.axept.io/sdk.js";
        t.parentNode.insertBefore(e, t);
        })(document, "script");
    `);
    scriptIo.appendChild(acceptIo);
    document.head.appendChild(scriptIo);
}

platformBrowserDynamic().bootstrapModule(AppModule).catch((err) => console.error(err));
