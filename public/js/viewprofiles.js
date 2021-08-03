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
const modal;
const addFriendModal = () => {
    modal = document.querySelector("#addFriendModal");
    modal.classList.add("is-active");

}
const closeModal = () => {
    modal.classList.remove("is-active");
}



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
       







const createProfile = () => {
    firebase.database().ref(`users/${googleUserId}`).push({
        name: document.querySelector("#name").value,
        image: document.querySelector("#imageUrl").value,
        birthday: document.querySelector("#birthday").value,
  })
  // 3. Clear the form so that we can write a new note
  .then(() => {
    document.querySelector("#name").value = "";
    document.querySelector("#imageUrl").value = "";
    document.querySelector("#birthday").value = "";closeModal();
  });
  
  

  
  
}

const getProfile = (userId) => {
    console.log(userId)
  /*const profileRef = firebase.database().ref(`users/${userId}`);
  profileRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });*/
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

