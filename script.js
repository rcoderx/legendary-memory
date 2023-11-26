// Example of using Ethereum wallet connection (e.g., MetaMask)
document.getElementById('connectWallet').addEventListener('click', function() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(function(accounts) {
            if (accounts.length > 0) {
                const walletAddress = accounts[0];
                alert('Wallet connected: ' + walletAddress);
                // Store the connected wallet address for later use
                localStorage.setItem('walletAddress', walletAddress);
            } else {
                alert('No wallet addresses found.');
            }
        })
        .catch(function(error) {
            console.error("Error connecting to wallet: ", error);
        });
    } else {
        alert("Ethereum wallet not found. Please install MetaMask.");
    }
});

// Additional script setup...

function submitScore(score) {
    const address = localStorage.getItem('walletAddress');
    fetch('/updateScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, score })
    }).then(response => response.json())
    .then(data => console.log('Score updated:', data))
    .catch(err => console.error('Error updating score:', err));
}

function verifyTwitterLink(url) {
    const twitterUrlPattern = /^https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+$/;
    return twitterUrlPattern.test(url);
}

document.getElementById('twitterShareBtn').addEventListener('click', function() {
    // Logic to share the game link on Twitter
    this.disabled = true; // Disable the button after clicking
});
function handleTwitterShare() {
    // Construct the Twitter share URL
    var url = "https://twitter.com/intent/tweet";
    var text = "Check out SnekCoin Saga, an awesome blockchain game!"; // Your share message
    var hashtags = "SnekCoinSaga,$Hiss"; // Relevant hashtags

    var twitterUrl = `${url}?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(twitterUrl, '_blank').focus();

    // Disable the share button after clicking
    document.getElementById('twitterShareBtn').disabled = true;
}


function submitTwitterLink() {
    const twitterLink = document.getElementById('twitterLinkInput').value;
    if (verifyTwitterLink(twitterLink)) {
        // Send request to server to update lives
        fetch('/updateLives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: localStorage.getItem('walletAddress'), lives: 10 })
        }).then(() => {
            alert('Lives updated successfully');
        }).catch(err => console.error('Error updating lives:', err));
    } else {
        alert('Invalid Twitter link');
    }
}
function verifyAndSubmitTwitterLink() {
    const twitterLink = document.getElementById('twitterLinkInput').value;
    if (verifyTwitterLink(twitterLink)) {
        fetch('/updateLives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: localStorage.getItem('walletAddress'), lives: 10 })
        }).then(() => {
            alert('Lives updated successfully');
        }).catch(handleError);
    } else {
        alert('Invalid Twitter link');
    }
}

function verifyTwitterLink(url) {
    // Define multiple patterns for valid Twitter URLs
    const patterns = [
        /^https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+$/, // Standard Twitter status URL
        /^https?:\/\/x\.com\/[a-zA-Z0-9_]+$/ // Additional pattern (e.g., x.com)
    ];

    // Check if the URL matches any of the defined patterns
    return patterns.some(pattern => pattern.test(url));
}

function handleError(error) {
    console.error('An error occurred:', error);
    alert('An error occurred. Please try again.');
}

// Function to call submitScore after each game...


// Function to retrieve the leaderboard from the server
function getLeaderboard() {
    fetch('http://your-railway-app-url.com/leaderboard')
        .then(response => response.json())
        .then(leaderboardData => {
            let leaderboardHTML = '<h3>Leaderboard</h3>';
            leaderboardData.forEach(player => {
                leaderboardHTML += `<p>${player.address}: ${player.score}</p>`;
            });
            document.getElementById('leaderboard').innerHTML = leaderboardHTML;
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}
function updateLives() {
    const walletAddress = localStorage.getItem('walletAddress');
    fetch('http://your-railway-app-url.com/getLives?address=' + walletAddress)
        .then(response => response.json())
        .then(data => {
            if (data.lives > 0) {
                console.log('Lives remaining:', data.lives);
            } else {
                console.error('No lives remaining');
                // Additional logic when player runs out of lives
            }
        })
        .catch(error => console.error('Error checking lives:', error));
}
function updateScore(score) {
    const walletAddress = localStorage.getItem('walletAddress');
    fetch('http://your-railway-app-url.com/updateScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: walletAddress, score: score })
    })
    .then(response => {
        if (response.ok) {
            console.log('Score updated successfully');
        } else {
            console.error('Failed to update score');
        }
    })
    .catch(error => console.error('Error updating score:', error));
}


// Call this function to display the leaderboard on page load
getLeaderboard();
