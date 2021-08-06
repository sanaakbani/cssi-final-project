var firebaseConfig = {
  apiKey: "AIzaSyBf6K5IOel6hgmCik0LDRIfzn4N4I-TnSk",
  authDomain: "birthday-profiles.firebaseapp.com",
  databaseURL: "https://birthday-profiles-default-rtdb.firebaseio.com",
  projectId: "birthday-profiles",
  storageBucket: "birthday-profiles.appspot.com",
  messagingSenderId: "113088435057",
  appId: "1:113088435057:web:6858605a97e2f7a8059cd0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let googleUserId;
let profileId;

window.onload = (event) => {
    // Use this to retain user state between html pages.
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log('Logged in as: ' + user.displayName);
        googleUserId = user.uid;
        let url = new URL(document.location.href);
        console.log(url)
        const params = new URLSearchParams(window.location.search);
        if(!params.has('id')){
          window.location = 'viewprofiles.html';
        }
        profileId = params.get('id');
        setupPage(profileId);
        alert("In the gift ideas, seperate each gift in a different line by clicking Enter!")
      } else {
        // If not logged in, navigate back to login page.
        window.location = 'index.html'; 
      };
    });
  };

  const setupPage = (profileId) => {
  
    console.log("logged in as user " + googleUserId);
    const dbRef = firebase.database().ref(`users/${googleUserId}`);
    dbRef.on('value', (snapshot) => {
        renderData(snapshot.val(),profileId);
    })
    initializeTimer(profileId);
  };

  let birthdateFormat;
  let profile;
  const renderData = (data,key) => {
    profile = data[key];
    console.log(profile)
    birthdateFormat = profile.birthday;
    //adds text on to the string already
    //const birthdayLabel = document.querySelector("")

    let storageRef = firebase.storage().ref();
    console.log(storageRef);
    storageRef.child(`users/${profile.image}`).getDownloadURL()
    .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'// Or inserted into an <img> element
      console.log('image found', url);
      const imageCon = document.querySelector('#imageCon');
      imageCon.setAttribute("src",url);
    })
    .catch((error) => {
      console.log('image not found', error);
      // Handle any errors
    });

    const nameLabel = document.querySelector("#name");
    nameLabel.innerHTML = profile.name;

    const giftText = document.querySelector("#giftText");
    giftText.innerHTML = profile.gifts;
    const messageText = document.querySelector("#message");
    messageText.innerHTML = profile.message;
    
  };


  //countdown
function initializeTimer(cardId) {
  const daysSpan = document.querySelector(".daysTimer");

  function updateTimer() {
    const t = countdown(birthdateFormat);

    daysSpan.innerHTML = `${t.days}d:${t.hours}h:${t.minutes}m:${t.seconds}s`;

  }

  updateTimer();
  const timeinterval = setInterval(updateTimer, 1000);
}

const countdown = () => {
     const timeRemaining = (Date.parse(birthdateFormat) - Date.parse(new Date()));
     let seconds = Math.floor(timeRemaining / 1000);
     let minutes = Math.floor(seconds / 60);
     let hours = Math.floor(minutes / 60);
     let days = Math.floor(hours / 24);

     hours %= 24;
     minutes %= 60;
     seconds %= 60;
    
     return {
       timeRemaining,
       days,
       hours,
       minutes,
       seconds
    };
}

const saveMessage = () => {
  const dbRef = firebase.database().ref(`users/${googleUserId}/${profileId}`);
  dbRef.update({
    name: profile.name,
    birthday: profile.birthday,
    image: profile.image,
    gifts: document.querySelector("#giftText").value.split("\n").join('&#13;&#10;'),
    message: document.querySelector("#message").value.split("\n").join('&#13;&#10;')
  }).then(() => {
    alert('Done')
  })
}