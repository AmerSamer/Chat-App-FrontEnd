import { serverAddress } from "./constants"

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
    ).then( (response) => { 
      token = response.headers;
      alert(response.message);
    });
  }

  const loginAsGuest = (user) => {
    fetch(serverAddress + "/sign/login/guest", {
      method: 'POST',
      body: JSON.stringify({ name: user.name}),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json()
    ).then( (response) => { 
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
    ).then( (response) => { 
      console.log(response);
      alert(response.message);
    });
  }

  const getAllUsers = (document) => {
    fetch(serverAddress + "/user", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      }
    }).then(response => response.json()
    ).then( (response) => {
      {
        var div1 = document.getElementById("users");
        if(Array.isArray(response.response)){
        response.response?.forEach(element => {
          let addButton = document.createElement("button");
          console.log(element);
          addButton.setAttribute('id', element.id);
          if(element.userType== "ADMIN"){
            addButton.innerHTML="*" + element.email;
          }else if(element.userType== "GUEST"){
            addButton.innerHTML ="Guset-" + element.name;
          }else{
            addButton.innerHTML=element.email;
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
        'Content-Type': 'application/json',
        'token': token
      }
    })
    .then(response => response.json()
    ).then( (response) => { 
      console.log(response);
      alert(response.message);
    });
  }

export{createUser,login,activate,getAllUsers,loginAsGuest,updateProfile};