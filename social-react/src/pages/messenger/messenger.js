import React from "react";
import ChatOnline from "../../components/chatOnline/chatOnline";
import Conversation from "../../components/conversations/conversation";
import Message from "../../components/message/message";
import Emoji from "../../components/textFieldEmoji/Emoji";
import Toolbar from "../../components/toolbar/toolbar";
import CircularLoading from "../../components/loading/loading2";
import CircularLoading2 from "../../components/loading/loading";
import SkeletonLoading from "../../components/loading/skeletonloading";
import "./messenger.scss";
import { AuthContextt } from "../../context/Auth/AuthContext";

import { fetchfriendscall } from "../../profilecalls";
import {
  addingNotification,
  getconversation,
  getmessages,
  getspecificconversation,
  postmessages,
} from "../../conversationcalls";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import socketconnection from "../../socketconnection";
import { OnlineContextt } from "../../context/Online/onlinecontext";
import { NotificationContextt } from "../../context/Notification/notificationcontext";
import {  removingNotification } from "../../context/Notification/Notificationaction";
export default function Messenger({arrivalmessage,currentchat,setcurrentchat,allUsers}) {
  const [loading, setloading] = React.useState(false);
  const [fetchconversation, setfetchconversation] = React.useState(false);
  const [fetchmessages, setfetchmessages] = React.useState(false);
  const [refreshingconversation, setrefreshingconversation] =
    React.useState(false);
  const { dispatch } =
    React.useContext(NotificationContextt);
  const [friends, setfriends] = React.useState([]);
  const { user } = React.useContext(AuthContextt);
  const message = React.useRef();
  const scrollref = React.useRef();
  const socket = React.useRef();

  const [typing, setyping] = React.useState("");
  const [openEmoji, setOpenEmoji] = React.useState(false);
  const [conversation, setconversations] = React.useState([]);
  const [messages, setmessages] = React.useState([]);
  
  const { onlineusers,allonlineusers } = React.useContext(OnlineContextt);

  React.useEffect(() => {
    socket.current = socketconnection;
   
    socket.current?.on("getconversation", (data) => {
      if (data.msg == "fetch") {
        setrefreshingconversation(!refreshingconversation);
      }
    });
    socket.current?.on("typing", (mes) => {
      setyping(mes);
    });
    socket.current?.on("stopped_typing", () => {
      setyping("");
    });

    return () => {
     setcurrentchat(null)
    }
  }, []);
 
  React.useEffect(() => {
    
    arrivalmessage &&
      currentchat &&
      currentchat.members?.includes(arrivalmessage.sender) &&
      setmessages([...messages, arrivalmessage]);
    
  }, [arrivalmessage]);

  React.useEffect(() => {
    getconversation(user, setconversations, setfetchconversation);
  }, [user._id, refreshingconversation]);
  React.useEffect(() => {
    getmessages(currentchat, setmessages, setfetchmessages);
  }, [currentchat]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setloading(true);
    const receiverid = currentchat.members.find(
      (member) => member !== user._id
    );
    const data = {
      message: message.current.value,
      conversationId: currentchat._id,
    };
 
    if(!(allonlineusers.length>0 && allonlineusers.some(item=>item.userid===receiverid)) ){
       await addingNotification(user._id,receiverid,"Chat")
    }

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId: receiverid,
      text: message.current.value,
    });
    await postmessages(data, setmessages, messages);
    socket.current?.emit("stopped_typing")
    message.current.value = "";
    setloading(false);
  };

  React.useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  React.useEffect(() => {
    fetchfriendscall(user, setfriends);
  }, [user]);

  const handleclick = async (currentuser) => {
    setfetchmessages(true);
    await getspecificconversation(
      user,
      setcurrentchat,
      currentuser,
      setrefreshingconversation,
      refreshingconversation
    );
    setfetchmessages(false);
  };
  return (
    <>
      <Toolbar allUsers={allUsers}></Toolbar>
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            {friends.length >0 ?
            <Autocomplete
              id="grouped-demo"
              // options={friends.sort((a, b) => -b.username.localeCompare(a.username))}
              groupBy={(option) => option?.username[0]}
              autoComplete
              // getOptionSelected={(option, value) => option === value}
              getOptionLabel={(option) => option?.username}
              onChange={(option, value) => handleclick(value)}
              options={friends.length > 0 ? friends.sort((a, b) => -b.username.localeCompare(a.username)): ["No friends found"]}
              renderInput={(params) => (
                <TextField {...params} label="Search for friends.." />
              )}
            />
            :   <Autocomplete
            id="grouped-demo"
            
            options={ ["No friends found"]}
            renderInput={(params) => (
              <TextField {...params} label="Search for friends.." />
            )}
          />
            
            
            }
            {fetchconversation ? (
              <SkeletonLoading type="conversation"></SkeletonLoading>
            ) : conversation.length > 0 ? (
              conversation.map((c, i) => {
                return (
                  <div
                    onClick={() => {
                      setcurrentchat(c);
                      removingNotification(c.memberDetails.user1._id != user._id
                        ? c.memberDetails.user1._id
                        : c.memberDetails.user2._id,dispatch,user._id,
                        "Chat");
                    }}
                    key={c._id}
                  >
                    <Conversation conversation={c} currentuser={user} />
                  </div>
                );
              })
            ) : (
              <div className="startConversation">Start a new conversation</div>
            )}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {fetchmessages ? (
              <CircularLoading2></CircularLoading2>
            ) : currentchat?._id ? (
              <>
                <div className="chatBoxTop">
                  {messages.length > 0 ? (
                    messages.map((message, index) => {
                      return (
                        <div ref={scrollref} key={index}>
                          <Message
                            message={message.message}
                            own={message.sender === user._id}
                            time={message.time}
                            photo={
                              currentchat?.memberDetails.user1._id ==
                              message.sender
                                ? currentchat?.memberDetails.user1
                                    .profilePicture
                                : currentchat?.memberDetails.user2
                                    .profilePicture
                            }
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div className="noConversationText"></div>
                  )}
                  {typing != "" && (
                    <div ref={scrollref}>
                    <Message
                      message={typing}
                      own={false}
                      time={null}
                      photo={
                        currentchat?.memberDetails.user1._id != user._id
                          ? currentchat?.memberDetails.user1.profilePicture
                          : currentchat?.memberDetails.user2.profilePicture
                      }
                    />
                    </div>
                  )}
                </div>
                <form className="chatBoxBottom" onSubmit={handlesubmit}>
                  <Emoji
                    username={""}
                    special={false}
                    innerRef={message}
                    open={openEmoji}
                    placeholder={"Write Something "}
                    setOpen={setOpenEmoji}
                    onChange={() => socket.current?.emit("typing")}
                    onBlur={()=> socket.current?.emit("stopped_typing")}
                  ></Emoji>

                  <button
                    className="chatSubmit"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularLoading colors="teal"></CircularLoading>
                    ) : (
                      "Send"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline chatOnlinehide">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineusers={onlineusers}
              currentuser={user}
              setcurrentchat={setcurrentchat}
              setfetchmessages={setfetchmessages}
              setrefreshingconversation={setrefreshingconversation}
              refreshingconversation={refreshingconversation}
            ></ChatOnline>
          </div>
        </div>
      </div>
    </>
  );
}
