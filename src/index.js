import $ from 'jquery'

import { createUser , login,activate,getAllUsers, loginAsGuest, updateProfile} from './rest';
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
    login(user);
  })
  $('#loginGuest').on('submit', (e) => {
    e.preventDefault();
    const user = {
      name: $('#guestName').val()
    }
    loginAsGuest(user);
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
      email: $('#updateEmail').val(),
      name: $('#updateName').val(),
      password: $('#updatePassword').val(),
      dateOfBirth: $('#updateDateOfBirth').val(),
      photo: $('#updatePhoto').val(),
    }
    updateProfile(user);
  })
})


  $("#send-btn").on("click", () => {
    sendPlainMessage("MyUser", $('#message-input').val())
  })

  $("#get-users-btn").on("click", () => {
    getAllUsers(document)
  })
  

openConnection();
