import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

export default function UserProfile(){

  const { username } = useParams();

  const [profile,setProfile] = useState(null);
  const [reels,setReels] = useState([]);

  useEffect(()=>{

    const loadProfile = async()=>{

      const q = query(
        collection(db,"users"),
        where("username","==",username)
      );

      const snap = await getDocs(q);

      snap.forEach(doc=>{
        setProfile(doc.data());
      });

      const reelsQuery = query(
        collection(db,"reels"),
        where("username","==",username)
      );

      const reelsSnap = await getDocs(reelsQuery);

      const arr=[];

      reelsSnap.forEach(doc=>{
        arr.push(doc.data());
      });

      setReels(arr);

    };

    loadProfile();

  },[username]);


  if(!profile) return <div className="p-10">Loading profile...</div>;

  const avatar =
    profile.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.displayName}`;

  return(

    <div className="p-10">

      {/* PROFILE HEADER */}

      <div className="flex items-center gap-6 mb-10">

        <img
          src={avatar}
          className="w-24 h-24 rounded-full border"
        />

        <div>

          <h1 className="text-2xl font-bold flex items-center gap-2">

            {profile.displayName}

            {profile.plan === "premium" && (
              <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded">
                GOLD
              </span>
            )}

          </h1>

          <p className="text-gray-500">
            @{profile.username}
          </p>

          <p className="mt-2">
            {profile.bio}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            {profile.state}, {profile.country}
          </p>

        </div>

      </div>

      {/* USER REELS */}

      <h2 className="text-xl font-semibold mb-4">
        Reels
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {reels.map((reel,i)=>(

          <video
            key={i}
            src={reel.videoUrl}
            controls
            className="rounded-lg"
          />

        ))}

      </div>

    </div>

  );

}