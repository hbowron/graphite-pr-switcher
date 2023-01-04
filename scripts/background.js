chrome.commands.onCommand.addListener(runCommand);

async function runCommand(command) {
  if (command === "toggle") {
    toggleTab();
  }
}

async function toggleTab() {
  getCurrentTab().then(tab => {
    if (tab) {
      console.log(`url: ${tab.url}`);

      const ghMatch = tab.url.match(/https:\/\/github.com\/(?<owner>[^\s]+)\/(?<repo>[^\s]+)\/pull\/(?<pr>[\d]+)/i);
      console.log(`gh match: ${ghMatch}`)
      if (ghMatch) {
        openGraphiteTab(
          ghMatch.groups.owner,
          ghMatch.groups.repo,
          ghMatch.groups.pr
        );
        return;
      }

      const gtMatch = tab.url.match(/https:\/\/app.graphite.dev\/github\/pr\/(?<owner>[^\s]+?)\/(?<repo>[^\s]+?)\/(?<pr>[\d]+)/i);
      console.log(`gt match: ${gtMatch}`);
      if (gtMatch) {
        openGithubTab(
          gtMatch.groups.owner,
          gtMatch.groups.repo,
          gtMatch.groups.pr
        );
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

// ?no-redirect required to stop Graphite extension from redirecting
async function openGithubTab(owner, repo, prNumber) {
  chrome.tabs.create({
    url: `https://github.com/${owner}/${repo}/pull/${prNumber}?no-redirect`,
    active: true,
  });
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
