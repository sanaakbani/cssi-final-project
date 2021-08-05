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
  };

  const renderData = (data,key) => {
    
    const profile = data[key];
    console.log(profile)
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
    
  };
