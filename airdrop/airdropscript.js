const urlParams = new URLSearchParams(window.location.search);
const refereeAddressParam = urlParams.get('ref');

// Function to populate the referee address input field
function populateRefereeAddress() {
    // Check for the 'ref' query parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const refereeAddressParam = urlParams.get('ref');

    // Fill the input field if 'ref' parameter is present
    if (refereeAddressParam) {
        document.getElementById('refereeAddress').value = refereeAddressParam;
    }
}

// Call the function to populate the referee address input field when the page loads
window.addEventListener('load', populateRefereeAddress);

// Rest of your code...


function submitForm() {
    const userAddress = document.getElementById('userAddress').value;
    const refereeAddress = document.getElementById('refereeAddress').value;
    const tweetLink = document.getElementById('tweetLink').value;

    if (!userAddress) {
        alert('Please enter your ETH address.');
        return;
    }

    if (refereeAddress && refereeAddress === userAddress) {
        alert("Referee's address cannot be the same as yours.");
        return;
    }

    // Check if the tweet link starts with 'twitter.com' or 'x.com'
    if (!tweetLink.startsWith('https://twitter.com/') && !tweetLink.startsWith('https://x.com/')) {
        alert('The tweet link must start with "https://twitter.com/" or "https://x.com/".');
        return;
    }

    const formData = {
        twitterUsername: document.getElementById('twitterUsername').value,
        userAddress: userAddress,
        refereeAddress: refereeAddress,
    };

    // Convert formData to JSON format
    const jsonData = JSON.stringify(formData);
    console.log('Data being sent to the server:', formData);

    fetch('https://jubilant-potato-production.up.railway.app/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData  // Send the JSON data
    })
    .then(response => response.text())
    .then(data => {
        if (data === 'Registration successful') {
            alert('Registered successfully!');
            setRegistrationCookie(); // Set the registration cookie here
        } else {
            alert(data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function shareTweet() {
    const userAddress = document.getElementById('userAddress').value; // Retrieve user's Solana address
    if (!userAddress) {
        alert('Please enter your ETH address first.'); // Ensure user address is entered
        return;
    }

    const registrationURL = `https://snekcoinsaga.wtf/airdrop?ref=${userAddress}`; // Your existing referral link structure
    const tweetMessage = `I'm participating in SnekCoinsaga Airdrop! Relive Snake Xenzia, Join Now $HISS: ${registrationURL}`; // Customize this message as needed

    // URL encoding the tweet message to ensure it's web safe
    const encodedTweetMessage = encodeURIComponent(tweetMessage);
    const twitterIntentURL = `https://twitter.com/intent/tweet?text=${encodedTweetMessage}`;

    window.open(twitterIntentURL, '_blank'); // Open the Twitter sharing dialog in a new tab
}


function fetchReferralCount() {
    const userAddress = document.getElementById('checkAddress').value;
    
    if (!userAddress) {
        alert('Please enter your ETH address.');
        return;
    }

    fetch(`https://jubilant-potato-production.up.railway.app/referrals/${userAddress}`)
    .then(response => response.json())
    .then(data => {
        alert(`Total referrals: ${data.referralCount}`);
    })
    .catch(error => console.error('Error:', error));
}
function generateReferralLink() {
    const userAddress = document.getElementById('userAddress').value;
    const registrationURL = `https://snekcoinsaga.wtf/airdrop?ref=${userAddress}`;
    // Update the div content instead of alert
    document.getElementById('referralLinkDisplay').textContent = 'Your referral link: ' + registrationURL;
}

function exportToCSV() {
    // Trigger a GET request to the /export-csv endpoint
    fetch('https://jubilant-potato-production.up.railway.app/export-csv')
        .then(response => {
            if (response.ok) {
                // If the export is successful, prompt the user to download the CSV
                return response.blob();
            } else {
                throw new Error('Export failed');
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'user_data.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
function setRegistrationCookie() {
    document.cookie = "registered=true; max-age=86400; path=/"; // Expires in 1 day
}
window.onload = function() {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('registered='))) {
        document.getElementById('registrationForm').style.display = 'none';
    }
};
