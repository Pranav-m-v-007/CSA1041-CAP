const http = require('http');

const server = http.createServer((req, res) => {
res.writeHead(200, {'Content-Type': 'text/html'});

res.end(`
<!DOCTYPE html>
<html>
<head>
<title>CI/CD Smart Dashboard</title>

<style>

body {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(270deg, #0f2027, #203a43, #2c5364);
    background-size: 600% 600%;
    animation: gradientBG 10s ease infinite;
    color: white;
}

/* Animated Background */
@keyframes gradientBG {
    0% {background-position: 0%}
    50% {background-position: 100%}
    100% {background-position: 0%}
}

h1 {
    text-align: center;
    padding: 20px;
    font-size: 42px;
    letter-spacing: 2px;
}

/* Pipeline Flow */
.pipeline {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 30px;
    flex-wrap: wrap;
}

.step {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    padding: 15px 25px;
    border-radius: 12px;
    box-shadow: 0 0 15px rgba(0,255,255,0.4);
    transition: 0.4s;
    position: relative;
}

.step:hover {
    transform: scale(1.15);
    box-shadow: 0 0 25px cyan;
}

/* Arrow animation */
.step::after {
    content: "→";
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    animation: blink 1s infinite;
}

.step:last-child::after {
    content: "";
}

@keyframes blink {
    0% {opacity: 0;}
    50% {opacity: 1;}
    100% {opacity: 0;}
}

/* Status pulse */
.status {
    width: 10px;
    height: 10px;
    background: lime;
    border-radius: 50%;
    display: inline-block;
    margin-left: 10px;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {transform: scale(1);}
    50% {transform: scale(1.5);}
    100% {transform: scale(1);}
}

/* Cards */
.container {
    display: flex;
    justify-content: center;
    gap: 40px;
    margin-top: 50px;
    flex-wrap: wrap;
}

.card {
    width: 220px;
    padding: 20px;
    border-radius: 20px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(12px);
    text-align: center;
    transition: 0.5s;
    box-shadow: 0 0 20px rgba(0,255,255,0.2);
}

.card:hover {
    transform: rotateY(10deg) scale(1.1);
    box-shadow: 0 0 30px cyan;
}

.card img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
    border: 3px solid cyan;
}

/* Footer */
.footer {
    text-align: center;
    margin: 40px;
    font-size: 18px;
    opacity: 0.8;
}

</style>
</head>

<body>

<h1>CI/CD Automation Dashboard</h1>

<div class="pipeline">
    <div class="step">GitHub <span class="status"></span></div>
    <div class="step">GitHub Actions <span class="status"></span></div>
    <div class="step">Docker Build <span class="status"></span></div>
    <div class="step">Jenkins Deploy <span class="status"></span></div>
    <div class="step">Live App <span class="status"></span></div>
</div>

<h1>Team Members</h1>

<div class="container">

<div class="card">
<img src="https://i.pravatar.cc/100?img=1">
<h3>Pranav</h3>
<p>Roll No: 101</p>
<p>Age: 21</p>
<p>Role: DevOps Engineer</p>
</div>

<div class="card">
<img src="https://i.pravatar.cc/100?img=2">
<h3>Friend 2</h3>
<p>Roll No: 102</p>
<p>Age: 21</p>
<p>Role: Backend Developer</p>
</div>

<div class="card">
<img src="https://i.pravatar.cc/100?img=3">
<h3>Friend 3</h3>
<p>Roll No: 103</p>
<p>Age: 22</p>
<p>Role: Cloud Engineer</p>
</div>

</div>

<div class="footer">
Automated using GitHub | Docker | Jenkins
</div>

</body>
</html>
`);
});

server.listen(3000, () => {
console.log("Server running at http://localhost:3000");
});