import $ from 'jquery'
<<<<<<< HEAD
import { createUser , login, loginAsGuest} from './rest';
=======
import { createUser , login, activate} from './rest';
>>>>>>> bb9502e7b03e9669cdf3bbb6a8c4f598724cc18a
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
<<<<<<< HEAD
  $('#loginGuest').on('submit', (e) => {
    e.preventDefault();
    const user = {
      name: $('#guestName').val()
    }
    loginAsGuest(user);
  })

})






=======
  $('#activate').on('submit', (e) => {
    e.preventDefault();
    const user = {
      email: $('#activateEmail').val(),
      verifyCode: $('#verifyEmail').val()
    }
    activate(user);
  })
})


>>>>>>> bb9502e7b03e9669cdf3bbb6a8c4f598724cc18a
  $("#send-btn").on("click", () => {
    sendPlainMessage("MyUser", $('#message-input').val())
  })
  

openConnection();
