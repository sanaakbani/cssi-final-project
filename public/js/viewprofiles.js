
// Google api console clientID and apiKey 

 var clientId = '527545903091-ab69g0d920goo8m76hqv52akr249cqf5.apps.googleusercontent.com';
 var apiKey = 'AIzaSyAw7VKN_gkpNTfk2P11SjKnC3EiFhPlWdU';

 // enter the scope of current project (this API must be turned on in the Google console)
   var scopes = 'https://www.googleapis.com/auth/calendar';


// OAuth2 functions
     function handleClientLoad() {
           gapi.client.setApiKey(apiKey);
           window.setTimeout(checkAuth, 1);
        }

//To authenticate
  function checkAuth() {
    gapi.auth.authorize({ client_id: clientId, scope: scopes, immediate: true }, handleAuthResult);
        }

// This is the resource we will pass while calling api function
// var resource = {
//             "summary": "My Event",
//             "start": {
//                 "dateTime": today
//             },
//             "end": {
//                 "dateTime": twoHoursLater
//             },
//             "description":"We are organizing events",
//             "location":"US",
//             "attendees":[
//             {
//                     "email":"attendee1@gmail.com",
//                     "displayName":"Jhon",
//                     "organizer":true,
//                     "self":false,
//                     "resource":false,
//                     "optional":false,
//                     "responseStatus":"needsAction",
//                     "comment":"This is my demo event",
//                     "additionalGuests":3
//                     
//             },
//             {    
//                 "email":"attendee2@gmail.com",
//                     "displayName":"Marry",
//                     "organizer":true,
//                     "self":false,
//                     "resource":false,
//                     "optional":false,
//                     "responseStatus":"needsAction",
//                     "comment":"This is an official event",
//                     "additionalGuests":3
//             }
//             ],
//         };

function makeApiCall(){
gapi.client.load('calendar', 'v3', function () { // load the calendar api (version 3)
                var request = gapi.client.calendar.events.insert
                ({
                  //  'calendarId': '24tn4fht2tr6m86efdiqqlsedk@group.calendar.google.com', 
// calendar ID which id of Google Calendar where you are creating events. this can be copied from your Google Calendar user view.

                  //  "resource": resource     // above resource will be passed here
                });               
})
}

let googleUserId;
googleUserId = user.uid;
getNotes(googleUserId);
/*
window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};
*/
const getProfiles = (userId) => {
  const profileRef = firebase.database().ref(`users/${userId}`);
  profileRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};



const getProfile = (userId) => {
  const profileRef = firebase.database().ref(`users/${userId}`);
  profileRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
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



const createCard = (profile, profileId) => {
    return `<div class="column is-one-quarter">
                <div class="card" id="noteId"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${profile.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${profile.text} 
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
        const editProfileTitleInput = document.querySelector("#editProfileTitleInput");
        const editProfileTextInput = document.querySelector("#editProfileTextInput");

        document.querySelector("#editProfileId").value = profileId;        
    
    editProfileModal.classList.add("is-active");
    });
};

const closeModal = (profileId) => {
    //console.log("edit" + profileId);
    const closeProfileModal = document.querySelector("#editProfileModal");
    editProfileModal.classList.remove("is-active");
};


const saveChanges = () => {
    //console.log("edit" + profileId);
    const editProfileTitleInput = document.querySelector("#editProfileTitleInput");
    const editProfileTextInput = document.querySelector("#editProfileTextInput");
    const editProfileId = document.querySelector("#editProfileId");

    const title = editProfileTitleInput.value;
    const text = editProfileTextInput.value;
    const profileId = editProfileId.value;

    const profileToEdit = firebase.database().ref(`users/${googleUserId}/${profileId}`);
    profileToEdit.update({
        title: title,
        text: text,
    });

    closeModal();
};
