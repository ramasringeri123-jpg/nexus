import { useNavigate } from "react-router-dom";

export default function StudyReelsButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/dashboard/study-reels")}
      className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-semibold transition"
    >
      🎥 Study Reels
    </button>
  );
}