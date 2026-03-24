const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    // Serve local images
    if (req.url.startsWith('/images')) {
        const filePath = path.join(__dirname, req.url);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("Image not found");
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
        return;
    }

    res.writeHead(200, {'Content-Type': 'text/html'});

    res.end(`
<!DOCTYPE html>
<html>
<head>
<title>CI/CD Architecture Dashboard</title>

<style>

body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background: #f4f6f9;
}

/* TITLE */
h1 {
    text-align: center;
    padding: 20px;
    font-size: 38px;
}

/* ARCHITECTURE */
.architecture {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 80px 20px;
    position: relative;
}

.line {
    position: absolute;
    top: 50%;
    left: 5%;
    right: 5%;
    height: 4px;
    background: #ccc;
    z-index: -1;
}

.dot {
    position: absolute;
    top: calc(50% - 6px);
    width: 12px;
    height: 12px;
    background: #007bff;
    border-radius: 50%;
    animation: flow 8s linear infinite;
}

@keyframes flow {
    0% { left: 5%; }
    100% { left: 95%; }
}

/* NODE */
.node {
    background: white;
    padding: 20px;
    width: 140px;
    text-align: center;
    border-radius: 15px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    transition: 0.3s;
    cursor: pointer;
    position: relative;
}

.node:hover {
    transform: translateY(-10px) scale(1.05);
}

.node img {
    width: 60px;
    height: 60px;
}

.node h3 {
    margin: 10px 0;
}

/* POPUP */
.popup {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%) scale(0);
    width: 230px;
    padding: 15px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    opacity: 0;
    transition: 0.4s;
}

.node:hover .popup {
    transform: translateX(-50%) scale(1);
    opacity: 1;
}

/* PERSON SECTION */
.person {
    width: 90%;
    margin: 50px auto;
    padding: 40px;
    border-radius: 20px;
    background: white;
    display: flex;
    align-items: center;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    transition: 0.4s;
}

.person:hover {
    transform: scale(1.03);
}

/* IMAGE */
.person img {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    margin-right: 40px;
    object-fit: cover;
    border: 4px solid #ddd;
}

/* DETAILS */
.details {
    flex: 1;
}

.details h2 {
    margin: 0;
    font-size: 28px;
}

.details p {
    margin: 5px 0;
}

/* HIDDEN INFO */
.extra {
    max-height: 0;
    overflow: hidden;
    transition: 0.5s;
}

.person:hover .extra {
    max-height: 300px;
}

/* FOOTER */
.footer {
    text-align: center;
    padding: 30px;
    color: #777;
}

</style>

</head>

<body>

<h1>CI/CD System Architecture</h1>

<div class="architecture">

    <div class="line"></div>
    <div class="dot"></div>

    <div class="node">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg">
        <h3>GitHub</h3>
        <div class="popup">
            Developer pushes code to repository.
        </div>
    </div>

    <div class="node">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg">
        <h3>Actions</h3>
        <div class="popup">
            CI pipeline builds and tests code.
        </div>
    </div>

    <div class="node">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg">
        <h3>Docker</h3>
        <div class="popup">
            Application is containerized.
        </div>
    </div>

    <div class="node">
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg">
        <h3>Jenkins</h3>
        <div class="popup">
            Pulls image and runs deployment.
        </div>
    </div>

    <div class="node">
        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828640.png">
        <h3>Deploy</h3>
        <div class="popup">
            App runs on localhost:3000
        </div>
    </div>

</div>

<!-- PERSON 1 -->
<div class="person">
    <img src="/images/pranav.jpg">
    <div class="details">
        <h2>Pranav M V</h2>
        <p><b>Department:</b> B.E CSE</p>
        <div class="extra">
            <p><b>Roll No:</b> 192411030</p>
            <p><b>Age:</b> 19</p>
            <p>Module 3: Optimization and Version Control</p>
        </div>
    </div>
</div>

<!-- PERSON 2 -->
<div class="person">
    <img src="/images/friend2.jpg">
    <div class="details">
        <h2>Sam Aakash Priyan S</h2>
        <p><b>Department:</b> B.Tech Information Technology</p>
        <div class="extra">
            <p><b>Roll No:</b> 192421312</p>
            <p><b>Age:</b> 19</p>
            <p>Module 2: Jenkins Integration & Deployment</p>
        </div>
    </div>
</div>

<!-- PERSON 3 -->
<div class="person">
    <img src="/images/friend3.jpg">
    <div class="details">
        <h2>Ashton Sam J</h2>
        <p><b>Department:</b> B.E AI-ML</p>
        <div class="extra">
            <p><b>Roll No:</b> 192472168</p>
            <p><b>Age:</b> 19</p>
            <p>Module 1: GitHub-Based CI/CD Workflow Automation</p>
        </div>
    </div>
</div>

<div class="footer">
CI/CD using GitHub, Docker, Jenkins
</div>

</body>
</html>
`);
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});