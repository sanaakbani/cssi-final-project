const addFriendModal = () => {
    document.querySelector("#addFriendModal").classList.add("is-active");
}
const closeModal = () => {
    document.querySelector("#addFriendModal").classList.remove("is-active");
}
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


  document.addEventListener('DOMContentLoaded', function() {
    var birthday = document.getElementById('birthday');
    var instances = M.Datepicker.init(elems, );
  });