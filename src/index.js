import $ from 'jquery'
import { createUser } from './rest';
import { openConnection, sendPlainMessage } from './sockets';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
$(() => {
  $(document).on('submit', () => {
    const user = {
      email: $('#emailInput').val(),
      name: $('#userInput').val(),
      password: $('#passwordInput').val()
    }
    createUser(user);
  })

  $("#send-btn").on("click", () => {
    sendPlainMessage("MyUser", $('#message-input').val())
  })

})
openConnection();
