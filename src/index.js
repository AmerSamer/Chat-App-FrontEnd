import $ from 'jquery'

import { createUser , login,activate,getAllUsers, loginAsGuest, updateProfile, logOut, updateStatusUser} from './rest';
import { openConnection, sendPlainMessage } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
$(() => {
  $('#signup').on('submit', (e) => {
    e.preventDefault();
    const user = {
      email: $('#emailInput').val(),
      name: $('#userInput').val(),
      password: $('#passwordInput').val()
    }
    createUser(user);
  })
  $('#signin').on('submit', (e) => {
    e.preventDefault();
    const user = {
      email: $('#loginemail').val(),
      password: $('#loginpassword').val()
    }
    login(user, document);
  })
  $('#loginGuest').on('submit', (e) => {
    e.preventDefault();
    const user = {
      name: $('#guestName').val()
    }
    loginAsGuest(user);
  })
  $('#logOut').on('submit', (e) => {
    e.preventDefault();
    logOut();
  })
  $('#activate').on('submit', (e) => {
    e.preventDefault();
    const user = {
      email: $('#activateEmail').val(),
      verifyCode: $('#verifyEmail').val()
    }
    activate(user);
  })
  $('#update-profile-form').on('submit', (e) => {
    e.preventDefault();
    const user = {
      nickname: $('#updateNickname').val(),
      email: $('#updateEmail').val(),
      name: $('#updateName').val(),
      password: $('#updatePassword').val(),
      dateOfBirth: $('#updateDateOfBirth').val(),
      photo: $('#updatePhoto').val(),
      description: $('#updateDescription').val()
    }
    updateProfile(user);
  })
})


  $("#send-btn").on("click", () => {
    if(localStorage.getItem("userName")){
      if(localStorage.getItem("userName").includes("Guest-")){
        sendPlainMessage(localStorage.getItem("userName"), $('#message-input').val())
      }
      else{
        sendPlainMessage(localStorage.getItem("userEmail"), $('#message-input').val())
      }
    }
    else{
      alert("Login to send message");
    }
  })

  $("#userStatusOnline").on("click", () => {
    const user = {
      status: "online"
    }
      updateStatusUser(user);
  })

  $("#userStatusAway").on("click", () => {
    const user = {
      status: "away"
    }
      updateStatusUser(user);
  })


  $(document).ready(function(){
    getAllUsers(document)
  });

  setInterval(
    function() {
      $("#users").removeClass(function () {
        $(this).empty();
     });
      getAllUsers(document)
    }, 10000)

openConnection();
