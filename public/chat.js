const socket = io()
//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML   
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML  
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll=() =>{
const $newMessage = $messages.lastElementChild
$newMessage.scrollIntoView()
}

socket.on('message',(message) =>{
    if(!message.text=="")
    {
    console.log(message)
    const html = Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm:a DMMM')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
}
else
console.log('please write something')
})

socket.on('locationMessage',(message) =>{
    console.log(message)
const html = Mustache.render(locationMessageTemplate,{
    username:message.username,
    url:message.url,
    createdAt:moment(message.createdAt).format('h:mm:a DMMM')
})
$messages.insertAdjacentHTML('beforeend',html)
autoscroll()
})
socket.on('roomData',({room,users}) =>{
   const html = Mustache.render(sidebarTemplate,{
       room,
       users
   })
   document.querySelector('#sidebar').innerHTML=html
//console.log(users)
})
$messageForm.addEventListener('submit',(e) =>{
    e.preventDefault()
    
$messageFormButton.setAttribute('disabled','disabled')
    const message = $messageFormInput.value   
    socket.emit('sendMessage',message,(error) =>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
if(error)
return console.log(error)
    })
})
 
$sendLocationButton.addEventListener('click' ,() =>{
    if(!navigator.geolocation)
    console.log('Geolocation is not suppported on your browser')
    $sendLocationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) =>{
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },(error) =>{
if(error)   
return console.log(error)
$sendLocationButton.removeAttribute('disabled')
console.log('location is shared')
        })
    })
})
 
socket.emit('join',{username,room},(error) =>{
    if(error){
        alert(error)
        location.href = '/'
    }
})