import { serverAddress } from "./constants"

const createUser = (user) => {
    fetch(serverAddress + "/user/register", {
      method: 'POST',
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
      console.log(response.json());
    });
  }

  const login = (user) => {
    fetch(serverAddress + "/user/login", {
      method: 'POST',
      body: JSON.stringify({ email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
      console.log(response.json());
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
      console.log(response.json());
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
          addButton.setAttribute('id', element.email);
          addButton.innerHTML = element.email;
          div1.appendChild(addButton);
        });
       }
      }
    });
  }

  const loginAsGuest = (user) => {
    fetch(serverAddress + "/user/loginAsGuest", {
      method: 'POST',
      body: JSON.stringify({ name: user.name}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
      console.log(response);
    });
  }


export{createUser,login,activate,getAllUsers,loginAsGuest}

