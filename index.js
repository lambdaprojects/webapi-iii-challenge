// code away!
// This is the index file. This is where the server is invoked.

const server = require("./server.js");

const port = "8000";

server.listen(port, () => {
  console.log(`API is running in port ${port}`);
});
