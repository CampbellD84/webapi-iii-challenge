// code away!
const server = require("./server");
require("dotenv").config();

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`\n* Server Running on http://localhost:${port} *\n`);
});
