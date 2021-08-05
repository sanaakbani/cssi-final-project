// Your web app's Firebase configuration
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

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      document.querySelector("#state").value = null;
      getProfile(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html';
    };
  });
};
const addFriendModal = () => {
  const modal = document.querySelector("#addFriendModal");
  modal.classList.add("is-active");

}
const getProfile = (userId) => {
  
  console.log("logged in as user " + userId);
  const dbRef = firebase.database().ref(`users/${userId}`);
  dbRef.on('value', (snapshot) => {
      renderData(snapshot.val());
  })
};
const renderData = (data) => {
  const destination = document.querySelector('#app');
  destination.innerHTML = "";
  for (let key in data) {
      const profile = data[key];
      //adds text on to the string already
      createCard(profile, key).then((e) => {
        destination.innerHTML+=e;
      });
  }
};

const closeModal = () => {
  const modal = document.querySelector("#addFriendModal");
  modal.classList.remove("is-active");
  document.querySelector("#name").value = "";
  document.querySelector('#imageFile #fileNameLabel').value = ""
  uploadedFile = "";
  document.querySelector("#birthday").value = "";
}

let imageUrl;

const createCard = (profile, profileId) => {
  let storageRef = firebase.storage().ref();
  console.log(storageRef);
  return storageRef.child(`users/${profile.image}`).getDownloadURL()
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'// Or inserted into an <img> element
    console.log('image found', url);
    imageUrl = url;
    birthdateFormat = profile.birthday;
    console.log(birthdateFormat);
    return `<a onclick="openProfile('${profileId}')">
              <div class="column is-one-quarter">
                <div class="card" id="noteId"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${profile.name} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            <img src="${imageUrl}" alt="friend's image">
                            <p><strong>Birthday</strong>: ${profile.birthday}</p> 
                        </div>

                        <h2>Birthday Countdown!</h2>
                         <div id="timer">
                          <div>
                            <span class="days"></span>
                            <div class="text">Days</div>
                          </div>
                          <div>
                            <span class="hours"></span>
                            <div class="text">Hours</div>
                          </div>
                          <div>
                            <span class="minutes"></span>
                            <div class="text">Minutes</div>
                          </div>
                          <div>
                            <span class="seconds"></span>
                            <div class="text">Seconds</div>
                          </div>
                        </div>
                          
                        <div class = "card-footer">

                            <a href="#"
                              class= "card-footer-item"
                              onclick="deleteProfile('${profileId}')">
                                Delete</a>
                                
                        </div>


                    </div> 
                </div>
            </div>
          </a>`;
          
  })
  .catch((error) => {
    console.log('image not found', error);
    // Handle any errors
  });
  
};
const deleteProfile= (profileId) => {
    
    const profileToDelete = firebase.database().ref(`users/${googleUserId}/${profileId}`);
    console.log("function worked");
     profileToDelete.remove();

}
const openProfile= (profileId) => {
  window.location = `writeprofiles.html?id=${profileId}`
}
const fileInput = document.querySelector('#imageFile input[type=file]');
let uploadedFile;
fileInput.onchange = () => {
    let fullPath = fileInput.value;
    const fileNameLabel = document.querySelector('#imageFile #fileNameLabel');
    if (fullPath) { 
      var startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/')); 
      let filename = fullPath.substring(startIndex); 
      if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) { 
        filename = filename.substring(1); 
      } 
      uploadedFile = filename;
      fileNameLabel.innerHTML = filename;
      filename="";
     }
     
};

const createProfile = () => {
  
    let storage = firebase.storage().ref();
    let uploader = document.getElementById("progress");
    const fileRef = storage.child('users/' + uploadedFile);
          //upload file
    console.log(storage);
    let task = fileRef.put(fileInput.files[0]);
    task.on('state_changed', function progress(snapshot) {
      var percentage = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
      uploader.value = percentage;

    }, function error(err) {
        console.log("failed image upload");
        console.log(err);

    },function complete() {
        console.log("worked");
    });

          //update progress b


    let dbRef = firebase.database().ref(`users/${googleUserId}`);
    dbRef.push({
        name: document.querySelector("#name").value,
        image: uploadedFile,
        birthday: document.querySelector("#birthday").value,
    }).then(() => {
  // 3. Clear the form so that we can write a new note
    closeModal();
    
    });
};

const editProfile = (profileId) => {
    //console.log("edit" + profileId);
    const profileToEdit = firebase.database().ref(`users/${googleUserId}/${profileId}`);
    profileToEdit.on("value", (snapshot) => {
        const profile = snapshot.val();
        
        const name = document.querySelector("#name");
        const fileNameLabel = document.querySelector('#imageFile #fileNameLabel');
        const birthday = document.querySelector("#birthday");

        name.value = profile.name;
        fileNameLabel.value = profile.image;
        birthday.value = profile.birthday;
        //document.querySelector("#editProfileId").value = profileId;        
        document.querySelector("#addFriendModal").classList.add("is-active");
        document.querySelector("#state").value = profileId;
        
    });
};











/* addfriend /saveChanges
const saveChanges = () => {
    //console.log("edit" + profileId);
    const editProfileNameInput = document.querySelector("#editProfileNameInput");
    const editProfileTextInput = document.querySelector("#editProfileTextInput");
    const editProfileId = document.querySelector("#editProfileId");

    const name = editProfileNameInput.value;
    const text = editProfileTextInput.value;
    const profileId = editProfileId.value;

    const profileToEdit = firebase.database().ref(`users/${googleUserId}/${profileId}`);
    profileToEdit.update({
        name: name,
        text: text,
    });
  */

// Google api console clientID and apiKey 

 var clientId = '693416465533-s2d3a9efrg9b7g4jequ6k4lgc40ssrgf.apps.googleusercontent.com';
 var apiKey = 'AIzaSyD1c8zNJkOLS7gGT5XUDyZCrS83m_mYbFU';

 // enter the scope of current project (this API must be turned on in the Google console)
   var scopes = 'https://www.googleapis.com/auth/calendar';


// OAuth2 functions
     function handleClientLoad() {
           gapi.client.setApiKey(apiKey);
           window.setTimeout(checkAuth, 1);
        }

// function initial(){
//   // 2. Initialize the JavaScript client library.
//   gapi.client.init({
//     'apiKey': apiKey,
//     // Your API key will be automatically added to the Discovery Document URLs.
//     'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
//     // clientId and scope are optional if auth is not required.
//     'clientId': clientId +'.apps.googleusercontent.com',
//     'scope': scopes,
//   })
// };
// // 1. Load the JavaScript client library.
// gapi.load('client', initial);


//To authenticate
  function checkAuth() {
    gapi.auth.authorize({ 
    client_id: clientId, 
    scope: scopes, immediate: true }
  , handleAuthResult);
        }

    // // Make an API call to create an event.  Give feedback to user.
    // var event = {
    //   'summary': 'Birthday',
    //   'location': 'Online',
    //   'description': 'Birthday reminder',
    //   'start': {
    //     'dateTime': 'birthday' + 'T09:00:00-07:00',
    //     'timeZone': 'America/Los_Angeles'
    //   },
    //   'end': {
    //     'dateTime': 'birthday' + 'T17:00:00-07:00',
    //     'timeZone': 'America/Los_Angeles'
    //   },
    //   'recurrence': [
    //     'RRULE:FREQ=YEARLY'
    //   ],
    //   'attendees': [
    //     {}
    //   ],
    //   'reminders': {
    //     'useDefault': true,
    //     'overrides': [
    //       {'method': 'popup', 'minutes': 40320}
    //     ]
    //   }
    // };
    
    // var request = gapi.client.calendar.event.insert({
    //   'calendarId': 'primary',
    //   'resource': 'event'
    // });
    
    // request.execute(function(event) {
    //   appendPre('Event created: ' + event.htmlLink);
    // });

    closeModal();

  document.addEventListener('DOMContentLoaded', function() {
    let birthday = document.getElementById('birthday');
    let instances = M.Datepicker.init(birthday);
  });


//countdown
function initializeTimer(endtime) {
  console.log(document.querySelector('.days'));
  const daysSpan = document.querySelector('.days');
  const hoursSpan = document.querySelector('.hours');
  const minutesSpan = document.querySelector('.minutes');
  const secondsSpan = document.querySelector('.seconds');

  function updateClock() {
    const t = countdown(endtime);

    daysSpan.innerHTML = t.days;
    hoursSpan.innerHTML = ('0' + t.hours);
    minutesSpan.innerHTML = ('0' + t.minutes);
    secondsSpan.innerHTML = ('0' + t.seconds);

  }

  updateClock();
  //const timeinterval = setInterval(updateClock, 1000);
}

const countdown = (birthdate) => {
    const timeRemaining = Date.parse(birthdate) - (Date.parse(new Date()));
    const seconds = Math.floor((timeRemaining/1000) / 60);
    const minutes = Math.floor((timeRemaining/1000/60) / 60);
    const hours = Math.floor((timeRemaining/(1000*60*60)) / 24);
    const days = Math.floor((timeRemaining/(1000*60*60*24)));
    
    return {
      timeRemaining,
      days,
      hours,
      minutes,
      seconds
    };
}

// console.log(birthdate);
// initializeTimer(birthdate);
//