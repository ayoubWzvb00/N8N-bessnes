import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Caliper, FinePrint, Believe, Chase, Hook, Paycheck, Phone } from "./scenesA";
import { AutoRenew, EmptyWallet, Race, Snowball, Upgrade } from "./scenesB";
import { Beach, FuelGauge, Shadow, Stays, Tap, VIDEO01B_END } from "./scenesC";

export const VIDEO01B_DURATION = VIDEO01B_END;

export const Video01b: React.FC<{ audio?: string }> = ({ audio = "mix-01b.wav" }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    <Hook />
    <Believe />
    <Chase />
    <FinePrint />
    <Paycheck />
    <Caliper />
    <Phone />
    <Race />
    <Upgrade />
    <EmptyWallet />
    <AutoRenew />
    <Snowball />
    <FuelGauge />
    <Beach />
    <Shadow />
    <Tap />
    <Stays />
    <Audio src={staticFile(audio)} />
  </AbsoluteFill>
);
