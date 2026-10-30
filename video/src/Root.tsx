import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { Composition } from "remotion";
import { Video01, VIDEO01_DURATION } from "./video01/Video01";
import { Video01b, VIDEO01B_DURATION } from "./video01b/Video01b";

export const FPS = 60;

export const Root: React.FC = () => (
  <>
    <Composition
      id="Video01"
      component={Video01}
      durationInFrames={Math.round(VIDEO01_DURATION * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="Video01b"
      component={Video01b}
      durationInFrames={Math.round(VIDEO01B_DURATION * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
