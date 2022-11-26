import { serverAddress } from "./constants"
let token = null;

const createUser = (user) => {
  if(localStorage.getItem("token")){
    logOut();
  }
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

const login = (user, document) => {
  if(localStorage.getItem("token")){
    logOut();
  }
  fetch(serverAddress + "/sign/login", {
    method: 'POST',
    body: JSON.stringify({ email: user.email, password: user.password }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    if(response.headers){
      token = response.headers;
      localStorage.setItem("token", response.headers);
      localStorage.setItem("userName", response.userName);
      localStorage.setItem("userEmail", response.response.email);
      if(response.response.userType == "ADMIN"){
        document.getElementById('muteUnmute').removeAttribute("hidden");
      }
    }
    alert(response.message);
  });
}

const loginAsGuest = (user) => {
  if(localStorage.getItem("token")){
    logOut();
  }
  fetch(serverAddress + "/sign/login/guest", {
    method: 'POST',
    body: JSON.stringify({ name: user.name }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    if(response.headers){
      token = response.headers;
      localStorage.setItem("token", response.headers);
      localStorage.setItem("userName", response.userName);
      localStorage.setItem("userEmail", response.response.email);
    }
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
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
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

          let nameDiv = document.createElement("h6");
          // let muteButton2 = document.createElement("button");
          let statusDiv = document.createElement("h6");
          let brButton = document.createElement("br");
          let hrButton = document.createElement("hr");
          nameDiv.setAttribute('id', "name-" + element.id);
          statusDiv.setAttribute('id', "status-" + element.id);

          if (element.userType == "ADMIN") {
            nameDiv.innerHTML = "*" + element.email;
            // !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute"
            statusDiv.innerHTML = element.userStatus
          } else if (element.userType == "GUEST") {
            nameDiv.innerHTML = element.name;
            // !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute"
            statusDiv.innerHTML = element.userStatus
          } else {
            nameDiv.innerHTML = element.email;
            // !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute"
            statusDiv.innerHTML = element.userStatus
          }

          div1.appendChild(nameDiv);
          // div1.appendChild(muteButton2);
          div1.appendChild(statusDiv);
          div1.appendChild(brButton);
          div1.appendChild(hrButton);


          // $("#status-" + element.id).click(function () {
          //   console.log(element.id);
          //   const user = {
          //     id: element.id,
          //   }
          //   updateStatusUser(user);
          // });
        });
      }
    }
  });
}
// const updateMuteUser = () => {
//   fetch(serverAddress + "update/mute?token=" + localStorage.getItem("token"), {
//     method: 'PATCH',
//     body: JSON.stringify({}),
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   })
//     .then(response => response.json()
//     ).then((response) => {
//       alert(response);
//     });
// }

const updateStatusUser = (user) => {
  fetch(serverAddress + "/user/update/status?token=" + localStorage.getItem("token") + "&status=" + user.status,  {
    method: 'PATCH',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json()
    ).then((response) => {
      alert(response.message);
    });
}

const updateProfile = (user) => {
  fetch(serverAddress + "/user/update?token=" + localStorage.getItem("token"), {
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