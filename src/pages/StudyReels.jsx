import { useState } from "react";

export default function StudyReels() {

  const [topic,setTopic] = useState("");
  const [videoUrl,setVideoUrl] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");
  const [eta,setEta] = useState(0);

  const API = "https://nexus-api-q4u2.onrender.com";

  /* =========================
     GENERATE VIDEO
  ========================= */

  const generateVideo = async () => {

    if(!topic.trim()){
      setError("Enter a topic first");
      return;
    }

    setLoading(true);
    setError("");
    setVideoUrl(null);

    /* ETA TIMER */

    let time = 45;
    setEta(time);

    const timer = setInterval(()=>{
      time--;
      setEta(time);
      if(time<=0){
        clearInterval(timer);
      }
    },1000);

    try{

      const res = await fetch(`${API}/generate-video`,{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          topic
        })

      });

      const data = await res.json();

      clearInterval(timer);

      if(data.videoUrl){

        setVideoUrl(data.videoUrl);

      }else{

        setError("Video generation failed.");

      }

    }catch(err){

      console.error(err);

      setError("Server connection failed.");

    }

    setLoading(false);

  };

  /* =========================
     LOAD NEXT VIDEO
  ========================= */

  const loadNext = async ()=>{

    setLoading(true);
    setError("");

    try{

      const res = await fetch(`${API}/reels`);

      const data = await res.json();

      if(data.reels && data.reels.length>0){

        setVideoUrl(data.reels[0].videoUrl);

      }else{

        setError("Next video still processing...");

      }

    }catch(err){

      console.error(err);
      setError("Unable to load next reel");

    }

    setLoading(false);

  };

  /* =========================
     UI
  ========================= */

  return(

    <div style={{
      padding:"40px",
      color:"white"
    }}>

      {/* TITLE */}

      <h1 style={{
        fontSize:"34px",
        marginBottom:"20px"
      }}>
        🎬 AI Study Reels
      </h1>

      {/* INPUT AREA */}

      <div style={{

        display:"flex",
        gap:"12px",
        alignItems:"center"

      }}>

        <input

          type="text"

          placeholder="Enter topic (Example: Quantum Physics)"

          value={topic}

          onChange={(e)=>setTopic(e.target.value)}

          style={{

            width:"420px",
            padding:"14px",
            borderRadius:"10px",
            border:"1px solid #333",
            background:"#0f172a",
            color:"white",
            outline:"none",
            fontSize:"16px"

          }}

        />

        <button

          onClick={generateVideo}

          disabled={loading}

          style={{

            padding:"14px 26px",
            borderRadius:"10px",
            border:"none",
            background:"linear-gradient(90deg,#6366f1,#9333ea)",
            color:"white",
            fontSize:"16px",
            cursor:"pointer"

          }}

        >

          Generate Reel

        </button>

      </div>

      {/* LOADING BOX */}

      {loading && (

        <div style={{

          marginTop:"30px",
          background:"#111827",
          padding:"20px",
          borderRadius:"12px",
          width:"420px"

        }}>

          <p>🎬 Rendering video...</p>
          <p>🧠 Writing AI script...</p>
          <p>🖼 Generating images...</p>
          <p>🎞 Building final reel...</p>

          <p style={{color:"#10b981"}}>

            Estimated time: {eta}s

          </p>

        </div>

      )}

      {/* ERROR */}

      {error && (

        <div style={{
          marginTop:"20px",
          color:"#ef4444"
        }}>
          {error}
        </div>

      )}

      {/* VIDEO PLAYER */}

      {videoUrl && (

        <div style={{

          marginTop:"40px"

        }}>

          <video

            src={videoUrl}

            controls

            width="380"

            style={{
              borderRadius:"12px",
              boxShadow:"0 10px 40px rgba(0,0,0,0.6)"
            }}

          />

          {/* NEXT BUTTON */}

          <div style={{marginTop:"16px"}}>

            <button

              onClick={loadNext}

              style={{

                padding:"12px 24px",
                borderRadius:"10px",
                border:"none",
                background:"#10b981",
                color:"white",
                cursor:"pointer"

              }}

            >

              Next Video

            </button>

          </div>

        </div>

      )}

      {/* FOOTER */}

      <div style={{

        marginTop:"60px",
        opacity:0.6,
        fontSize:"14px"

      }}>

        Powered by Nexus AI

      </div>

    </div>

  );

}