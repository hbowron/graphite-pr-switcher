chrome.commands.onCommand.addListener(runCommand);

async function runCommand(command) {
  if (command === "toggle") {
    toggleTab();
  }
}

async function toggleTab() {
  getCurrentTab().then(tab => {
    if (tab) {
      const githubRegEx = /https:\/\/github.com\/([^\s]+)\/([^\s]+)\/pull\/([\d]+)/i;
      const githubUrl = [...tab.url.match(githubRegEx)];
      if (githubUrl.length === 4) {
        openGraphiteTab(githubUrl[1], githubUrl[2], githubUrl[3]);
      }
    }
  });
}

async function openGraphiteTab( owner, repo, prNumber ) {
  chrome.tabs.create({
    url: `https://app.graphite.dev/github/pr/${owner}/${repo}/${prNumber}`,
    active: true
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
