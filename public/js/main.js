const chatForm = document.getElementById('chat-form');
const vidIdForm = document.getElementById('video-id-form');
const userList = document.getElementById('users');

const playButton = document.querySelector('#play-button');
const pauseButton = document.querySelector('#pause-button');

//getting username parameter

const queryString = window.location.search;

const urlParams = new URLSearchParams(queryString);

const username = urlParams.get('username')



const socket = io();


//send username to server

socket.emit('joinFun', username);

//message from serv
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
});

//listener for chat message

chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageBroad = e.target.elements.msg.value;

        //emit message to server
        socket.emit('chatMessage', messageBroad);

        //clear message bar
        document.getElementById('msg').value = '';
        document.getElementById('msg').focus();
    })
    //get users

socket.on('allUsers', (users) => {
    console.log(users)
    outputUsers(users);
})

//register the NAB

socket.on('checkNab', () => {
    document.getElementById("pause-button").style.visibility = 'visible';
    document.getElementById("play-button").style.visibility = 'visible';
    document.getElementById("video-id-form").style.visibility = 'visible';
})

//message to dom

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span class="space"></span><span class="time">${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    return document.querySelector('.chat-messages').prepend(div);
}

//output users to dom
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}


//add youtube iframe to website
$(document).ready( function() {
    loadPlayer();
  });
  
  vidIdForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const vidChangeId = vidIdForm.elements[0].value;
    console.log(e);
    //emit message to server
    socket.emit('vidid', vidChangeId);

    //clear message bar
    vidIdForm.value = '';
    vidIdForm.focus();
})
    socket.on('globalVid', (elem) => {
        const x = new String(elem);
        player.loadVideoById(x);
    })

  function getArtistId() {
    return 'l-gQLqv9f4o';
  }
  
  function loadPlayer() { 
    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
  
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  
      window.onYouTubePlayerAPIReady = function() {
        onYouTubePlayer();
      };
  
    } else {
  
      onYouTubePlayer();
  
    }
  }
  
  var player;
  
  function onYouTubePlayer() {
    player = new YT.Player('player', {
      height: '505',
      width: '853',
      videoId: getArtistId(),
      playerVars: { controls:0, showinfo: 0, rel: 0, showsearch: 0, iv_load_policy: 3 },
      events: {
        'onStateChange': onPlayerStateChange,
        'onError': catchError
      }
    });
  }
  
    var done = false;
    function onPlayerStateChange(event) {
        switch(event.data) {
            case 0:
                console.log('video ended');
                socket.emit('stopVideo', player.stopVideo());
                break;
            case 1:
                console.log('video playing from '+player.getCurrentTime());
                socket.emit('playVideoFrom', player.getCurrentTime());
                break;
            case 2:
                console.log('video paused at '+player.getCurrentTime());
                socket.emit('pauseVideoFrom', player.getCurrentTime())
        }
    }
    function onPlayerReady(event) {
        // $("#play-button").click(function () {
        //     player.playVideo();
        // });
        // $("#pause-button").click(function () {
        //     player.pauseVideo();
        // });
        // $("#stop-button").click(function () {
        //     player.stopVideo();
        // });
    }
    function catchError(event)
    {
      if(event.data == 100) console.log("Can't play, oopsie");
    }

    playButton.addEventListener('click', () => {
        socket.emit('play');
    });

    pauseButton.addEventListener('click', () => {
        socket.emit('pause');
    });

    socket.on('globalPlay', () => { 
            player.playVideo();
    });
    socket.on('globalPause', () => {
            player.pauseVideo();
    });

    //volume controls

    $(document).ready(function (e) {
      $("#volume").on("mousemove", function () {
        //alert();
        $(".vol").text($(this).val());
        player.setVolume($(this).val());
      });
    });