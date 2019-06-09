if (!window.WebSocket) {
	document.body.innerHTML = 'WebSocket is not supported.';
}

getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

const userid = getUniqueID();

// create connection
const socket = new WebSocket('ws://192.168.33.10:8081/?token=' + userid);
//const socket = new WebSocket("ws://localhost:8081/?token=" + userid);

// send message from from with name 'publish'
document.forms.publish.onsubmit = function() {  
  let outgoingMessage = {};
  outgoingMessage['message'] = this.message.value;
  outgoingMessage['user_id'] = userid;
  socket.send(JSON.stringify(outgoingMessage));
  return false;
};

// incoming from websocket server messages handler
socket.onmessage = function(event) {
  let incomingMessage = event.data;
  showMessage(incomingMessage); 
};

// show message in div#subscribe
function showMessage(message) {
  let messageElem = document.createElement('div');
  messageElem.appendChild(document.createTextNode(message));
  document.getElementById('subscribe').appendChild(messageElem);
}
