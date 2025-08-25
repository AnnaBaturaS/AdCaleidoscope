/**
 * MRAID Mock Implementation for Creative OS Sandbox
 * Provides basic MRAID API functionality for testing playable ads
 */

(function() {
  'use strict';

  const MRAID_VERSION = '3.0';
  const PLACEMENT_TYPE = 'inline';
  
  let mraidState = 'loading';
  let placementType = PLACEMENT_TYPE;
  let isViewable = true;
  let isExpanded = false;
  let isSupported = {
    sms: false,
    tel: true,
    calendar: false,
    storePicture: false,
    inlineVideo: true,
    vpaid: false
  };
  
  let currentAppOrientation = {
    orientation: 'portrait',
    locked: false
  };
  
  let currentScreenSize = {
    width: window.screen.width,
    height: window.screen.height
  };
  
  let maxSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  let defaultPosition = {
    x: 0,
    y: 0,
    width: maxSize.width,
    height: maxSize.height
  };
  
  let currentPosition = defaultPosition;
  let expandProperties = maxSize;
  let resizeProperties = {};
  let orientationProperties = {
    allowOrientationChange: true,
    forceOrientation: 'none'
  };
  
  const listeners = {};
  const eventLog = [];
  
  function logEvent(event, data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      data,
      source: 'mraid'
    };
    
    eventLog.push(logEntry);
    
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'mraid_event',
        payload: logEntry
      }, '*');
    }
    
    console.log('[MRAID]', event, data);
  }
  
  function fireEvent(event, ...args) {
    logEvent(event, args);
    
    if (listeners[event]) {
      listeners[event].forEach(listener => {
        try {
          listener(...args);
        } catch (e) {
          console.error('[MRAID] Error in event listener:', e);
        }
      });
    }
  }
  
  const mraid = {
    getVersion() {
      return MRAID_VERSION;
    },
    
    addEventListener(event, listener) {
      if (typeof listener !== 'function') {
        throw new Error('Listener must be a function');
      }
      
      if (!listeners[event]) {
        listeners[event] = [];
      }
      
      listeners[event].push(listener);
      logEvent('addEventListener', { event });
    },
    
    removeEventListener(event, listener) {
      if (listeners[event]) {
        const index = listeners[event].indexOf(listener);
        if (index > -1) {
          listeners[event].splice(index, 1);
        }
      }
      logEvent('removeEventListener', { event });
    },
    
    open(url) {
      if (!url) {
        throw new Error('URL is required');
      }
      
      logEvent('open', { url });
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'mraid_open',
          payload: { url }
        }, '*');
      } else {
        window.open(url, '_blank');
      }
    },
    
    close() {
      logEvent('close');
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'mraid_close',
          payload: {}
        }, '*');
      }
      
      fireEvent('stateChange', 'hidden');
    },
    
    unload() {
      logEvent('unload');
      fireEvent('stateChange', 'hidden');
    },
    
    expand(url) {
      if (mraidState !== 'default') {
        throw new Error('Cannot expand from current state');
      }
      
      logEvent('expand', { url });
      
      isExpanded = true;
      mraidState = 'expanded';
      currentPosition = expandProperties;
      
      fireEvent('stateChange', mraidState);
      fireEvent('sizeChange', currentPosition.width, currentPosition.height);
    },
    
    getState() {
      return mraidState;
    },
    
    getPlacementType() {
      return placementType;
    },
    
    isViewable() {
      return isViewable;
    },
    
    playVideo(url) {
      if (!url) {
        throw new Error('Video URL is required');
      }
      
      logEvent('playVideo', { url });
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'mraid_playVideo',
          payload: { url }
        }, '*');
      }
    },
    
    resize() {
      if (mraidState !== 'expanded') {
        throw new Error('Cannot resize when not expanded');
      }
      
      logEvent('resize');
      fireEvent('sizeChange', resizeProperties.width, resizeProperties.height);
    },
    
    setExpandProperties(properties) {
      expandProperties = { ...expandProperties, ...properties };
      logEvent('setExpandProperties', properties);
    },
    
    getExpandProperties() {
      return expandProperties;
    },
    
    setResizeProperties(properties) {
      resizeProperties = { ...resizeProperties, ...properties };
      logEvent('setResizeProperties', properties);
    },
    
    getResizeProperties() {
      return resizeProperties;
    },
    
    getCurrentPosition() {
      return currentPosition;
    },
    
    getDefaultPosition() {
      return defaultPosition;
    },
    
    getMaxSize() {
      return maxSize;
    },
    
    getScreenSize() {
      return currentScreenSize;
    },
    
    supports(feature) {
      return isSupported[feature] || false;
    },
    
    setOrientationProperties(properties) {
      orientationProperties = { ...orientationProperties, ...properties };
      logEvent('setOrientationProperties', properties);
    },
    
    getOrientationProperties() {
      return orientationProperties;
    },
    
    getCurrentAppOrientation() {
      return currentAppOrientation;
    },
    
    useCustomClose(useCustom) {
      logEvent('useCustomClose', { useCustom });
      
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({
          type: 'mraid_useCustomClose',
          payload: { useCustom }
        }, '*');
      }
    },
    
    createCalendarEvent(parameters) {
      if (!isSupported.calendar) {
        throw new Error('Calendar events not supported');
      }
      
      logEvent('createCalendarEvent', parameters);
    },
    
    storePicture(url) {
      if (!isSupported.storePicture) {
        throw new Error('Store picture not supported');
      }
      
      logEvent('storePicture', { url });
    },
    
    // Custom methods for testing
    _simulate: {
      ready() {
        mraidState = 'default';
        setTimeout(() => {
          fireEvent('ready');
        }, 100);
      },
      
      viewableChange(viewable) {
        isViewable = viewable;
        fireEvent('viewableChange', viewable);
      },
      
      sizeChange(width, height) {
        currentPosition = { ...currentPosition, width, height };
        fireEvent('sizeChange', width, height);
      },
      
      orientationChange(orientation) {
        currentAppOrientation.orientation = orientation;
        fireEvent('orientationChange', orientation);
      },
      
      error(message, action) {
        fireEvent('error', message, action);
      }
    },
    
    _getEventLog() {
      return eventLog;
    },
    
    _clearEventLog() {
      eventLog.length = 0;
    }
  };
  
  // Make mraid available globally
  window.mraid = mraid;
  
  // Simulate environment
  setTimeout(() => {
    mraid._simulate.ready();
  }, 50);
  
  // Listen for window resize
  window.addEventListener('resize', () => {
    const newMaxSize = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    if (newMaxSize.width !== maxSize.width || newMaxSize.height !== maxSize.height) {
      maxSize = newMaxSize;
      
      if (!isExpanded) {
        currentPosition = { ...currentPosition, ...newMaxSize };
        fireEvent('sizeChange', newMaxSize.width, newMaxSize.height);
      }
    }
  });
  
  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      const orientation = window.orientation === 0 || window.orientation === 180 ? 'portrait' : 'landscape';
      mraid._simulate.orientationChange(orientation);
    }, 100);
  });
  
  console.log('[MRAID] Mock initialized, version', MRAID_VERSION);
  
})();