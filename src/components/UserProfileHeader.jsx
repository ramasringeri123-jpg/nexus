import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function UserProfileHeader() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    const loadProfile = async () => {

      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }

    };

    loadProfile();

  }, []);

  if (!profile) return null;

  const avatar =
    profile.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${profile.displayName}`;

  return (

    <div className="flex items-center gap-4 mb-8">

      <img
        src={avatar}
        className="w-14 h-14 rounded-full border border-gray-600"
      />

      <div>

        <div className="flex items-center gap-2">

          <h2 className="text-lg font-semibold">
            {profile.displayName}
          </h2>

          {profile.plan === "premium" && (
            <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded">
              GOLD
            </span>
          )}

        </div>

        <p className="text-gray-400 text-sm">
          @{profile.username}
        </p>

      </div>

    </div>

  );

}