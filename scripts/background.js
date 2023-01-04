chrome.commands.onCommand.addListener(runCommand);

async function runCommand(command) {
  if (command === "toggle") {
    toggle();
  }
}

async function toggle() {
  getCurrentTab().then((tab) => {
    console.log(`url: ${tab?.url}`);

    const ghMatch = tab?.url.match(
      /https:\/\/github.com\/(?<owner>[^\s]+)\/(?<repo>[^\s]+)\/pull\/(?<pr>[\d]+)/i
    );
    console.log(`gh match: ${ghMatch}`);
    if (ghMatch) {
      openGraphiteTab(
        ghMatch.groups.owner,
        ghMatch.groups.repo,
        ghMatch.groups.pr
      );
      return;
    }

    const gtMatch = tab?.url.match(
      /https:\/\/app.graphite.dev\/github\/pr\/(?<owner>[^\s]+?)\/(?<repo>[^\s]+?)\/(?<pr>[\d]+)/i
    );
    console.log(`gt match: ${gtMatch}`);
    if (gtMatch) {
      openGithubTab(
        gtMatch.groups.owner,
        gtMatch.groups.repo,
        gtMatch.groups.pr
      );
    }
  });
}

function openGraphiteTab(owner, repo, prNumber) {
  const url = `https://app.graphite.dev/github/pr/${owner}/${repo}/${prNumber}`;
  chrome.tabs
    .query({
      currentWindow: true,
      url: `${url}*`,
    })
    .then((tabs) => {
      for (const tab of tabs) {
        if (tab?.url.startsWith(url)) {
          chrome.tabs.update(tab.id, { active: true });
          console.log(`tab ${tab.id} made active`);
          return;
        }
      }
      chrome.tabs.create({
        url: url,
        active: true,
      });
      console.log(`opened ${url}`);
    });
}

function openGithubTab(owner, repo, prNumber) {
  const url = `https://github.com/${owner}/${repo}/pull/${prNumber}`;
  chrome.tabs
    .query({
      currentWindow: true,
      url: `${url}*`,
    })
    .then((tabs) => {
      for (const tab of tabs) {
        if (tab?.url.startsWith(url)) {
          chrome.tabs.update(tab.id, { active: true });
          console.log(`tab ${tab.id} made active`);
          return;
        }
      }
      chrome.tabs.create({
        // ?no-redirect=1 required to stop Graphite extension from redirecting
        url: `${url}?no-redirect=1`,
        active: true,
      });
      console.log(`opened ${url}`);
    });
}

async function getCurrentTab() {
  let [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
}
