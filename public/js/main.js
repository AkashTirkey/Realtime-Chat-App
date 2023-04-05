// code for the client side
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get username and room from url using querystring library
//destructuring of objects to target the 'username and room' from the url using QS 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true // this line of code is for ignoring the '?,&' symbol
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room })

//Get room & users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);

})


// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message); //vanilla js syntax for output!

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();


    // Get msg text
    const msg = e.target.elements.msg.value;


    // emitting a msg to server
    socket.emit('chatMessage', msg);

    //Clear input after sending a msg
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});





// Output msg to DOM ,DOM manipulation basically
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message'); // classlist function add all the classes defined in html, but here we wnat to add the class 'message'.
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

//ADD users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}