import React from "react";
import { AbsoluteFill, Audio, Img } from "remotion";

export const StudyReel = () => {

  const scenes = [
    "/temp/scene_0.png",
    "/temp/scene_1.png",
    "/temp/scene_2.png",
    "/temp/scene_3.png"
  ];

  return (
    <AbsoluteFill style={{backgroundColor:"black"}}>

      {scenes.map((img, i) => (
        <Img
          key={i}
          src={img}
          style={{
            width:"100%",
            height:"100%",
            objectFit:"cover",
            position:"absolute"
          }}
        />
      ))}

      <Audio src="/temp/voice.mp3" />

    </AbsoluteFill>
  );
};