const users = []

const adduser = ({ id,username,room}) => {

    username =username.trim().toLowerCase()
    room = room.toLowerCase().trim()
 
    if(!username||!room){
        return{
            error:'Username and room are required!'
        }
    }

    const existingUser =users.find((user) =>{
        return user.room===room&&user.username===username
    }) 
    // validate the username
    if(existingUser){
        return {
            error:'Username is in use'
        }
    }
    const user ={id,username,room }
    users.push(user)
    return{user}
}

const removeuser = (id) =>{
const index = users.findIndex((user) =>user.id===id)
if(index!==-1)
return users.splice(index,1)[0]
}

const getUser = (id) =>{
  return users.find((user) => user.id===id)
}

const getUsersInRoom = (room) =>{
    return users.filter((user) =>user.room===room)
}
module.exports={
    adduser,
    removeuser,
    getUser,
    getUsersInRoom  
}