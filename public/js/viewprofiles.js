let googleUserId;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getProfile(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};
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
      destination.innerHTML += createCard(profile, key);
  }
};
const addFriendModal = () => {
  const modal = document.querySelector("#addFriendModal");
  modal.classList.add("is-active");

}
const closeModal = () => {
  const modal = document.querySelector("#addFriendModal");
  modal.classList.remove("is-active");
  document.querySelector("#name").value = "";
  document.querySelector('#imageFile #fileNameLabel').value = ""
  uploadedFile = "";
  document.querySelector("#birthday").value = "";
}

const createCard = (profile, profileId) => {
  let storageRef = firebase.storage().ref();
  console.log(storageRef);
  storageRef.child(`users/${profile.image}`).getDownloadURL()
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'// Or inserted into an <img> element
    console.log('image found', url);
  })
  .catch((error) => {
    console.log('image not found', error);
    // Handle any errors
  });
  return `<div class="column is-one-quarter">
              <div class="card" id="noteId"> 
                  <header class="card-header"> 
                      <p class="card-header-title"> 
                          ${profile.name} 
                      </p> 
                  </header> 
                  <div class="card-content"> 
                      <div class="content">
                          <img src="${profile.image}" alt="friend's image">
                          <p><strong>Birthday</strong>: ${profile.birthday}</p> 
                      </div>
                      <div class = "card-footer">

                           <a href="#"
                             class= "card-footer-item"
                             onclick="editProfile('${profileId}')">
                              Edit</a>

                          <a href="#"
                             class= "card-footer-item"
                             onclick="deleteProfile('${profileId}')">
                              Delete</a>
                              
                      </div>


                  </div> 
              </div>
          </div>`;
};
const deleteProfile= (profileId) => {
    
    const profileToDelete = firebase.database().ref(`users/${googleUserId}/${profileId}`);
    console.log("function worked");
     profileToDelete.remove();

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
  if(document.querySelector("#state").value != null) {
    const profileToEdit = firebase.database().ref(`users/${googleUserId}/${document.querySelector("#state").value}`);
    profileToEdit.update({
        name: document.querySelector("#name").value,
        image: uploadedFile,
        birthday: document.querySelector("#birthday").value,
    });
    closeModal();
    document.querySelector("#state").value = null;
  } else {
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
        console.log("failed");
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
}
  
  

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

function initial(){
  // 2. Initialize the JavaScript client library.
  gapi.client.init({
    'apiKey': apiKey,
    // Your API key will be automatically added to the Discovery Document URLs.
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    // clientId and scope are optional if auth is not required.
    'clientId': clientId +'.apps.googleusercontent.com',
    'scope': scopes,
  })
};
// 1. Load the JavaScript client library.
gapi.load('client', initial);


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
    var birthday = document.getElementById('birthday');
    var instances = M.Datepicker.init(elems );
  });

