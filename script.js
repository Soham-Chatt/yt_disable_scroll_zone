/**
 * Firefox Add-on Script: Prevents clicks at the bottom of the screen from
 * triggering scrolls while in fullscreen.
 * Author: Soham Chatterjee
 * Last Updated: 2024-10-26
 * Description: Blocks clicks within 54px from the bottom in fullscreen mode,
 * unless they are on control elements (like play, pause, volume).
 */

(function () {
  'use strict';

  // Pixels from the bottom where clicks are blocked
  const BOTTOM_CLICK_THRESHOLD = 54;

  // Elements that are considered controls and not blocked
  const CONTROL_SELECTORS = [
    // Left Controls
    '.ytp-play-button',
    '.ytp-next-button',
    '.ytp-mute-button',
    '.ytp-volume-slider',
    '.ytp-time-display',

    // Right Controls
    '.ytp-fullerscreen-edu-button',
    '.ytp-autonav-toggle-button',
    '.ytp-subtitles-button',
    '.ytp-settings-button',
    '.ytp-fullscreen-button',

    // Other
    '.ytp-progress-list'
    // If you have any other controls due to plugins, add them here
  ];

  function isClickOnControl(target) {
    return CONTROL_SELECTORS.some(selector => target.closest(selector));
  }

  function handleClick(event) {
    if (!document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement) {
      return;
    }

    const clickY = event.clientY;
    if (clickY >= (window.innerHeight - BOTTOM_CLICK_THRESHOLD)) {
      if (!isClickOnControl(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }
  }

  function addClickListener() {
    window.addEventListener('click', handleClick, true);
  }

  function removeClickListener() {
    window.removeEventListener('click', handleClick, true);
  }

  function onFullscreenChange() {
    const isFullscreen = document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;

    if (isFullscreen) {
      addClickListener();
    } else {
      removeClickListener();
    }
  }

  document.addEventListener("fullscreenchange", onFullscreenChange);
  document.addEventListener("webkitfullscreenchange", onFullscreenChange);
  document.addEventListener("mozfullscreenchange", onFullscreenChange);
  document.addEventListener("msfullscreenchange", onFullscreenChange);

})();