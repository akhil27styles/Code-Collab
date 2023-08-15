import React, { useState ,useEffect, Children} from 'react';

const Chat = ({socketRef,clients,roomId}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };
  const [typingStatus, setTypingStatus] = useState("")

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      console.log(message);
      let text=message;
      let Username="Anom";
      const senderSocketId = socketRef.current.id;
      const senderClient = clients.find(client => client.socketId === senderSocketId);
      console.log(senderClient);
      Username= senderClient.username;
      console.log(Username);
      socketRef.current.emit('sendMessage',{text,roomId,Username});
      setMessage('');
    }
  };
  useEffect(() => {
    if(socketRef.current){
      console.log('current');
    socketRef.current.on('receiveMessage',(text,Username)=>{
      console.log(text);
      console.log(Username);
      setChatMessages((prevMessages)=>[...prevMessages, { text, Username, type: 'received' }]);
    })
  }
  }, [socketRef.current])

  return (
    <div className={`chat-box ${isOpen ? 'expanded' : ''}`}>
      <div className="chat-icon" onClick={toggleChat}>
        <span>Chat</span>
        <span className="chat-icon">&#128172;</span>
      </div>
   
      {isOpen && (
        <div className="chat-content">
             {/* here I am not getting the chat messages I send */}
             <p>{typingStatus}</p>
             <div className='chat-messages-container'>
          <div className='chat-messages'>
          {
            chatMessages.map((msg,index)=>
              <div key={index}  className={`chat-message ${msg.type}`}>
                <div className='chat-user'>
          <span className="username">{msg.Username}</span>: {msg.text}
        </div>
                </div>
            )}
            </div>
            </div>
            <div className='chat-Input'>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            <span className="send-icon">&#10148;</span>
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
