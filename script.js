/**
 * Firefox Add-on Script: Prevents clicks at the bottom of the screen from
 * triggering scrolls while in fullscreen/theater mode.
 * Author: Soham Chatterjee
 * Last Updated: 2024-11-19
 * Description: Blocks clicks within 54px from the bottom in fullscreen/theater
 * mode, unless they are on control elements (like play, pause, volume).
 */

(function () {
  'use strict';

  if (!window.location.href.includes("youtube.com")) {
    return;
  }

  let bottomBar = null;

  function updateBottomBar() {
    bottomBar = document.querySelector('.ytp-chrome-bottom');
  }

  function isClickOnControl(target) {
    if (!bottomBar) return false;
    return bottomBar.contains(target);
  }

  function handleClick(event) {
    if (!document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement) {
      return;
    }

    if (!bottomBar) {
      updateBottomBar();
      if (!bottomBar) {
        return;
      }
    }

    const bottomBarRect = bottomBar.getBoundingClientRect();
    const clickY = event.clientY;

    // If the click is within the bottom bar area
    if (clickY >= bottomBarRect.top) {
      // If the click is not on a control, prevent default action
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
      updateBottomBar();
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