const http = require("http");

http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({
        status: "healthy",
        path: req.url
    }));
}).listen(3000, () => console.log("Server on port 3000"));