const moment = require('moment');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('HH:mm')
    }
}

//send username to client

function formatUser(username, id) {
    return {
        username,
        id
    }
}


module.exports = {
    formatMessage,
    formatUser
};