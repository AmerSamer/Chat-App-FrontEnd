import { serverAddress } from "./constants"
import $ from 'jquery'
import { openChatRoom, sendPlainMessage} from './sockets';


const createUser = (user) => {
  if(!localStorage.getItem("token")){
  fetch(serverAddress + "/sign/register", {
    method: 'POST',
    body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    alert(response.message);
  })}
  else{
    alert("Already logged-in, please logout first");
  };
}

const login = (user, document) => {
  if(!localStorage.getItem("token")){
  fetch(serverAddress + "/sign/login", {
    method: 'POST',
    body: JSON.stringify({ email: user.email, password: user.password }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    if(response.headers){
      localStorage.setItem("token", response.headers);
      localStorage.setItem("userName", response.userName);
      localStorage.setItem("userEmail", response.response.email);
      if(response.response.userType == "ADMIN"){
        document.getElementById('muteUnmute').removeAttribute("hidden");
      }
    }
    alert(response.message);
  })}
  else{
    alert("Already logged-in, please logout first");
  };
}

const loginAsGuest = (user) => {
  if(!localStorage.getItem("token")){
  fetch(serverAddress + "/sign/login/guest", {
    method: 'POST',
    body: JSON.stringify({ name: user.name }),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    if(response.headers){
      localStorage.setItem("token", response.headers);
      localStorage.setItem("userName", response.userName);
      localStorage.setItem("userEmail", response.response.email);
    }
    alert(response.message);
  })}
  else{
    alert("Already logged-in, please logout first");
  };
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
  fetch(serverAddress + "/user/logout?token=" + localStorage.getItem("token"), {
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
      if(localStorage.getItem("token")){
      let div1 = document.getElementById("users");
      if (Array.isArray(response.response)) {
        response.response?.forEach(element => {
          console.log(element);
          let nameDiv = document.createElement("h6");
          let nameButton = document.createElement("button");
          let muteButton2 = document.createElement("button");
          let statusDiv = document.createElement("h6");
          let brButton = document.createElement("br");
          let hrButton = document.createElement("hr");
          nameDiv.setAttribute('id', "name-" + element.id);
          nameButton.setAttribute('id', "name-" + element.id);
          statusDiv.setAttribute('id', "status-" + element.id);
          muteButton2.setAttribute('id', "mute-" + element.id);

          if (element.userType == "ADMIN") {
            nameDiv.innerHTML = "*" + element.email;
            nameButton.innerHTML = "*" + element.email;
            !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute"
            statusDiv.innerHTML = element.userStatus;
          } else if (element.userType == "GUEST") {
            nameButton.innerHTML = element.email;
            nameDiv.innerHTML = element.name;
            statusDiv.innerHTML = element.userStatus;

          } else {
            nameButton.innerHTML = element.email;
            nameDiv.innerHTML = element.email;
            statusDiv.innerHTML = element.userStatus;
          }

          if(element.userType == "GUEST"){
            div1.appendChild(nameButton);
            // div1.appendChild(nameDiv);
          }
          else{
            div1.appendChild(nameButton);

          }
          if (element.userType == "ADMIN") {
            div1.appendChild(muteButton2);
          }
          div1.appendChild(statusDiv);
          div1.appendChild(brButton);
          div1.appendChild(hrButton);


          $("#mute-" + element.id).click(function () {
            const user = {
              id: element.id,
            }
            updateMuteUser(user);
          });

          $("#name-" + element.id).click(function () {
            getPrivateChat(localStorage.getItem("userEmail"), element.id, document);
          });
        });
      }
    }}
  });
}

const updateMuteUser = (user) => {
  fetch(serverAddress + "/user/update/mute?token=" + localStorage.getItem("token") + "&id=" + user.id, {
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

const getPrivateChat = (senderEmail, receiverId, document) => {
  fetch(serverAddress + "/chat/privatechatroom?token=" + localStorage.getItem("token") +
   "&sender=" + senderEmail + "&receiver=" + receiverId,
   {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json()
    ).then((response) => {
      const room = {id: response.response[0].roomId};
      openChatRoom(room);
      // window.open('http://localhost:9000/chat/privatechat/' + room.id, '_blank');
      createChatAndWriteMessageHistory(response, document);
    });
}


const createChatAndWriteMessageHistory = (response, document) => {
  let mainDiv = document.getElementById('private-chat');
  let firstDiv = document.createElement("div");
  firstDiv.setAttribute('class', "col-9");
  mainDiv.appendChild(firstDiv);
  let secondDiv = document.createElement("h1");
  secondDiv.innerHTML = "Private Chat Room " + response.response[0].sender + "\n" + response.response[0].receiver;
  firstDiv.appendChild(secondDiv);
  let thirdDiv = document.createElement("textarea");
  thirdDiv.setAttribute('class', "form-control");
  thirdDiv.setAttribute('id', "private-chat-textarea" +  response.response[0].roomId);
  thirdDiv.setAttribute('rows', "20");
  firstDiv.appendChild(thirdDiv);
  let fourDiv = document.createElement("div");
  fourDiv.setAttribute('class', "input-group mb-3");
  firstDiv.appendChild(fourDiv);
  let fiveDiv = document.createElement("input");
  fiveDiv.setAttribute('type', "text");
  fiveDiv.setAttribute('id', "message-input" + response.response[0].roomId);
  fiveDiv.setAttribute('class', "form-control");
  fiveDiv.setAttribute('placeholder', "Type your message here...");
  fiveDiv.setAttribute('aria-describedby', "send-btn");
  fourDiv.appendChild(fiveDiv);
  let sixDiv = document.createElement("button");
  sixDiv.setAttribute('class', "btn btn-outline-secondary");
  sixDiv.setAttribute('type', "button");
  sixDiv.setAttribute('id', "private-send-btn" + + response.response[0].roomId);
  sixDiv.innerHTML = "Send";
  fourDiv.appendChild(sixDiv);


  let textArea = document.getElementById('private-chat-textarea' + response.response[0].roomId);
  if (Array.isArray(response.response)) {
    response.response?.forEach(element => {
      textArea.value += element.sender + ": " + element.content;
    }
  )}

  $("#private-send-btn-" + response.response[0].roomId).click(function () {
    sendPlainMessage(localStorage.getItem("userName"), $('#message-input' + + response.response[0].roomId).val())
  });
}

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
  }).then(response => response.json())
    .then((response) => {
      alert(response.message);})
    .catch(error => {

      console.log(error.headers);
    });
}

export { createUser, login, activate, getAllUsers, loginAsGuest, updateProfile, updateMuteUser, updateStatusUser, logOut, getPrivateChat};