document.getElementById('connectWallet').addEventListener('click', function() {
    if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(accounts => {
                if (accounts.length === 0) {
                    console.log('No wallet found');
                    return;
                }
                const userAddress = accounts[0];
                console.log('Wallet address:', userAddress);
                document.getElementById('connectWallet').innerText = userAddress;

                // Save user address in session storage
                sessionStorage.setItem('walletAddress', userAddress);

                fetch('https://psychic-chainsaw-production.up.railway.app/saveUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ address: userAddress })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.lives > 0) {
                        window.location.href = 'game.html'; // Redirect to game if the user has lives
                    } else {
                        alert('No lives left. Please try again later.'); // Inform the user if they have no lives
                    }
                })
                .catch(error => {
                    console.error('Error connecting wallet:', error);
                    alert('Error connecting wallet. Please try again.');
                });
            })
            .catch(error => {
                console.error('Error requesting Ethereum accounts:', error);
            });
    } else {
        alert('Ethereum wallet not found. Please install MetaMask.');
    }
});
// Disable the right-click context menu
document.addEventListener('contextmenu', event => event.preventDefault());

// Disable all keys except WASD, Enter, and arrow keys
document.addEventListener('keydown', event => {
    // Key codes: W(87), A(65), S(83), D(68), Enter(13), Arrow Keys(37-40)
    const allowedKeys = [87, 65, 83, 68, 13, 37, 38, 39, 40];

    if (!allowedKeys.includes(event.keyCode)) {
        event.preventDefault();
    }
});

// Additional script setup...

function submitScore(score) {
    try {
        console.log("submitScore called with score:", score);
        const address = sessionStorage.getItem('walletAddress');
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
    var text = "Check out SnekCoin Saga, a blockchain game that recreates the classic Snake Xenzia! Play here https://snekcoinsaga.wtf"; // Your share message
    var hashtags = "SnekCoinSaga,$Hiss"; // Relevant hashtags

    var twitterUrl = `${url}?text=${encodeURIComponent(text)}&hashtags=${encodeURIComponent(hashtags)}`;
    window.open(twitterUrl, '_blank').focus();

    // Disable the share button after clicking
    document.getElementById('twitterShareBtn').disabled = true;
}


function submitTwitterLink() {
    console.log("submitTwitterLink called");
    const twitterLink = document.getElementById('twitterLinkInput').value;
    if (verifyTwitterLink(twitterLink)) {
        // Send request to server to update lives by adding 10
        fetch('https://psychic-chainsaw-production.up.railway.app/updateLives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: sessionStorage.getItem('walletAddress'), livesChange: 10 })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update lives');
            }
            return response.json();
        })
        .then(data => {
            alert('Lives updated successfully');
            document.getElementById('livesCount').innerText = data.lives; // Update lives display in UI
            // Optionally disable the submit button
            document.getElementById('submitTwitterButton').disabled = true;
        })
        .catch(err => console.error('Error updating lives:', err));
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
            body: JSON.stringify({ address: sessionStorage.getItem('walletAddress'), lives: 10 })
        }).then(() => {
            alert('Lives updated successfully');
        }).catch(handleError);
    } else {
        alert('Invalid Twitter link');
    }
}

function verifyTwitterLink(url) {
    // Define multiple patterns for valid Twitter URLs
    try {
        console.log("verifyAndSubmitTwitterLink called");
    const patterns = [
        /^https?:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+$/, // Standard Twitter status URL
        /^https?:\/\/x\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+$/ // Additional pattern (e.g., x.com)
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
        const address = sessionStorage.getItem('walletAddress');
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
        const address = sessionStorage.getItem('walletAddress');
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
