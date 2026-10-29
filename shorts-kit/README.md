# shorts-kit

Tools for the Flat-Vector Science 9:16 money shorts. Paste `SYSTEM_PROMPT.md` into a new session to start the next video.
The approved reference video lives in `../shorts/replaceable/`.

```
python3 shorts-kit/tools/transcribe.py shorts/<slug>   # voice.mp3 -> words.json
node shorts-kit/tools/build.js shorts/<slug>           # -> storyboard.html, short.html
node shorts-kit/tools/render.js shorts/<slug>          # -> <slug>.mp4 (add --audio to re-mix only)
```
