const socket = io()
const chatbox = document.getElementById('chatbox')
let user = sessionStorage.getItem('user') || ''

function playMessageSound() {
    const audio = new Audio('/static/js/sent.mp3');
    audio.play();
}

if (!user) {
    Swal.fire({
        title: 'Welcome',
        input: 'text',
        text: 'Set username',
        inputValidator: value => {
            return !value.trim() && 'Please. write a username'
        },
        allowOutsideClick: false
    }).then(result => {
        user = result.value
        document.getElementById('username').innerHTML = user
        sessionStorage.setItem("user", user)
        socket.emit('new', user)
    })
    // Enviar mensajes:
    chatbox.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            const message = chatbox.value.trim()
            if (message.length > 0) {
                socket.emit('message', {
                    user,
                    message
                })
                chatbox.value = ''
                playMessageSound();
            }
        }
    })
} else {
    document.getElementById('username').innerHTML = user
    socket.emit('new', user)
}
// Recibir mensajes:
socket.on('logs', data => {
    const divLogs = document.getElementById('logs')
    let messages = ''

    data.forEach(msn => {
        messages = `<p><i>${msn.user}</i>: ${msn.message}</p>` + messages
    })
    divLogs.innerHTML = messages
    playMessageSound();
})