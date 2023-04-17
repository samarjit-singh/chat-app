import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";

const SetAvatar = () => {
  const api = "https://api.multiavatar.com";
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again", toastOptions);
      }
    }
  };

  // const getAvatars = async () => {
  //   const data = [];
  //   for (let i = 0; i < 4; i++) {
  //     const image = await axios.get(
  //       `${api}/${Math.round(Math.random() * 1000)}`
  //     );
  //     const buffer = Buffer.from(image.data);
  //     data.push(buffer.toString("base64"));
  //   }
  //   return data;
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const avatarsData = await getAvatars();
  //     setAvatars(avatarsData);
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, []);

  // https://api.dicebear.com/6.x/pixel-art/svg?seed=Bunty-

  useEffect(() => {
    async function fetchData() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        data.push(
          `https://api.dicebear.com/6.x/pixel-art/svg?seed=Bunty-${
            Math.random() * 1000
          }`
        );
      }
      setAvatars(data);
      setIsLoading(false);
    }
    fetchData();
  }, [api, navigate]);

  // useEffect(async () => {
  //   const data = [];
  //   for (let i = 0; i < 4; i++) {
  //     const image = await axios.get(
  //       `${api}/${Math.round(Math.random() * 1000)}`
  //     );
  //     const buffer = new Buffer.from(image.data);
  //     data.push(buffer.toString("base64"));
  //   }
  //   setAvatars(data);
  //   setIsLoading(false);
  // }, []);

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an avatar</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    src={avatar}
                    alt="avatar"
                    key={index}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  overflow: hidden;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0rem;
    }
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    @media (max-width: 768px) {
      padding: 0.5rem 2rem;
    }
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;

export default SetAvatar;
