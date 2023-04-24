// https://developer.chrome.com/docs/extensions/mv3/options/

// Saves options to chrome.storage
const saveOptions = () => {
  const redirectChecked = document.getElementById("redirect").checked;

  chrome.storage.sync.set(
    { redirect: redirectChecked },
    () => {
      // Update status to let user know options were saved.
      const status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(() => {
        status.textContent = "";
      }, 750);
    }
  );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
  chrome.storage.sync.get({ redirect: true }, (items) => {
    document.getElementById("redirect").checked = items.redirect;
  });
};

document.addEventListener("DOMContentLoaded", restoreOptions);
document.getElementById("save").addEventListener("click", saveOptions);
