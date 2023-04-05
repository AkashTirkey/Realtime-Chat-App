// user functionality - when a user join/leave the room ,to get the user in a room 

// array
const users = [];

//join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };


    //pushing all the user elements to {users} array
    users.push(user);

    return user;
}

//get the current user
function getCurrentUser(id) {
    return users.find(user => user.id == id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id == id);

    if (index != -1) {
        return users.splice(index, 1)[0];

    }
}

//Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room == room)
}


module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers

};

