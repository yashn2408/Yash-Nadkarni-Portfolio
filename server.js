const express = require('express');
const website = express();
const port = 3000; // Changed to 3000 to match game.js fetch requests
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// 📍 Path to store high score
const HIGH_SCORE_FILE = path.join(__dirname, 'highscore.json');

// ✅ Initialize high score from file
let highScore = 0;
if (fs.existsSync(HIGH_SCORE_FILE)) {
    try {
        const data = fs.readFileSync(HIGH_SCORE_FILE, 'utf8');
        highScore = JSON.parse(data).highScore || 0;
        console.log("✅ Loaded high score:", highScore);
    } catch (err) {
        console.error("❌ Error reading highscore.json:", err);
    }
} else {
    console.log("⚠️ highscore.json not found. Creating with default score 0.");
    fs.writeFileSync(HIGH_SCORE_FILE, JSON.stringify({ highScore: 0 }));
}

// ✅ Middleware
website.use(cors());
website.use(express.json());
website.use(express.urlencoded());
website.use('/public', express.static('public'));


// Optional: specifically serve robots.txt and sitemap.xml
website.get('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

website.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});




// ✅ Serve HTML routes
website.use("/partials-home", express.static(path.join(__dirname, "main-folder/partials-home")));
website.use("/partials-constants", express.static(path.join(__dirname, "main-folder/partials-constants")));
website.use("/partials-services", express.static(path.join(__dirname, "main-folder/partials-services")));

website.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages', 'home.html'));
});

website.get('/services', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages', 'services.html'));
});

website.get('/game', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages', 'game.html'));
});

website.get('/blinkit-project', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages/project-files', 'blinkit-project.html'));
});
website.get('/smart-glasses-project', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages/project-files', 'smart-glasses-project.html'));
});
website.get('/doodle-story', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages/project-files', 'doodle-story.html'));
});
website.get('/sanket', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages/project-files', 'sanket-project.html'));
});
website.get('/assistive-wearables', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages/project-files', 'assistive-wearables.html'));
});
website.get('/handtracking', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, 'main-folder/main-website-pages/project-files', 'handtracking.html'));
});

// ✅ GET high score
website.get('/api/highscore', (req, res) => {
    console.log("📤 Sending high score:", highScore);
    res.json({ highScore });
});


// ✅ POST new score
website.post('/api/highscore', (req, res) => {
    const newScore = req.body.score;
    console.log("📥 Received score:", newScore);
    console.log("🏆 Current high score:", highScore);

    if (typeof newScore === 'number' && newScore > highScore) {
        highScore = newScore;
        fs.writeFile(HIGH_SCORE_FILE, JSON.stringify({ highScore }), 'utf8', (err) => {
            if (err) {
                console.error("❌ Failed to write to highscore.json:", err);
                return res.status(500).json({ success: false, error: "Write failed" });
            }
            console.log("✅ New high score saved:", highScore);
            res.json({ success: true, newHighScore: true, highScore });
        });
    } else {
        console.log("➡️ Score not high enough or invalid.");
        res.json({ success: true, newHighScore: false, highScore });
    }
});

// ✅ Start server
website.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
