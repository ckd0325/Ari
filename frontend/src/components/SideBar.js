import React from "react";
import "../App.css";
import "../styles/SidebarMenu.css";
import { Link } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

const SideBar = ({ userState, nameState, isNew }) => {
  const userSideBar = (userState) => {
    switch (userState) {
      case 0: //비회원
        return (
          <div>
            <Link className="loginRegisterBtn" to="/loginRegister">
              <div>
                <span>로그인/회원가입</span>
              </div>
              <button>
                <img alt="" src="../images/arrow.png"></img>
              </button>
            </Link>
          </div>
        );
      case 1: //손님
        return (
          <div className="memberContainer">
            <div className="nicknameBtn" style={{ cursor: "default" }}>
              <div className="nicknameContainer">
                <span>{nameState}</span>
              </div>
            </div>
            <SidebarMenu userState={userState} />
          </div>
        );
      case 2: //사장님
        return (
          <div className="memberContainer">
            <Link className="nicknameBtn" to="/myPageOwner">
              <div className="nicknameContainer">
                <span>{nameState}</span>
              </div>
              <button>
                <img alt="" src="../images/arrow.png"></img>
              </button>
            </Link>
            <SidebarMenu userState={userState} isNew={isNew} />
          </div>
        );
      case 3:
        return (
          <div className="memberContainer">
            <Link className="nicknameBtn" to="/myPageOwner">
              <div className="nicknameContainer">
                <span>{nameState}</span>
              </div>
              <button>
                <img alt="" src="../images/arrow.png"></img>
              </button>
            </Link>
            <SidebarMenu userState={userState} isNew={isNew} />
          </div>
        );
      case 4:
        return (
          <div className="memberContainer">
            <Link className="nicknameBtn" to="/myPageUser">
              <div className="nicknameContainer">
                <span>{nameState}</span>
              </div>
              <button>
                <img alt="" src="../images/arrow.png"></img>
              </button>
            </Link>
            <SidebarMenu userState={userState} />
          </div>
        );
      default:
        return;
    }
  };

  return (
    <div className="sidebar slideAnimations">{userSideBar(userState)}</div>
  );
};

export default SideBar;
