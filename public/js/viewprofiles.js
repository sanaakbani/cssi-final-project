
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
}
const createCard = (profile, profileId) => {
  return `<div class="column is-one-quarter">
              <div class="card" id="noteId"> 
                  <header class="card-header"> 
                      <p class="card-header-title"> 
                          ${profile.name} 
                      </p> 
                  </header> 
                  <div class="card-content"> 
                      <div class="content">
                          ${profile.birthday} 
                      </div>
                      <div class = "card-footer">

                           <a href="#"
                             class= "card-footer-item"
                             onclick="editNote('${profileId}')">
                              Edit</a>

                          <a href="#"
                             class= "card-footer-item"
                             onclick="deleteNote('${profileId}')">
                              Delete</a>
                              
                      </div>


                  </div> 
              </div>
          </div>`;
};
const fileInput = document.querySelector('#imageFile input[type=file]');
fileInput.onchange = () => {
    const fileName = document.querySelector('#imageFile #fileNameLabel');
    fileName.textContent = fileInput.name;
};

const createProfile = () => {
  
  let storage = firebase.storage().ref(fileInput.name);

        //upload file
  let upload = storage.put(file);

        //update progress b


  firebase.database().ref(`users/${googleUserId}`).push({
      name: document.querySelector("#name").value,
      image: document.querySelector("#imageUrl").value,
      birthday: document.querySelector("#birthday").value,
  });
// 3. Clear the form so that we can write a new note
  closeModal();
  document.querySelector("#name").value = "";
  //document.querySelector("#imageUrl").value = "";
  document.querySelector("#birthday").value = "";

  
  

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


const deleteProfile= (profileId) => {
    
    const profileToDelete = firebase.database().ref(`users/${googleUserId}/${profileId}`);
    console.log("function worked");
     profileToDelete.remove();

}


const editProfile = (profileId) => {
    //console.log("edit" + profileId);
    const profileToEdit = firebase.database().ref(`users/${googleUserId}/${profileId}`);
    profileToEdit.on("value", (snapshot) => {
        const profile = snapshot.val();
        const editProfileModal = document.querySelector("#editProfileModal");
        const editProfileNameInput = document.querySelector("#editProfileNameInput");
        const editProfileTextInput = document.querySelector("#editProfileTextInput");

        document.querySelector("#editProfileId").value = profileId;        
    
    editProfileModal.classList.add("is-active");
    });
};


    closeModal();

  document.addEventListener('DOMContentLoaded', function() {
    var birthday = document.getElementById('birthday');
    var instances = M.Datepicker.init(elems );
  });

