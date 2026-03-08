import { useState } from "react";

export default function ImageGenerator(){

  const [prompt,setPrompt] = useState("");
  const [image,setImage] = useState("");
  const [loading,setLoading] = useState(false);

  const generateImage = async () => {

    if(!prompt) return;

    setLoading(true);

    const res = await fetch("http://localhost:5000/generate-image",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({prompt})

    });

    const data = await res.json();

    if(data.error){

      alert(data.error);

      setLoading(false);
      return;

    }

    setImage(data.image);

    setLoading(false);

  };

  return(

    <div style={{padding:"40px"}}>

      <h2>AI Image Generator</h2>

      <input
  type="text"
  value={prompt}
  onChange={(e) => setPrompt(e.target.value)}
  placeholder="Describe the image..."
  style={{
    width: "100%",
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "#0f172a",
    color: "white",
    fontSize: "16px",
    outline: "none"
  }}
/>

      <button
      onClick={generateImage}
      style={{marginLeft:"10px"}}
      >
      Generate
      </button>

      {loading && <p>Generating...</p>}

      {image && (

        <div style={{marginTop:"20px"}}>

          <img
          src={image}
          width="350"
          />

          <div>

            <a href={image} download>
            Download Image
            </a>

          </div>

        </div>

      )}

    </div>

  );

}