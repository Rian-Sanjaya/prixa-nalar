import React from 'react';

interface ChatProps {
  vh: number;
}

export const Chat = (props: ChatProps): JSX.Element => {
  /* eslint-disable */
  const checkChatCreated = () => {
    if (document.getElementsByClassName('crisp-client').length) {
      document.getElementsByClassName('crisp-kquevr')[0] && document.getElementsByClassName('crisp-kquevr')[0].remove();
      
      // override z-index crisp
      document.getElementsByClassName('crisp-1rjpbb7')[0] && document
        .getElementsByClassName('crisp-1rjpbb7')[0]
        .setAttribute('style', 'z-index: 1');
        
      // hide search on helpdesk section
      document.getElementsByClassName('crisp-lgu84d')[0] && document
        .getElementsByClassName('crisp-lgu84d')[0]
        .setAttribute('style', `display: none !important;`);

      // prevent the chat text input area hidden under the below navigation bar on mobile phone (Android and iOS)
      document.getElementsByClassName('crisp-zyxrmn')[0] && document
        .getElementsByClassName('crisp-zyxrmn')[0]
        .setAttribute('style', `height: ${(props.vh * 100) - 64}px !important;`);

      // prevent chat text overlap over the right icon 
      if (/iPhone/.test(navigator.userAgent)) {
        document.getElementsByClassName('crisp-12w4w1a crisp-1aiychk crisp-14ixsrp crisp-9dgo7z')[0] && document
        .getElementsByClassName('crisp-12w4w1a crisp-1aiychk crisp-14ixsrp crisp-9dgo7z')[0]
        .setAttribute('style', `width: 285px !important;`);
      } else if (/Android/.test(navigator.userAgent)) {
        document.getElementsByClassName('crisp-12w4w1a crisp-1aiychk crisp-14ixsrp crisp-9dgo7z')[0] && document
        .getElementsByClassName('crisp-12w4w1a crisp-1aiychk crisp-14ixsrp crisp-9dgo7z')[0]
        .setAttribute('style', `width: 320px !important;`);
      } else {
        document.getElementsByClassName('crisp-12w4w1a crisp-1aiychk crisp-14ixsrp crisp-9dgo7z')[0] && document
        .getElementsByClassName('crisp-12w4w1a crisp-1aiychk crisp-14ixsrp crisp-9dgo7z')[0]
        .setAttribute('style', `width: 303px !important;`);
      }
      
      clearInterval(intervalCheckCreated);

      setTimeout(() => {
        if (document.getElementsByClassName('crisp-g5n37j')[0]) {
          document.getElementsByClassName('crisp-g5n37j')[0].scrollIntoView(false);
        }
      }, 1000);
      
      window.$crisp.push(["on", "message:sent", checkMessage]);
      window.$crisp.push(["on", "message:received", checkMessage]);
    }
  };

  function checkMessage() {
    document.getElementsByClassName('crisp-g5n37j')[0].scrollIntoView(false);
  };
  
  const intervalCheckCreated = setInterval(checkChatCreated, 100);

  React.useEffect(() => {
    if (localStorage.getItem('isVerified') === 'true' && localStorage.getItem('loginToken')) {
      const s = document.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      document.getElementsByTagName('head')[0].appendChild(s);
      checkChatCreated();
    }

    return () => {
      window.$crisp.push(["off", "message:sent"]);
      window.$crisp.push(["off", "message:received"]);
    }
  }, []);
  /* eslint-enable */

  return <div></div>;
};
