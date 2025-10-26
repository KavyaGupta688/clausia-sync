// Background script for Clausia Chrome Extension
let complianceIssues = [];

// Listen for cookie changes
chrome.cookies.onChanged.addListener((changeInfo) => {
  if (!changeInfo.removed) {
    const cookie = changeInfo.cookie;
    
    // Check for compliance issues
    if (!cookie.secure && cookie.domain.startsWith('.')) {
      complianceIssues.push({
        type: 'cookie',
        severity: 'high',
        title: 'Insecure Third-Party Cookie',
        description: `Cookie "${cookie.name}" is not secure but set across domains`,
        timestamp: Date.now()
      });
    }

    // Check for missing SameSite
    if (!cookie.sameSite || cookie.sameSite === 'no_restriction') {
      complianceIssues.push({
        type: 'cookie',
        severity: 'medium',
        title: 'Missing SameSite Attribute',
        description: `Cookie "${cookie.name}" lacks proper SameSite protection`,
        timestamp: Date.now()
      });
    }
  }
});

// Listen for web requests to detect tracking
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    const url = new URL(details.url);
    
    // Check for common analytics/tracking domains
    const trackingDomains = [
      'google-analytics.com',
      'facebook.com',
      'doubleclick.net',
      'googletagmanager.com'
    ];

    if (trackingDomains.some(domain => url.hostname.includes(domain))) {
      complianceIssues.push({
        type: 'tracking',
        severity: 'medium',
        title: 'Third-Party Tracking Detected',
        description: `Request to ${url.hostname} - ensure this is disclosed in privacy policy`,
        timestamp: Date.now()
      });
    }
  },
  { urls: ["<all_urls>"] }
);

// Store issues in chrome.storage
chrome.storage.local.set({ complianceIssues });

// Listen for messages from devtools
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getIssues') {
    chrome.storage.local.get(['complianceIssues'], (result) => {
      sendResponse({ issues: result.complianceIssues || [] });
    });
    return true;
  } else if (request.action === 'clearIssues') {
    complianceIssues = [];
    chrome.storage.local.set({ complianceIssues: [] });
    sendResponse({ success: true });
  }
});
