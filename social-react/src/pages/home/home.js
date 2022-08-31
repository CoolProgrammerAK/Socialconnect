import React from "react";
import Feed from "../../components/feeds/feed";
import Rightbar from "../../components/rightbar/rightbar";
import Toolbar from "../../components/toolbar/toolbar";
import Sidebar from "../../components/sidebar/sidebar";
import "./home.scss";
import "react-toastify/dist/ReactToastify.css";
import ToastContainer from "../../components/toast/toastContainer";
export default function Home({allUsers}) {
  
  

  return (
    <>
      <Toolbar allUsers={allUsers}></Toolbar>
      <ToastContainer />
      <div className="homeContainer">
        <Sidebar></Sidebar>

        <Feed></Feed>

        <Rightbar allUsers={allUsers}></Rightbar>
      </div>
    </>
  );
}
