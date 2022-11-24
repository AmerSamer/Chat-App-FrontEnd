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
    localStorage.setItem("usertoken", response.headers);
    localStorage.setItem("userName", response.userName);
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
    localStorage.setItem("usertoken", response.headers);
    localStorage.setItem("userName", response.userName);
    alert(response.message);
  });
}

const activate = (user) => {
  fetch(serverAddress + "/sign/activate", {
    method: 'POST',
    body: JSON.stringify({ email: user.email, verifyCode: user.verifyCode }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    alert(response.message);
  });
}

const logOut = () => {
  fetch(serverAddress + "/user/logout?token=" + token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    localStorage.removeItem("usertoken");
    localStorage.removeItem("userName");
    alert(response.message);
  });
}


const getAllUsers = (document) => {
  fetch(serverAddress + "/chat", {
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
          console.log(element);

          let nameButton = document.createElement("h6");
          let muteButton2 = document.createElement("button");
          let statusButton = document.createElement("button");
          let brButton = document.createElement("br");
          let hrButton = document.createElement("hr");
          nameButton.setAttribute('id', "name-" + element.id);
          muteButton2.setAttribute('id', "mute-btn-" + element.id);
          statusButton.setAttribute('id', "status-btn-" + element.id);

          if (element.userType == "ADMIN") {
            nameButton.innerHTML = "*" + element.email;
            !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute"
            statusButton.innerHTML = element.userStatus
          } else if (element.userType == "GUEST") {
            nameButton.innerHTML = "Guset-" + element.name;
            !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute"
            statusButton.innerHTML = element.userStatus
          } else {
            nameButton.innerHTML = element.email;
            !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute"
            statusButton.innerHTML = element.userStatus
          }

          div1.appendChild(nameButton);
          div1.appendChild(muteButton2);
          div1.appendChild(statusButton);
          div1.appendChild(brButton);
          div1.appendChild(hrButton);

          $("#mute-btn-" + element.id).click(function () {
            console.log(element.id);
            const user = {
              id: element.id,
            }
            updateMuteUser(user);
          });
          $("#status-btn-" + element.id).click(function () {
            console.log(element.id);
            const user = {
              id: element.id,
            }
            updateStatusUser(user);
          });
        });
      }
    }
  });
}
const updateMuteUser = (user) => {
  fetch(serverAddress + "update/mute/?id=" + user.id, {
    method: 'PATCH',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      'token': localStorage.getItem("usertoken")
    }
  })
    .then(response => response.json()
    ).then((response) => {
      alert(response);
    });
}
const updateStatusUser = (user) => {
  fetch(serverAddress + "update/status/?id=" + user.id, {
    method: 'PATCH',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
      'token': localStorage.getItem("usertoken")
    }
  })
    .then(response => response.json()
    ).then((response) => {
      alert(response);
    });
}
const updateProfile = (user) => {
  fetch(serverAddress + "/user/update?token=" + token, {
    method: 'PUT',
    body: JSON.stringify({ email: user.email, name: user.name, password: user.password, dateOfBirth: user.dateOfBirth, photo: user.photo }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json()
    ).then((response) => {
      alert(response.message);
    }).catch( (response) => {
      console.log(response)
    });
}

export { createUser, login, activate, getAllUsers, loginAsGuest, updateProfile, updateMuteUser, updateStatusUser, logOut };