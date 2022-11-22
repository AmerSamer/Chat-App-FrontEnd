import { serverAddress } from "./constants"

const createUser = (user) => {
    fetch(serverAddress + "/sign/register", {
      method: 'POST',
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
      console.log(response);
    });
  }

  const login = (user) => {
    fetch(serverAddress + "/sign/login", {
      method: 'POST',
      body: JSON.stringify({ email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
      console.log(response);
    });
  }

  const loginAsGuest = (user) => {
    fetch(serverAddress + "/sign/login/guest", {
      method: 'POST',
      body: JSON.stringify({ name: user.name}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
      console.log(response);
    });
  }

  const activate = (user) => {
    fetch(serverAddress + "/user/activate", {
      method: 'POST',
      body: JSON.stringify({ email: user.email, verifyCode: user.verifyCode }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
      console.log(response);
    });
  }

  const getAllUsers = (document) => {
    fetch(serverAddress + "/user", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()
    ).then( (response) => {
      {
        var div1 = document.getElementById("users");
        if(Array.isArray(response)){
        response?.forEach(element => {
          let addButton = document.createElement("button");
          if(element.type== "ADMIN"){
            addButton.innerHTML="*" + element.email;
            addButton.setAttribute('id', element.email);
          }else if(element.type== "GUEST"){
            addButton.innerHTML ="Guset-" + element.name;
            addButton.setAttribute('id', "Guset-" + element.name);
          }else{
            addButton.innerHTML=element.email;
            addButton.setAttribute('id', element.email);
          }
          div1.appendChild(addButton);
        });
       }
      }
    });
  }

  const updateProfile = (user) => {
    fetch(serverAddress + "/user/update", {
      method: 'PUT',
      body: JSON.stringify({ email: user.email, name: user.name, password: user.password , dateOfBirth: user.dateOfBirth , photo: user.photo }),
      headers: {
        'Content-Type': 'application/json'
      }
    }) .then((response) => response.text()).then((text) => {
        alert(text);
      });
  }

export{createUser,login,activate,getAllUsers,loginAsGuest,updateProfile};