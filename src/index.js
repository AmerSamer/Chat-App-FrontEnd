import $ from 'jquery'
import { createUser , login, activate} from './rest';
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
  $('#activate').on('submit', (e) => {
    e.preventDefault();
    const user = {
      email: $('#activateEmail').val(),
      verifyCode: $('#verifyEmail').val()
    }
    activate(user);
  })
})


  $("#send-btn").on("click", () => {
    sendPlainMessage("MyUser", $('#message-input').val())
  })
  

openConnection();
