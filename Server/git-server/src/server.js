/**
 * Small Express.js Server that handles HTTP Requests
 *  - Runs Local Scripts based on Requests
 */

// Import Module for running Shell Commands
const { spawn } = require("child_process");
const cors = require("cors");
const bodyParser = require("body-parser");

// Initialize Express.js
const express = require("express");
const app = express();

// Add Middleware for Access Control & JSON Body Parser
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// Listen to Root Request
app.get("/", (req, res) => {});

/**
 * Create a Repository based on Request Data
 *  { git_name : String }
 */
app.post("/create_repository", (req, res) => {
  // DEBUG: Terminal Output
  console.log("Repository Creation Requested!");

  // Create Response Object
  const obj = {
    requestType: "Create Repository", // Type of Request
    message: null, // Message from Request
    err: null, // Error if any
    status: 0, // Status (0 = Success | 1 = Failed)
  };

  // Validate Post Data
  const data = req.body;
  if (
    !data.git_name ||
    typeof data.git_name !== "string" ||
    data.git_name.length == 0 ||
    hasSpace(data.git_name)
  ) {
    // Invalid Data
    obj.err =
      "Invalid JSON Data, please provide { git_name: 'string' } with data. Git name cannot have spaces!";
    res.send(obj);
    return;
  }

  // Run script to create new Repository
  const script = spawn("sh", [
    "/home/git/scripts/create_new_repository.sh",
    data.git_name,
  ]);

  // Output Standard Output to Server Terminal
  script.stdout.on("data", (data) => {
    console.log(`Data: ${data.toString()}`);
  });

  // Check Code Status when Closed and Send Response to User
  script.on("close", (code) => {
    // Check Script Status Code
    if (code === 0) {
      // No Errors
      obj.message = `Repository '${data.git_name}' was created successfully!`;
    } else if (code === 2) {
      // ERROR: Duplicate Repository
      obj.err = "ERROR: Duplicate Repository Found!";
    }

    // DEBUG: Terminal Output
    console.log(`Result: ${obj.err ? obj.err : obj.message}`);
    console.log(`Script Code: ${code}`);

    // Send Response
    obj.status = code;
    res.send(obj);
  });
});

/**
 * Returns a list of all the Available Repositories
 */
app.get("/list_repositories", (req, res) => {
  // DEBUG: Output to Terminal
  console.log("List Repositories Requested");

  // Create Response Object
  const obj = {
    requestType: "List of Available Repositories", // Type of Request
    message: null, // Message from Request
    err: null, // Error if any
    status: 0, // Status (0 = Failed | 1 = Success)
  };

  // Run script to List Available Repositories
  const script = spawn("sh", ["/home/git/scripts/list_repositories.sh"]);

  // Output Standard Output to Server Terminal
  script.stdout.on("data", (data) => {
    //console.log(data.toString());

    // Append data to Message
    obj.message = data.toString();
  });

  // Check Code Status when Closed and Send Response to User
  script.on("close", (code) => {
    // Check Script Status Code
    if (code === 0) {
      // No Errors
    } else if (code === 2) {
      // ERROR: Repository not Found
      obj.err = "ERROR: Something Happened!";
    }

    // DEBUG: Terminal Output
    console.log(`Result: ${obj.err ? obj.err : obj.message}`);

    // Send Response
    obj.status = code;
    res.send(obj);
  });
});

/**
 * Appends Public SSH Key to Known Keys
 */
app.post("/push_key", (req, res) => {
  // Obtain the Data
  const data = req.body;

  // Validate data is there
  if (data && data.key) {
    // DEBUG: Output to Server Console
    console.log(`Key Obtained: ${data.key}`);

    // Run Script to append SSH Key
    const script = spawn("sh", [
      "/home/git/scripts/add_public_sshkey.sh",
      data.key,
    ]);

    // Output to Server Log
    script.stdout.on("data", (data) => console.log(data));
    script.stderr.on("data", (err) => console.error(err.toString()));
    script.on("close", (code) => console.log(`Exited: ${code}`));
  }

  // Return nothing
  res.send(null);
});

// Listen to Port
const server = app.listen(3000, (s) => {
  console.log(
    `ExpressJS Server Listening on ${server.address().address}: ${
      server.address().port
    }`
  );
});

// Helper Functions
/**
 * Checks for Spaces in String
 * @param {string} str String to check
 */
function hasSpace(str) {
  for (const c of str) {
    if (c === " ") return true;
  }
  return false;
}
