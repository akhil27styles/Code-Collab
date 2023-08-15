import React, { useState, useEffect, useRef } from "react";
import "./NewChat.css"; // Import your CSS styles here
import "./NewChatJS.js"; // Import your CSS styles here

function NewChat({ socketRef, clients, roomId }) {
  const [isOpen, setBoxOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState("");

  function convertToInitials(name) {
    return name.replace(/ /g, "+");
  }

  const chatLogsRef = useRef(null);

  async function scrollBottom() {
    if (chatLogsRef.current) {
      chatLogsRef.current.scrollTop = chatLogsRef.current.scrollHeight;
    }
  }

  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  async function handleSendMessage() {
    if (message.trim() !== "") {
      console.log(message);
      let text = message;
      let Username = "Anom";
      const senderSocketId = socketRef.current.id;
      const senderClient = clients.find(
        (client) => client.socketId === senderSocketId
      );
      console.log(senderClient);
      Username = senderClient.username;
      setCurrentUser(Username);
      console.log(Username);
      // Emit the message and wait for the response
      // Emit the message and wait for it to complete
      new Promise((resolve) => {
        socketRef.current.emit(
          "sendMessage",
          { text, roomId, Username },
          () => {
            resolve(); // Resolve the promise when the message is emitted
          }
        );
      });

      setMessage("");
      scrollBottom();
    }
  }

  useEffect(() => {
    if (socketRef.current) {
      console.log("current");
      socketRef.current.on("receiveMessage", (text, Username) => {
        console.log(text + " " + Username);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { text, Username, type: "received" },
        ]);
      });
    }
  }, [socketRef.current]);

  return (
    <div id="chatBox">
      {!isOpen && (
        <div
          id="chat-circle"
          className="btn btn-raised"
          onClick={() => setBoxOpen(true)}
        >
          <div id="chat-overlay"></div>
          <i className="material-icons">speaker_phone</i>
        </div>
      )}

      {isOpen && (
        <div className="chat-box">
          <div className="chat-box-header">
            ChatBot
            <span className="chat-box-toggle" onClick={() => setBoxOpen(false)}>
              <i className="material-icons">close</i>
            </span>
          </div>
          <div className="chat-box-body">
            <div className="chat-box-overlay"></div>
            <div className="chat-logs" ref={chatLogsRef}>
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`chat-msg ${
                    msg.Username === currentUser ? "self" : "user"
                  }`}
                >
                  <span className="msg-avatar">
                    <img
                      src={`https://ui-avatars.com/api/?name=${convertToInitials(
                        msg.Username
                      )}&size=40&background=4067c2&color=fff`}
                      alt={convertToInitials(msg.Username)}
                    />
                  </span>
                  <div className="cm-msg-text">{msg.text}</div>
                </div>
              ))}
            </div>
            {/* <!--chat-log --> */}
          </div>
          <div className="chat-input">
            <div>
              <input
                type="text"
                id="chat-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                type="submit"
                onClick={() => {
                  handleSendMessage();
                  scrollBottom();
                }}
                class="chat-submit"
                id="chat-submit"
              >
                <i class="material-icons">send</i>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewChat;
