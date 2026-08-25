/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect } from 'react';
import $ from 'jquery';
import 'magnific-popup/dist/magnific-popup.css';
import 'magnific-popup/dist/jquery.magnific-popup.js';

// Extend jQuery types to include magnificPopup
declare global {
  interface JQuery {
    magnificPopup(options?: any): JQuery;
  }
  interface JQueryStatic {
    magnificPopup?: any;
  }
}


// Type assertion for jQuery's magnificPopup method

const VideoModal = () => {
  useEffect(() => {
    if ($('.video-popup').length && $.magnificPopup) {
      ($('.video-popup') as any).magnificPopup({
        type: 'iframe',
        iframe: {
          markup: '<div class="mfp-iframe-scaler">' +
            '<button title="Close (Esc)" type="button" class="mfp-close">×</button>' +
            '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
            '</div>',
          patterns: {
            mp4: {
              index: 'https://rrdevs.net/project-video/',
              id: function (url: string) {
                return url;
              },
              src: '%id%'
            }
          }
        },
        preloader: true,
        removalDelay: 300,
        mainClass: 'mfp-fade'
      });
    }
  }, []); // Empty dependency array ensures it runs once on mount

  return (
    <a href="https://rrdevs.net/project-video/group-meeting.mp4" className="video-popup btn-circle">
      <i className="fa-solid fa-play"></i>
    </a>
  );
};

export default VideoModal;