import { useEffect, useState } from "react";

export default function ReelLibrary() {

  const [currentReel, setCurrentReel] = useState(null);
  const [loading, setLoading] = useState(true);

  /* FETCH REEL WITH POLLING */

  const fetchNextReel = async () => {

    try {

      const res = await fetch("http://localhost:5000/reels");
      const data = await res.json();

      if (data.reels && data.reels.length > 0) {

        setCurrentReel(data.reels[0]);
        setLoading(false);

      } else {

        // try again after 2 seconds
        setTimeout(fetchNextReel, 2000);

      }

    } catch (err) {

      console.error("Fetch error:", err);

      setTimeout(fetchNextReel, 2000);

    }

  };

  /* INITIAL LOAD */

  useEffect(() => {

    fetchNextReel();

  }, []);

  /* NEXT VIDEO */

  const handleNext = () => {

    // immediately show loading screen
    setCurrentReel(null);
    setLoading(true);

    // start polling server
    fetchNextReel();

  };

  return (

    <div style={{
      padding:"40px",
      color:"white",
      display:"flex",
      flexDirection:"column",
      alignItems:"center"
    }}>

      <h2 style={{marginBottom:"20px"}}>AI Study Reels</h2>

      {loading && (

        <div style={{
          background:"#111827",
          padding:"30px",
          borderRadius:"10px",
          textAlign:"center",
          width:"320px"
        }}>

          <h3>Preparing next reel...</h3>

          <p>🧠 Writing script...</p>
          <p>🖼 Generating images...</p>
          <p>🎙 Creating voice...</p>
          <p>🎬 Rendering video...</p>

        </div>

      )}

      {!loading && currentReel && (

        <div style={{
          width:"340px",
          background:"#0f172a",
          padding:"20px",
          borderRadius:"12px",
          textAlign:"center"
        }}>

          <h4 style={{marginBottom:"10px"}}>
            {currentReel.topic}
          </h4>

          <video
            src={currentReel.videoUrl}
            controls
            width="300"
            style={{borderRadius:"8px"}}
          />

          <div style={{marginTop:"15px"}}>

            <button
              onClick={handleNext}
              style={{
                padding:"10px 20px",
                background:"#2563eb",
                border:"none",
                borderRadius:"8px",
                color:"white",
                cursor:"pointer"
              }}
            >
              Next Video
            </button>

          </div>

        </div>

      )}

    </div>

  );

}