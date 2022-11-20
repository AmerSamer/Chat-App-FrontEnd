import { serverAddress } from "./constants"

const createUser = (user) => {
    fetch(serverAddress + "/user", {
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
    })
  }



export{createUser,login}