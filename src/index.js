import $ from 'jquery'

import { createUser , login,activate,getAllUsers, loginAsGuest, updateProfile,showOldMessages, logOut, updateStatusUser, getMainChatRoomMessages, downloadMainChat} from './rest';
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
    $('#logOut').show();
    $('#loginGuest').hide();
    $('#signup').hide();
    $('#update-profile-form').show();
    $('#update-status').show();
    $('#users-lists').show();
  })
  $('#loginGuest').on('submit', (e) => {
    e.preventDefault();
    const user = {
      name: $('#guestName').val()
    }
    loginAsGuest(user);
    $('#logOut').show();
    $('#loginGuest').hide();
    $('#update-status').show();
    $('#users-lists').show();
  })
  $('#logOut').on('submit', (e) => {
    e.preventDefault();
    logOut();
    $('#logOut').hide();
    $('#loginGuest').show();
    $('#update-status').hide();
    $('#users-lists').hide();
    $('#update-profile-form').hide();
    $('#signup').show();

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
    if(localStorage.getItem("token")){
    if(localStorage.getItem("nickname")){
        sendPlainMessage(localStorage.getItem("nickname"), $('#message-input').val())
    }
    else{
      alert("Login to send message");
    }
  }
  else{
    alert("Login to send message");
  }})

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

  $("#show-old-messages").on("click", () => {
      showOldMessages();
  })

  $("#download-main-btn").on("click", () => {
    downloadMainChat(document);
  });

  $(document).ready(function(){
    getMainChatRoomMessages();
    $('#update-profile-form').hide();
    $('#logOut').hide();
    $('#update-status').hide();
    $('#users-lists').hide();
    localStorage.clear();
    localStorage.removeItem(key);
  });

  setInterval(
    function() {
      $("#users").removeClass(function () {
        $(this).empty();
     });
      if(localStorage.getItem("token")){
        getAllUsers(document)
      }
    }, 10000)

openConnection();
