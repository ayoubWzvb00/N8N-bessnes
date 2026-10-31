import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { BlurHands, Difference, FastShoe, Home, Keyhole, LooksEasy, Podium, Register, TagSwap, Trap, VIDEO02_END } from "./scenesInsight";
import { Complain, Economist, HappyTip, Hook, NoTip, SameResult, Struggle, YearOne, YearsLater } from "./scenesStory";

export const VIDEO02_DURATION = VIDEO02_END;

export const Video02: React.FC<{ audio?: string }> = ({ audio = "mix-02.wav" }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Hook />
    <Economist />
    <YearOne />
    <Struggle />
    <HappyTip />
    <YearsLater />
    <SameResult />
    <Complain />
    <NoTip />
    <Keyhole />
    <Register />
    <BlurHands />
    <Trap />
    <LooksEasy />
    <Podium />
    <FastShoe />
    <TagSwap />
    <Home />
    <Difference />
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
