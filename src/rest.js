import { serverAddress } from "./constants"
import $ from 'jquery'
import { openChatRoom, sendPrivatePlainMessage, closeChatRoom } from './sockets';
let flag = false;
let size = 0;

const createUser = (user) => {
  if (!localStorage.getItem("token")) {
    fetch(serverAddress + "/sign/register", {
      method: 'POST',
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()
    ).then((response) => {
      alert(response.message);
    })
  }
  else {
    alert("Already logged-in, please logout first");
  };
}
const login = (user, document) => {
  if (!localStorage.getItem("token")) {
    fetch(serverAddress + "/sign/login", {
      method: 'POST',
      body: JSON.stringify({ email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()
    ).then((response) => {
      if (response.headers) {
        localStorage.setItem("token", response.headers);
        localStorage.setItem("userEmail", response.response.email);
        localStorage.setItem("nickname", response.response.nickname);
        localStorage.setItem("userType", response.response.userType);
      }
      alert(response.message);
    })
  }
  else {
    alert("Already logged-in, please logout first");
  };
}
const loginAsGuest = (user) => {
  if (!localStorage.getItem("token")) {
    fetch(serverAddress + "/sign/login/guest", {
      method: 'POST',
      body: JSON.stringify({ name: user.name }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()
    ).then((response) => {
      if (response.headers) {
        localStorage.setItem("token", response.headers);
        localStorage.setItem("userEmail", response.response.email);
        localStorage.setItem("nickname", response.response.nickname);
        localStorage.setItem("userType", response.response.userType);
      }
      alert(response.message);
    })
  }
  else {
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
    logOut();
    alert(response.message + " Please log-in again");
  });
}
const logOut = () => {
  if (localStorage.getItem("token")) {
    fetch(serverAddress + "/user/logout?token=" + localStorage.getItem("token"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()
    ).then((response) => {
      document.location.reload();
      alert(response.message);
    });
  }
  else {
    alert("Your are not logged-in, can't logout");
  }
}
const getAllUsers = (document) => {
  fetch(serverAddress + "/chat/getusers?token=" + localStorage.getItem("token"), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
  ).then((response) => {
    {
      if (localStorage.getItem("token")) {
        let div1 = document.getElementById("users");
        if (Array.isArray(response.response)) {
          response.response?.forEach(element => {
            let nameDiv = document.createElement("h6");
            let nameButton = document.createElement("button");
            let muteButton2 = document.createElement("button");
            let statusDiv = document.createElement("h6");
            let brButton = document.createElement("br");
            let hrButton = document.createElement("hr");
            nameDiv.setAttribute('id', "name-div-" + element.id);
            nameButton.setAttribute('id', "name-" + element.id);
            statusDiv.setAttribute('id', "status-" + element.id);
            muteButton2.setAttribute('id', "mute-" + element.id);
            nameDiv.setAttribute('style', "display:table; width:auto; background-color:#eee; border:1px solid  #666666; border-spacing:5px");
            nameButton.setAttribute('style', "display:table;  background-color: #000000; color: white; border: none; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block;font-size: 16px; border-spacing:5px");
            muteButton2.setAttribute('style', "background-color: #Ff0000; color: white; border: none; text-align: center; display: inline-block;font-size: 8px;");


            if (element.userType == "ADMIN") {
              nameDiv.innerHTML = element.nickname + " ";
              nameButton.innerHTML = "*" + element.nickname;
              statusDiv.innerHTML = element.userStatus;
            } else if (element.userType == "GUEST") {
              nameDiv.innerHTML = element.nickname + " ";
              !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute";
              statusDiv.innerHTML = element.userStatus + " ";

            } else {
              nameDiv.innerHTML = element.nickname + " ";
              nameButton.innerHTML = element.nickname;
              !element.mute ? muteButton2.innerHTML = "mute" : muteButton2.innerHTML = "unmute";
              statusDiv.innerHTML = element.userStatus;
            }

            if(element.userStatus == "AWAY"){
              statusDiv.setAttribute('style', "color: orange;");
            }
            else{
              statusDiv.setAttribute('style', "color: green;");
            }

            if (element.userType == "GUEST") {
              div1.appendChild(nameDiv);
              nameDiv.appendChild(statusDiv);
            }
            else if( localStorage.getItem("userType") != "GUEST"){
              div1.appendChild(nameButton);
              nameButton.appendChild(statusDiv);
            }
            else{
              div1.appendChild(nameDiv);
              nameDiv.appendChild(statusDiv);
            }

            if(element.userType != "ADMIN" && localStorage.getItem("userType") == "ADMIN"){
              div1.appendChild(muteButton2);
            }

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
      }
    }
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
      createPrivateChatAndWriteMessageHistory(response, document);
    });
}
const downloadPrivateChat = (roomId, document) => {
  fetch(serverAddress + "/chat/downloadprivatechatroom?token=" + localStorage.getItem("token") + "&roomId=" + roomId,
   {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(response => response.json()
    ).then((response) => {
      let exportPrivateChatArr = "";
      if (Array.isArray(response.response)) {
        response.response?.forEach(element => {
          exportPrivateChatArr += "[" + element.issueDate + "] " + element.sender + ": " + element.content + "\n";
        }
      )}
      let link = document.createElement("a");
      link.setAttribute("id", response.response[0].sender + "_" + response.response[0].receiver + ".csv");
      link.setAttribute("download", response.response[0].sender + "_" + response.response[0].receiver + ".csv");
      document.body.appendChild(link);
      let csvContent = "data:text/csv;charset=utf-8," + exportPrivateChatArr;
      let encodedUri = encodeURI(csvContent);
      link.setAttribute("href", encodedUri);
      link.click();
    });
}
const downloadMainChat = async (document) => {
 await fetch(serverAddress + "/chat/downloadmainchatroom?token=" + localStorage.getItem("token") + "&date=" + localStorage.getItem("dateStamp") + "&time=" + localStorage.getItem("timeStamp"),
   {
     method: 'GET',
     headers: {
       'Content-Type': 'application/json'
     }
   }).then(response => response.json()
   ).then((response) => {
    let exportMainChatArr = "";
    if (Array.isArray(response.response)) {
      response.response?.forEach(element => {
        exportMainChatArr += "[" + element.issueDate + "] " + element.sender + ": " + element.content + "\n";
      }
    )}
    let link = document.createElement("a");
    link.setAttribute("id", "mainChat" + ".csv");
    link.setAttribute("download", "mainChat" + ".csv");
    document.body.appendChild(link);
    let csvContent = "data:text/csv;charset=utf-8," + exportMainChatArr;
    let encodedUri = encodeURI(csvContent);
    link.setAttribute("href", encodedUri);
    link.click();
   });
}
const createPrivateChatAndWriteMessageHistory = (response, document) => {
  if (flag) {
    let div = document.getElementById('private-chat');
    div.removeChild(div.lastChild);
    closeChatRoom();
    flag = false;
  }

  openChatRoom(response.response[0].roomId);

  let mainDiv = document.getElementById('private-chat');
  let firstDiv = document.createElement("div");
  firstDiv.setAttribute('class', "col-9");
  firstDiv.setAttribute('id', "private-div" + response.response[0].roomId);
  mainDiv.appendChild(firstDiv);
  let secondDiv = document.createElement("h5");
  let h6Div = document.createElement("h2");
  h6Div.innerHTML = "Private Chat Room"
  firstDiv.appendChild(h6Div);
  secondDiv.innerHTML = response.response[0].sender + " - " + response.response[0].receiver;
  firstDiv.appendChild(secondDiv);
  let thirdDiv = document.createElement("textarea");
  thirdDiv.setAttribute('class', "form-control");
  thirdDiv.setAttribute('id', "private-chat-textarea" + response.response[0].roomId);
  thirdDiv.setAttribute('rows', "20");
  firstDiv.appendChild(thirdDiv);
  let fourDiv = document.createElement("div");
  fourDiv.setAttribute('class', "input-group mb-3");
  fourDiv.setAttribute('id', "private-div-inner" + response.response[0].roomId);
  firstDiv.appendChild(fourDiv);
  let fiveDiv = document.createElement("input");
  fiveDiv.setAttribute('type', "text");
  fiveDiv.setAttribute('id', "message-input-" + response.response[0].roomId);
  fiveDiv.setAttribute('class', "form-control");
  fiveDiv.setAttribute('placeholder', "Type your message here...");
  fiveDiv.setAttribute('aria-describedby', "private-send-btn");
  fourDiv.appendChild(fiveDiv);
  let sixDiv = document.createElement("button");
  sixDiv.setAttribute('class', "btn btn-outline-secondary");
  sixDiv.setAttribute('type', "button");
  sixDiv.setAttribute('id', "private-send-btn" + response.response[0].roomId);
  sixDiv.innerHTML = "Send";
  fourDiv.appendChild(sixDiv);
  let sevenDiv = document.createElement("button");
  sevenDiv.setAttribute('class', "btn btn-outline-secondary");
  sevenDiv.setAttribute('type', "button");
  sevenDiv.setAttribute('id', "private-download-btn" + response.response[0].roomId);
  sevenDiv.innerHTML = "Download Chat";
  fourDiv.appendChild(sevenDiv);
  flag = true;

  let textArea = document.getElementById("private-chat-textarea" + response.response[0].roomId);
  if (Array.isArray(response.response)) {
    response.response?.forEach(element => {
      textArea.value += "[" + element.issueDate + "] " + element.sender + ": " + element.content + "\n";
    })
  }

  $("#private-send-btn" + response.response[0].roomId).click(function () {
    sendPrivatePlainMessage(localStorage.getItem("nickname"), response.response[0].receiver, $("#message-input-" + response.response[0].roomId).val(), response.response[0].roomId);
  });

  $("#private-download-btn" + response.response[0].roomId).click(function () {
    downloadPrivateChat(response.response[0].roomId, document);
  });
}
const updateStatusUser = (user) => {
  if (localStorage.getItem("token")) {
    fetch(serverAddress + "/user/update/status?token=" + localStorage.getItem("token") + "&status=" + user.status, {
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
  else {
    alert("You are not logged-in, Can't update status");
  }
}
const showOldMessages = () => {
  getMainChatRoomMessages()
}
const updateProfile = (user) => {
  if (localStorage.getItem("token")) {
    fetch(serverAddress + "/user/update?token=" + localStorage.getItem("token"), {
      method: 'PUT',
      body: JSON.stringify({ nickname: user.nickname, email: user.email, name: user.name, password: user.password, dateOfBirth: user.dateOfBirth, photo: user.photo, description: user.description}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json())
      .then((response) => {
        alert(response.message + " Please log-in again");
        localStorage.clear();
        localStorage.removeItem(key);
      });
  }
  else {
    alert("You are not logged-in, can't update profile");
  }
}
const getMainChatRoomMessages = () => {
  size = size + 5;
  fetch(serverAddress + "/chat/mainchatroom?token=" + localStorage.getItem("token") + "&size=" + size,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json()
    ).then((response) => {
      displayMessages(response.response);
    });
}
const displayMessages = (arrMessages) => {
  $('#main-chat > div').remove();
  let textArea = document.getElementById("main-chat");
  textArea.value = ""
  if (Array.isArray(arrMessages)) {
    if(arrMessages.length != 0){
      localStorage.setItem("dateStamp", arrMessages[arrMessages.length -1].issueDate);
      localStorage.setItem("timeStamp", arrMessages[arrMessages.length -1].issueDateEpoch);
    }
    for (let index = arrMessages.length -1  ; index >= 0 ; index--) {
      const element = arrMessages[index];
      textArea.value += "[" + element.issueDate + "] " +  element.sender + ": \n" + element.content + "\n";
    }
  }
}
export { createUser, login, activate, getAllUsers, loginAsGuest, updateProfile, updateMuteUser, getMainChatRoomMessages, updateStatusUser, logOut, getPrivateChat, showOldMessages , downloadMainChat};