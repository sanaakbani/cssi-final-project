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
  var today = new Date();
  var dd = today.getDate()+1;
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  if(dd<10){
          dd='0'+dd
      } 
      if(mm<10){
          mm='0'+mm
      } 

  today = yyyy+'-'+mm+'-'+dd;
  document.querySelector("#birthday").setAttribute("min", today);
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
        initializeTimer(key);
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
let birthdateFormat;

const createCard = (profile, profileId) => {
  birthdateFormat = profile.birthday;
  console.log(birthdateFormat);
  
  let storageRef = firebase.storage().ref();
  console.log(storageRef);
  return storageRef.child(`users/${profile.image}`).getDownloadURL()
  .then((url) => {
    // `url` is the download URL for 'images/stars.jpg'// Or inserted into an <img> element
    console.log('image found', url);
    imageUrl = url;
    
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
                            <p>
                            <strong>Upcoming Birthday</strong>: 
                            <div id="${profileId}">
                            ${profile.birthday}
                            </div>
                            </p> 
                        </div>

                        <strong>Birthday Countdown!</strong>
                         <div id="timer">
                          <div>
                            <span class="days${profileId}"></span>
                          </div>
                          <div>
                            <span class="hours${profileId}"></span>
                          </div>
                          <div>
                            <span class="minutes${profileId}"></span>
                          </div>
                          <div>
                            <span class="seconds${profileId}"></span>
                          </div>
                        </div>
                        
                        <div class = "card-footer mt-4">

                            <a href="#"
                              class= "card-footer-item "
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
        gifts: "",
        message: "Hello Friend!&#13;&#10;&#13;&#10;Happy Birthday!&#13;&#10;&#13;&#10;Sincerely,&#13;&#10;Your loving friend"
    }).then(() => {
  // 3. Clear the form so that we can write a new note
    closeModal();
    
    });
};



  // document.addEventListener('DOMContentLoaded', function() {
  //   let birthday = document.getElementById('birthday');
  //   let instances = M.Datepicker.init(birthday);
  // });


//countdown
function initializeTimer(cardId) {
  const daysSpan = document.querySelector('.days' + cardId);
  const hoursSpan = document.querySelector('.hours' + cardId);
  const minutesSpan = document.querySelector('.minutes' + cardId);
  const secondsSpan = document.querySelector('.seconds' + cardId);

  function updateTimer() {
    const t = countdown(birthdateFormat);

    daysSpan.innerHTML = t.days + " Days";
    hoursSpan.innerHTML = (t.hours) + " Hours";
    minutesSpan.innerHTML = (t.minutes) + " Minutes";
    secondsSpan.innerHTML = (t.seconds) + " Seconds";

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
     seconds %= 60;-0
    
     return {
       timeRemaining,
       days,
       hours,
       minutes,
       seconds
    };
}

//console.log(birthdateFormat);

//