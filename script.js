document.getElementById('connectWallet').addEventListener('click', function() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(function(accounts) {
                if (accounts.length > 0) {
                    const walletAddress = accounts[0];
                    alert('Wallet connected: ' + walletAddress);
                    localStorage.setItem('walletAddress', walletAddress);
                    // Assuming your connect button has an ID 'connectWallet'
document.getElementById('connectWallet').innerText = userAddress;


                    // Send the wallet address to the backend
                    fetch('https://psychic-chainsaw-production.up.railway.app/saveUser', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ address: walletAddress })
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.lives > 0) {
                            // Allow access to the game
                            window.location.href = 'game.html';
                        } else {
                            // Make game inaccessible and alert user
                            alert('No lives left. Please try again later.');
                        }
                    })
                    .catch(error => {
                        console.error('Error connecting wallet:', error);
                        // Handle error, make game inaccessible
                    });
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
    try {
        console.log("submitScore called with score:", score);
    const address = localStorage.getItem('walletAddress');
    fetch('https://psychic-chainsaw-production.up.railway.app/updateScore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, score })
    }).then(response => response.json())
    .then(data => console.log('Score updated:', data))
    .catch(err => console.error('Error updating score:', err));
} catch (error) {
    console.error('Error in submitScore:', error);
}
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
    try {
        console.log("submitTwitterLink called");
    const twitterLink = document.getElementById('twitterLinkInput').value;
    if (verifyTwitterLink(twitterLink)) {
        // Send request to server to update lives
        fetch('https://psychic-chainsaw-production.up.railway.app/updateLives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: localStorage.getItem('walletAddress'), lives: 10 })
        }).then(() => {
            alert('Lives updated successfully');
        }).catch(err => console.error('Error updating lives:', err));
    } else {
        alert('Invalid Twitter link');
    }
} catch (error) {
    console.error('Error in submitTwitterLink:', error);
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

function verifyAndSubmitTwitterLink() {
    try {
        console.log("verifyAndSubmitTwitterLink called");
    // Define multiple patterns for valid Twitter URLs
    const patterns = [
        /^https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+$/, // Standard Twitter status URL
        /^https?:\/\/x\.com\/[a-zA-Z0-9_]+$/ // Additional pattern (e.g., x.com)
    ];

    // Check if the URL matches any of the defined patterns
    return patterns.some(pattern => pattern.test(url));
} catch (error) {
    console.error('Error in verifyAndSubmitTwitterLink:', error);
}
}

function handleError(error) {
    console.error('An error occurred in handleError:', error);
    alert('An error occurred. Please try again.');
}

// Function to call submitScore after each game...


// Function to retrieve the leaderboard from the server
function getLeaderboard() {
    try {
        console.log("getLeaderboard called");
    fetch('https://psychic-chainsaw-production.up.railway.app/leaderboard')
        .then(response => response.json())
        .then(leaderboardData => {
            let leaderboardHTML = '<h3>Leaderboard</h3>';
            leaderboardData.forEach(player => {
                leaderboardHTML += `<p>${player.address}: ${player.score}</p>`;
            });
            document.getElementById('leaderboard').innerHTML = leaderboardHTML;
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
    } catch (error) {
        console.error('Error in getLeaderboard:', error);
    }
}
function updateLives() {
    try {
        console.log("updateLives called");
    const walletAddress = localStorage.getItem('walletAddress');
    fetch('https://psychic-chainsaw-production.up.railway.app/getLives?address=' + walletAddress)
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
    } catch (error) {
        console.error('Error in updateLives:', error);
    }
}

function updateScore(score) {
    try {
        console.log("updateScore called with score:", score);
    const walletAddress = localStorage.getItem('walletAddress');
    fetch('https://psychic-chainsaw-production.up.railway.app/updateScore', {
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
} catch (error) {
    console.error('Error in updateScore:', error);
}
}


// Call this function to display the leaderboard on page load
getLeaderboard();
