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

    <div className="p-10">

      {/* PROFILE HEADER */}

      <div className="flex items-center gap-4 mb-8">

        <img
          src={avatar}
          className="w-14 h-14 rounded-full"
        />

        <div>
          <h2 className="text-xl font-semibold">
            {userData?.displayName}
          </h2>

          <p className="text-gray-400">
            @{userData?.username}
          </p>
        </div>

      </div>

      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid md:grid-cols-5 gap-6">

        <Link
          to="/dashboard/study-reels"
          className="bg-[#0f172a] p-6 rounded-xl"
        >
          🎬 Study Reels
          <p className="text-gray-400">
            Create AI study reels
          </p>
        </Link>

        <Link
          to="/dashboard/image-generator"
          className="bg-[#0f172a] p-6 rounded-xl"
        >
          🖼 Image Generator
          <p className="text-gray-400">
            Create AI images
          </p>
        </Link>

        <Link
          to="/dashboard/my-reels"
          className="bg-[#0f172a] p-6 rounded-xl"
        >
          📚 My Reels
          <p className="text-gray-400">
            Your generated reels
          </p>
        </Link>

        <Link
          to="/dashboard/profile"
          className="bg-[#0f172a] p-6 rounded-xl"
        >
          👤 Profile
          <p className="text-gray-400">
            Edit your profile
          </p>
        </Link>

        <Link
          to="/dashboard/students"
          className="bg-[#0f172a] p-6 rounded-xl"
        >
          🔎 Search Friends
          <p className="text-gray-400">
            Find students near you
          </p>
        </Link>

      </div>

    </div>

  );

}