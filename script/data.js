
var data;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}




// Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyD1YBSA5DcwjK92qsMeiYturKLA1Q2EQdw",
    authDomain: "matcha-82995.firebaseapp.com",
    projectId: "matcha-82995",
    storageBucket: "matcha-82995.appspot.com",
    messagingSenderId: "167793790051",
    appId: "1:167793790051:web:70537a57f4af22fd1b3c56",
    measurementId: "G-V0FTX11XTB"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);



  var provider = new firebase.auth.GoogleAuthProvider();
  var signedin = false;
  var initsnap = false;
  var data;

  $('#signin').click(()=>{
    firebase.auth()
    .signInWithRedirect(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;
  
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  });

  $('#logout').click(()=>{
    firebase.auth().signOut().then(() => {
        console.log('sign out successful')
      }).catch((error) => {
        // An error happened.
      });
  })
  
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        signedin=true;
        $('#signin').hide();
        $('#logout').show();
        $('table').show();

        var profile = firebase.auth().currentUser;
        $('#name').text(profile.displayName);
        $('#image').attr('src', profile.photoURL);
        $('.profile').css('opacity','1');


        db.collection("users").doc(profile.uid)
        .onSnapshot((doc) => {
            var source = doc.metadata.hasPendingWrites ? "Local" : "Server";
            if (source == 'Server' && initsnap){
                data = doc.data();
                refresh();
            }
        });
        
        db.collection("users").doc(firebase.auth().currentUser.uid).get().then(doc => {
            if (doc.exists) {
                data = doc.data();
                init();
            } else {
                data = {};
                init();
            }
        });


            
      // ...
    } else {
        signedin=false;
        data = {};
        $('.task').remove();
        $('#signin').show();
        $('#logout').hide();
        $('table').hide();
        $('#signin').focus();
        $('.profile').css('opacity','0');
      // User is signed out
      // ...
    }
  });











  /************************* FIRESTORE */

// Initialize Cloud Firestore through Firebase
  
  var db = firebase.firestore();


function save(){
    if (signedin){
        db.collection("users").doc(firebase.auth().currentUser.uid).set(data)
        .then(() => {
            //console.log("Document written with ID: " + firebase.auth().currentUser.uid);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
}

$('#backup').click(()=>{
    if (signedin){
        db.collection("backup").doc(firebase.auth().currentUser.uid).set(data)
        .then(() => {alert('Backup sucessful')})
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }
})


$('#save').click(()=>{save(); refresh()})

