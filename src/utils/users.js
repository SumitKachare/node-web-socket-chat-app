const users = []



const addUser = ({id , username , room})=>{
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username|| !room) {
        return {
            error : "UserName and Room are Required"
        }
    }

    //Check for existing User

    const existingUser= users.find((user)=>{
        return user.room === room && user.username === username
    })

    // validate Username
    if (existingUser) {
        return {
            error : "Username is already in Use"
        }    
    }

    // Store user
    const user = { id , username , room}
    users.push(user)
    return{ user}

}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)
    if (index !== -1) {
        return users.splice(index ,1)[0]  
    }
} 

const getUser = (id) =>{
    return users.find((user)=> user.id == id)
}

const getUsersInRoom = (room) =>{
    room = room.trim().toLowerCase()
    return users.filter((roomName)=> roomName.room == room)
}

 

// addUser({
//     id : 2,
//     username :'sumit',
//     room :'js'
// })


// addUser({
//     id : 12,
//     username :'mike',
//     room :'js'
// })

// addUser({
//     id : 22,
//     username :'sumit',
//     room :'php'
// })

// const getuser = getUser(12)
// console.log(getuser)

// const getRoomUser =  getUsersInRoom('js')
// console.log(getRoomUser)


module.exports = {
    addUser , 
    getUser,
    getUsersInRoom,
    removeUser
}

