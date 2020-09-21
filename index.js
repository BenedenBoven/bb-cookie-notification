export default class CookieNotifictation {

    constructor() {
        let defaults = {
            privacyPage:     '/privacyverklaring',
            backgroundColor: 'rgba(0,0,0,0.8)',
            validForDays:    90,
            agreeButtonText: 'Akkoord',
            targetBlank:     false,
            closeIcon:       '<i class="fas fa-times"></i>'
        };

        if(arguments[0] && typeof arguments[0] === 'object') {
            this.options = this.extendDefaults(defaults, arguments[0]);
        } else {
            this.options = defaults;
        }

        if(typeof this.options.content === 'undefined') {
            this.options.content = 'Wij gebruiken <a href="' + this.options.privacyPage + '"' + ((this.options.targetBlank) ? ' target="_blank"' : '') + '>cookies</a>.';
        }

        this.open();
    }

    open() {
        if(this.getCookie() === null) {
            this.build();
        }
    }

    getCookie() {
        let nameEquals = 'BenedenBovenCookieConsent=';
        let ca         = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while(c.charAt(0) === ' ') c = c.substring(1, c.length);
            if(c.indexOf(nameEquals) === 0) return c.substring(nameEquals.length, c.length);
        }
        return null;
    }

    setCookie(validForDays) {
        let expires = "";
        let value   = true;
        if(validForDays) {
            let date = new Date();
            date.setTime(date.getTime() + (validForDays * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = "BenedenBovenCookieConsent=" + (value || "") + expires + "; path=/";
        this.close();
    }

    close() {
        document.getElementById('benedenBovenCookieNotification').remove();
    }

    build() {
        let documentFragment                    = document.createDocumentFragment();
        this.notification                       = document.createElement('div');
        this.notification.className             = 'benedenBovenCookieNotification';
        this.notification.id                    = 'benedenBovenCookieNotification';
        this.notification.style.backgroundColor = this.options.backgroundColor;
        this.notification.style.position        = 'fixed';
        this.notification.style.left            = '50%';
        this.notification.style.transform       = 'translateX(-50%)';
        this.notification.style.whiteSpace      = 'nowrap';
        this.notification.style.overflow        = 'hidden';
        this.notification.style.textAlign       = "center";
        this.notification.style.zIndex          = '99999';
        this.notification.style.bottom          = '15px';
        this.notification.style.padding         = '8px 15px';
        this.notification.style.color           = '#fff';
        this.notification.style.fontSize        = '11px';
        this.notification.innerHTML             = this.options.content;

        this.closeButton                     = document.createElement('span');
        this.closeButton.className           = 'closeBenedenBovenNotification';
        this.closeButton.innerHTML           = this.options.agreeButtonText;
        this.closeButton.style.marginLeft    = '15px';
        this.closeButton.style.cursor        = 'pointer';
        this.closeButton.style.textTransform = 'uppercase';
        this.closeButton.style.fontWeight    = 'bold';

        this.notificationIcon                  = document.createElement('span');
        this.notificationIcon.className        = 'benedenBovenNotificationIcon';
        this.notificationIcon.innerHTML        = this.options.closeIcon;
        this.notificationIcon.style.marginLeft = '5px';

        let validForDays = this.options.validForDays;

        const that = this;
        this.closeButton.addEventListener("click", function() {
            that.setCookie(validForDays);
        });
        this.closeButton.appendChild(this.notificationIcon);
        this.notification.appendChild(this.closeButton);

        documentFragment.appendChild(this.notification);
        document.body.appendChild(documentFragment);
    }

    extendDefaults(source, properties) {
        let property;
        for(property in properties) {
            if(properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }
}