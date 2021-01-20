

const socket = io()
const $messageForm = document.querySelector('#message-form')
const $messageInput = $messageForm.querySelector('input')
const $messageButton = $messageForm.querySelector('button')
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector("#messages")
const $location = document.querySelector("#locations")


//Templates 

const messageTemplate = document.querySelector("#message-template").innerHTML

const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

// Options

const {username  , room  }= Qs.parse(location.search , { ignoreQueryPrefix : true})

const autoScroll = ()=>{
    //new message element
    const $newMsg = $messages.lastElementChild

    //Height of the new message
    
    const $newMsgStyles = getComputedStyle($newMsg)
    const $newMsgMargin = parseInt($newMsgStyles.marginBottom)
    const $newMsgHeight = $newMsg.offsetHeight + $newMsgMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages Container
    const containerHeight = $messages.scrollHeight

    //How far to scroll
    const scrollOffset = $messages.scrollTop + visibleHeight


    if (containerHeight - $newMsgHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight   
    }

}

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate , {
        username : message.username,
        message : message.text,
        createdAt : moment( message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend" , html)
    autoScroll()
})    

socket.on('locationMessage' , (message)=>{
    console.log(message.text)
    const html = Mustache.render(locationMessageTemplate , {
        username : message.username,
        url : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
}) 

socket.on('roomData' , (data)=>{
   const html = Mustache.render(sidebarTemplate ,{
       sideBarRoom : data.room,
       sideBarUsers:  data.users
   }) 
   document.querySelector("#sidebar").innerHTML = html
    
})
$messageForm.addEventListener('submit' , (e)=>{
    e.preventDefault()

    $messageButton.setAttribute('disabled' , 'disabled')

    const msg = e.target.elements.message.value
    socket.emit('sendMessage' , msg , (error)=>{
        $messageButton.removeAttribute('disabled') 
        $messageInput.value = ''
        $messageInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log("Message delivered")
    })
})

    $sendLocation.addEventListener('click' , ()=>{
    if (!navigator.geolocation) {
        console.log("Your browser does not Support Geolocation!")
    }
    $sendLocation.setAttribute('disabled' , 'disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        
        socket.emit('sendLocation' , {
            latitude : position.coords.latitude,
            longitude :  position.coords.longitude
        } , ()=>{
            console.log("Location sent!")
            $sendLocation.removeAttribute('disabled')
        })
        
    }) 
 
})



socket.emit('join' , {username , room} , (error)=>{
    if (error) {
        alert(error)
        location.href= '/'
    }
})