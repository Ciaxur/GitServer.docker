const fetch = require("node-fetch");

fetch("http://localhost:3000/list_repositories")
  .then((res) => res.json())
  .then((data) => console.log(data));
