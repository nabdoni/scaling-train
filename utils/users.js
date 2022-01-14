const users = [];

//join user to chat

function userJoin(id, username, isNab) {
    const user = { id, username, isNab };
    users.push(user);
    return user;
}

//get current user
function getUserById(id) {
    return users.find(e => e.id == id);
}

//user leaves
function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1);
    }
}

//get users in chat
function getUsers() {
    return users;
}

//check if user is nab

function checkIfNab(id) {
    let userInQuestion = users.find(e => e.id == id);
    if (userInQuestion.username == "Nab") {
        return true;
    }
}


module.exports = {
    userJoin,
    getUserById,
    userLeaves,
    getUsers,
    checkIfNab
}