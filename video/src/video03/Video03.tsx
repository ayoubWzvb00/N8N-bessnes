import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Airfield, ArmorMove, DangerSign, Diagram, Feed, Ghosts, Hook, LastPlane, LookDown, Mentor, Missing, Spotlight, Survived, Thousands, VIDEO03_END, Wald } from "./scenes";

export const VIDEO03_DURATION = VIDEO03_END;

export const Video03: React.FC<{ audio?: string }> = ({ audio = "mix-03.wav" }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Hook />
    <Airfield />
    <Diagram />
    <Wald />
    <Survived />
    <Missing />
    <ArmorMove />
    <Feed />
    <Thousands />
    <Spotlight />
    <DangerSign />
    <Mentor />
    <LookDown />
    <LastPlane />
    <Ghosts />
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
