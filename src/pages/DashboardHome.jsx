import { auth } from "../services/firebase";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function DashboardHome() {

  const [userData,setUserData] = useState(null);

  useEffect(()=>{

    const loadUser = async()=>{

      const user = auth.currentUser;
      if(!user) return;

      const docRef = doc(db,"users",user.uid);
      const snap = await getDoc(docRef);

      if(snap.exists()){
        setUserData(snap.data());
      }

    };

    loadUser();

  },[]);

  const avatar =
    userData?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.displayName || "User"}`;

  return (

    <div>

      <div className="card">

        <div style={{display:"flex",alignItems:"center",gap:"15px"}}>

          <img src={avatar} className="avatar" />

          <div>
            <h2>{userData?.displayName}</h2>
            <p className="muted">@{userData?.username}</p>
          </div>

        </div>

      </div>

      <h1 style={{marginBottom:"20px"}}>Dashboard</h1>

      <div className="grid">

        <Link to="/dashboard/study-reels" className="card">
          🎬 Study Reels
          <p>Create AI study reels</p>
        </Link>

        <Link to="/dashboard/image-generator" className="card">
          🖼 Image Generator
          <p>Create AI images</p>
        </Link>

        <Link to="/dashboard/my-reels" className="card">
          📚 My Reels
          <p>Your generated reels</p>
        </Link>

        <Link to="/dashboard/profile" className="card">
          👤 Profile
          <p>Edit your profile</p>
        </Link>

        <Link to="/dashboard/students" className="card">
          🔎 Students
          <p>Find students near you</p>
        </Link>

      </div>

    </div>

  );

}