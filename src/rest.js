import { serverAddress } from "./constants"

const createUser = (user) => {
    fetch(serverAddress + "/user/register", {
      method: 'POST',
      body: JSON.stringify({ name: user.name, email: user.email, password: user.password }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response) => { 
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



export{createUser,login,activate}
