/**
 * Main Webpack Application Entry Point
 */
const fetch = require("node-fetch");

// Server Data
const IP = "192.168.0.185";
const PORT = 3000;

// Variables for Element ID's
const repo_list = document.getElementById("repo_list");
const repo_create_btn = document.getElementById("create_repo");
const repo_remove_btn = document.getElementById("remove_repo");
const repo_list_btn = document.getElementById("list_repos");
const repo_input = document.getElementById("repo_input");
const output_msg = document.getElementById("output-msg");
const output_link = document.getElementById("output-link");
const ssh_key_input = document.getElementById("ssh_pub");
const ssh_submit_btn = document.getElementById("submit_key");

// Globally Shared Varialbes
let PRIORITY_MSG = null; // Priority Message shared among async

// Helper Functions
/*
 * Generates/Displays the Link of the Repository
 */
function displayLink(repo) {
  const SSH_REQ = "ssh://git@" + IP;
  output_link.innerHTML = repo.length ? SSH_REQ + "/repos/" + repo : "";
}

/**
 * Filters out the '.git' extension and returns
 *  a clean version of the text
 */
function filterGitFromStr(str) {
  return str.split(".git")[0];
}

/**
 * Adds a Repository to the Repo List
 * @param {string} repoName
 */
function addToList(repoName) {
  // Create the Element
  const option = document.createElement("option");

  // Filter the Repo Name
  repoName = filterGitFromStr(repoName);

  // Add '.git' if not empty
  if (repoName.length) {
    repoName += ".git";
  }

  // Set Property Data
  option.value = repoName;
  option.text = repoName;

  // Add to List
  repo_list.appendChild(option);
}

/**
 * Clears the Repo List
 */
function clearList() {
  while (repo_list.hasChildNodes()) {
    repo_list.removeChild(repo_list.lastChild);
  }
}

/**
 * Output Success Message
 * @param {string} str
 */
function stdout(str) {
  output_msg.innerHTML = str;
  output_msg.setAttribute("class", "text-success");
}

/**
 * Output Error Message
 * @param {string} str
 */
function stderr(str) {
  output_msg.innerHTML = str;
  output_msg.setAttribute("class", "text-fail");
}

/**
 * Updates Entire Repository List
 * @param {string} rawList Raw output of Server
 */
function updateRepoList(rawList) {
  // Make sure List isn't empty
  if (!rawList) return;

  // Parse through List
  // Sort List
  const arr = rawList.split("\n");
  arr.sort();

  // Clear the List
  clearList();

  // Apply list to Repo List
  for (const repo of arr) {
    addToList(repo);
  }
}

// Button Click Events
repo_create_btn.onclick = () => {
  // Repo-Create
  // Validate Input
  let str = repo_input.value;

  if (!str.length) {
    stderr("Repository Name must not be empty!");
  }

  // Proceed with Request
  else {
    // Filter the Repo Name
    str = filterGitFromStr(str);

    // Create the Object
    const body = {
      git_name: str,
    };

    // Send Request
    fetch(`http://${IP}:${PORT}/create_repository`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Failed
        if (data.err) {
          stderr(data.err);
        }

        // Success
        else {
          // Update the entire List
          repo_list_btn.click();

          // Display Output
          stdout(data.message);

          // Set Output as High Priority
          PRIORITY_MSG = data.message;
        }
      })
      .catch((err) => {
        stderr(err);
      });
  }
};

repo_list_btn.onclick = () => {
  // Repo-List Button
  // Proceed with Request

  // Send Request
  fetch(`http://${IP}:${PORT}/list_repositories`)
    .then((res) => res.json())
    .then((data) => {
      // Failed
      if (data.err) {
        stderr(data.err);
      }

      // Success
      else {
        //stdout(data.message);

        // Output Message for User
        if (PRIORITY_MSG) {
          // Check for High Priority Msg
          stdout(PRIORITY_MSG); // Output the Message
          PRIORITY_MSG = null; // Empty it
        } else stdout("List Updated!");

        // Update the entire List
        updateRepoList(data.message);
      }
    })
    .catch((err) => {
      stderr(err);
    });
};

repo_list.onclick = () => {
  // Repo List Selection
  // Obtain the Selected Repo Name
  const repoName = repo_list[repo_list.selectedIndex].value;

  // Apply to Link
  displayLink(repoName);

  // Filter & Add to Input
  repo_input.value = filterGitFromStr(repoName);
};

submit_key.onclick = () => {
  // Submit SSH Public Key
  // Create Object for Server
  const obj = {
    key: ssh_key_input.value,
  };

  // Post Request
  fetch(`http://${IP}:${PORT}/push_key`, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      stdout("SSH Key Submitted!");
      ssh_key_input.value = ""; // Clear the Input
    })
    .catch((err) => stderr(err));
};

// On Document Load
repo_list_btn.click(); // Update the Repo List
