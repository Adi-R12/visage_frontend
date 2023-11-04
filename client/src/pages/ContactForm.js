import React, { useState, useEffect, URL, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { database } from "./firebase";
import { useNavigate } from "react-router-dom";

import 'firebase/firestore';
import { getDatabase, ref, push } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { ref as sref } from "firebase/storage";
import { uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOuK2C_ae170J6QF442fmCmIEQn5nR9Tc",
  authDomain: "paperless-boarding-system.firebaseapp.com",
  databaseURL: "https://paperless-boarding-system-default-rtdb.firebaseio.com",
  projectId: "paperless-boarding-system",
  storageBucket: "paperless-boarding-system.appspot.com",
  messagingSenderId: "443459688884",
  appId: "1:443459688884:web:d530519c352c089349bae1",
  measurementId: "G-HBM7LM9MYK",
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
function generateUniqueNumericId() {
  // Get the current timestamp in milliseconds
  const timestamp = new Date().getTime();

  // Ensure that the generated ID is unique by appending a random number
  // This helps in cases where multiple IDs are generated within the same millisecond
  const uniqueId = timestamp * 1000 + Math.floor(Math.random() * 1000);

  return uniqueId;
}

const ContactForm = () => {
  const [UserDetails, setUserDetails] = useState({
    name: "",
    gender: "",
    dob: "",
    email: "",
    phoneNumber: "",
    photo: null,
    adhaarNumber: "",
    otp: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...UserDetails, [name]: value });
  };
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [mirrored, setMirrored] = useState(false);
  const [cameraOn, setCameraOn] = useState(1);

  const toggleCamera = () => {
    if (cameraOn) {
      webcamRef.current.video.pause();
      setCameraOn(false);
    } else {
      webcamRef.current.video.play();
      setCameraOn(true);
    }
  };
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  };

  const retake = () => {
    setImgSrc(null);
  };


  //   fileRef.put(imgSrc).then((snapshot) => {
  //     console.log("Uploaded a file:", snapshot.ref.fullPath);
  //   });
  // };
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imgSrc) {
      alert("Please select an image to upload.");
      return;
    }

    // Convert the base64 image to a Blob
    const base64Image = imgSrc.split(",")[1]; // Remove the data:image/jpeg;base64, part
    const byteArray = atob(base64Image);
    const array = [];
    for (let i = 0; i < byteArray.length; i++) {
      array.push(byteArray.charCodeAt(i));
    }
    const blob = new Blob([new Uint8Array(array)], { type: "image/jpeg" });
    const uniqueId = generateUniqueNumericId();
    const storageRef = sref(storage, "userImage/" + uniqueId + ".jpg");

    try {
      uploadBytes(storageRef, blob, { contentType: "image/jpeg" }).then(
        (snapshot) => {
          console.log("Uploaded a file:", snapshot.ref.fullPath);
          alert("Image uploaded successfully!");
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    // Handle form submission here, e.g., send data to a server or perform validation.
    // console.log(`Unique Numeric ID: ${uniqueId}`);
    const userDetailsRef = ref(database, "UserDetails");

    // Use the push method to generate a unique ID and set the data in one step
    push(userDetailsRef, { ...UserDetails, uniqueId })
      .then(() => {
        // Form submission was successful
        setSuccessMessage("Form submitted successfully!");
        setFormSubmitted(true);

        navigate("/");
      })
      .catch((error) => {
        // Handle any potential errors here
        console.error("Form submission error:", error);
      });

    // Clear the form inputs
    setUserDetails({
      name: "",
      gender: "",
      dob: "",
      email: "",
      phoneNumber: "",
      photo: null,
      adhaarNumber: "",
      otp: "",
    });
    console.log(UserDetails);
  };

  const handleGetOTP = () => {
    // Handle OTP generation or retrieval here.
    // You can implement this function as needed.
  };

  return (
    <div className="w-1/2 max-w-md mx-auto p-6 rounded-md bg-white shadow-md">
      <div className="flex justify-center"></div>
      <br />
      {formSubmitted ? (
        <p>{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={UserDetails.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={UserDetails.gender}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-Binary">Non-Binary</option>
            </select>
          </div>
          <div>
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={UserDetails.dob}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={UserDetails.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={UserDetails.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="container">
            {imgSrc ? (
              <img src={imgSrc} alt="webcam" />
            ) : (
              <Webcam
                height={600}
                width={600}
                ref={webcamRef}
                mirrored={mirrored}
                screenshotFormat="image/jpeg"
                screenshotQuality={0.8}
              />
            )}
            <div className="controls">
              <div>
                <input
                  type="checkbox"
                  checked={mirrored}
                  onChange={(e) => setMirrored(e.target.checked)}
                />
                <label>Mirror</label>
              </div>
            </div>
            <div className="btn-container flex justify-center ">
              {imgSrc ? (
                <button onClick={retake}>Retake photo</button>
              ) : (
                <div>
                  <button
                    onClick={toggleCamera}
                    className="bg-blue-400 text-white pl-2 pr-2 py-1 m-2 rounded-md"
                  >
                    {cameraOn ? "Turn Off Camera" : "Turn On Camera"}
                  </button>
                  <br />
                  <button
                    onClick={capture}
                    className="bg-blue-400 text-white pl-2 pr-2 py-1 m-2 rounded-md"
                  >
                    Capture photo
                  </button>
                </div>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="adhaarNumber">Aadhaar Number</label>
            <input
              type="text"
              id="adhaarNumber"
              name="adhaarNumber"
              value={UserDetails.adhaarNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleGetOTP}
              className="p-2 bg-blue-500 text-white rounded mr-3"
            >
              Get OTP
            </button>
            <input
              type="text"
              id="otp"
              name="otp"
              value={UserDetails.otp}
              onChange={handleInputChange}
              placeholder="Enter OTP"
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <button type="submit" className="p-2 bg-green-500 text-white rounded">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
