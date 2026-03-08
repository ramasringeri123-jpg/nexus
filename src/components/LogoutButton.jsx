import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function LogoutButton() {

  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
    >
      Logout
    </button>
  );
}