import React, { useEffect, useState, useRef } from "react";
import Client from "../../components/Client";
import Ide from "../../components/Ide";
import { initSocket } from "../../socket";
import ACTIONS from "../../constants/Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import NewChat from "../../components/NewChat";
const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [UsernName, setUsernName] = useState("");
  const reactNavigator = useNavigate();
  const [clients, setclients] = useState([]);
  useEffect(() => {
     const init = async () => {
      socketRef.current =  await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      function handleErrors(e) {
        console.log("socket error", e);
        toast.error("Socket connection failed , try again later.");
        reactNavigator("/");
      }
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      //listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          console.log(username);
          console.log(location.state?.username);
          console.log(socketId);
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          if(username===location.state?.username){
            setUsernName(username);
          }
          console.log(clients);

            setclients(clients); // Update the clients state

          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
   
      // listening for disconnecting
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setclients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      //cleaning when component unmount
      if (socketRef.current) {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
      }
    };
  }, []);

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <div className="mainWrap">
        <div className="edtiroWrap">
          <Ide
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
            UsernName={UsernName}
          />
        </div>
        <div className="aside">
          <div className="asideInner">
            <h3>Connected</h3>
            <div className="clientList">
              {clients.map((client) => (
                <Client key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <NewChat socketRef={socketRef} clients={clients} roomId={roomId} />
    </>
  );
};

export default EditorPage;
