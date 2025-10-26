// Panel script for displaying compliance issues
function refreshIssues() {
  chrome.runtime.sendMessage({ action: 'getIssues' }, (response) => {
    if (response && response.issues) {
      displayIssues(response.issues);
    }
  });
}

function clearIssues() {
  chrome.runtime.sendMessage({ action: 'clearIssues' }, () => {
    refreshIssues();
  });
}

function displayIssues(issues) {
  const issuesList = document.getElementById('issues-list');
  const criticalCount = document.getElementById('critical-count');
  const highCount = document.getElementById('high-count');
  const mediumCount = document.getElementById('medium-count');

  // Count by severity
  const counts = { critical: 0, high: 0, medium: 0 };
  issues.forEach(issue => {
    if (issue.severity in counts) {
      counts[issue.severity]++;
    }
  });

  criticalCount.textContent = counts.critical;
  highCount.textContent = counts.high;
  mediumCount.textContent = counts.medium;

  if (issues.length === 0) {
    issuesList.innerHTML = `
      <div class="empty-state">
        <p>No compliance issues detected yet.</p>
        <p style="font-size: 12px; margin-top: 8px;">Browse your site and interact with it to start monitoring.</p>
      </div>
    `;
    return;
  }

  issuesList.innerHTML = issues.map(issue => `
    <div class="issue ${issue.severity}">
      <div class="issue-title">${issue.title}</div>
      <div class="issue-description">${issue.description}</div>
    </div>
  `).join('');
}

// Refresh issues every 2 seconds
setInterval(refreshIssues, 2000);

// Initial load
refreshIssues();
