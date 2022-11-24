import { serverAddress } from "./constants"
import $ from 'jquery'
let token = null;

const createUser = (user) => {
  fetch(serverAddress + "/sign/register", {
    method: 'POST',
    body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    alert(response.message);
  });
}

const login = (user) => {
  fetch(serverAddress + "/sign/login", {
    method: 'POST',
    body: JSON.stringify({ email: user.email, password: user.password }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    token = response.headers;
    console.log(token);
    alert(response.message);
  });
}

const loginAsGuest = (user) => {
  fetch(serverAddress + "/sign/login/guest", {
    method: 'POST',
    body: JSON.stringify({ name: user.name }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {

    token = response.headers;
    console.log(token);
    alert(response.message);
  });
}

const activate = (user) => {
  fetch(serverAddress + "/user/activate", {
    method: 'POST',
    body: JSON.stringify({ email: user.email, verifyCode: user.verifyCode }),
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  }).then(response => response.json()
  ).then((response) => {
    alert(response.message);
  });
}

const getAllUsers = (document) => {
  fetch(serverAddress + "/user", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    {
      var div1 = document.getElementById("users");
      if (Array.isArray(response.response)) {
        response.response?.forEach(element => {
          // console.log(element);

          let addButton = document.createElement("button");
          let addButton2 = document.createElement("button");
          let brButton = document.createElement("br");

          addButton.setAttribute('id', "email-" + element.id);
          addButton2.setAttribute('id', element.id);

          if (element.userType == "ADMIN") {
            addButton.innerHTML = "*" + element.email;
            !element.mute ? addButton2.innerHTML = "mute" : addButton2.innerHTML = "unmute"
          } else if (element.userType == "GUEST") {
            addButton.innerHTML = "Guset-" + element.name;
            !element.mute ? addButton2.innerHTML = "mute" : addButton2.innerHTML = "unmute"

          } else {
            addButton.innerHTML = element.email;
            !element.mute ? addButton2.innerHTML = "mute" : addButton2.innerHTML = "unmute"
          }

          div1.appendChild(addButton);
          div1.appendChild(addButton2);
          div1.appendChild(brButton);

          $("#" + element.id).click(function () {
            console.log(element.id);
            const user = {
              id: element.id,
            }
            updateMuteUser(user);
          });
        });
      }
    }
  });
}
const updateMuteUser = (user) => {
  console.log(user);
  console.log(token);
  fetch(serverAddress + "update/mute/?id=" + user.id,{
    method: 'PATCH',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  })
    .then(response => response.json()
    ).then((response) => {
      alert("updated 2 to mute");
    });
}

const updateProfile = (user) => {
  fetch(serverAddress + "/user/update", {
    method: 'PUT',
    body: JSON.stringify({ email: user.email, name: user.name, password: user.password, dateOfBirth: user.dateOfBirth, photo: user.photo }),
    headers: {
      'Content-Type': 'application/json',
      'token': token
    }
  })
    .then(response => response.json()
    ).then((response) => {
      alert(response.message);
    });
}

export { createUser, login, activate, getAllUsers, loginAsGuest, updateProfile, updateMuteUser };