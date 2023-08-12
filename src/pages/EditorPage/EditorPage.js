import React, { useEffect, useState, useRef } from "react";
import Client from "../../components/Client";
import Ide from "../../components/Ide";
import { initSocket } from "../../socket";
import ACTIONS from "../../constants/Actions";
import { Navigate, useLocation, useNavigate, useParams } from "react-router";
import { toast } from "react-hot-toast";
import i18n from "../../constants/en";
import Chat from "../../components/Chat";
const EditorPage = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();

  const reactNavigator = useNavigate();
  const [clients, setclients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
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
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          console.log(clients);
          setclients(clients);

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
      socketRef.current?.off(ACTIONS.JOINED);
      socketRef.current?.off(ACTIONS.DISCONNECTED);
      socketRef.current?.disconnect();
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }

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
          <div className="button-container">
            <button className="btn copyBtn" onClick={copyRoomId}>
              {i18n.shareRoomInvite}
            </button>
            <button className="btn leaveBtn" onClick={leaveRoom}>
              {i18n.leaveButton}
            </button>
          </div>
        </div>
      </div>
      <Chat socketRef={socketRef} clients={clients} roomId={roomId} />
    </>
  );
};

export default EditorPage;
