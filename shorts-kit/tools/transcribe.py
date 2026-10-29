"""Word-level timestamps for a short's voiceover.

usage: python3 shorts-kit/tools/transcribe.py shorts/<slug>
reads  shorts/<slug>/voice.mp3, writes shorts/<slug>/words.json  ([word, start, end] per word)

Hugging Face is blocked from the cloud sessions, so the Whisper "small" model (CTranslate2 int8) is fetched
from npm (@skillninja/shortmovie-telop-model-p0..p3), joined and checked against its published sha256.
"""
import hashlib, json, os, subprocess, sys, tarfile, tempfile

import numpy as np

CACHE = os.path.expanduser('~/.cache/shorts-whisper-small')
SHA = 'ca732cb1379efc49417d028465f543d83a39de2c61f3027678de103dc404ce73'


def model_dir():
    mb = os.path.join(CACHE, 'model.bin')
    if os.path.exists(mb):
        return CACHE
    os.makedirs(CACHE, exist_ok=True)
    tmp = tempfile.mkdtemp()
    parts = []
    for i in range(4):
        subprocess.run(['npm', 'pack', '-s', f'@skillninja/shortmovie-telop-model-p{i}', '--pack-destination', tmp], check=True, stdout=subprocess.DEVNULL)
        with tarfile.open(os.path.join(tmp, f'skillninja-shortmovie-telop-model-p{i}-1.0.0.tgz')) as tf:
            tf.extractall(os.path.join(tmp, f'p{i}'), filter='data')
        parts.append(os.path.join(tmp, f'p{i}', 'package', f'model.bin.part{i}'))
    for f in ['tokenizer.json', 'vocabulary.json', 'config.json', 'preprocessor_config.json']:
        os.replace(os.path.join(tmp, 'p0', 'package', f), os.path.join(CACHE, f))
    h = hashlib.sha256()
    with open(mb + '.tmp', 'wb') as out:
        for p in parts:
            with open(p, 'rb') as f:
                while chunk := f.read(1 << 20):
                    out.write(chunk); h.update(chunk)
    if h.hexdigest() != SHA:
        os.remove(mb + '.tmp')
        sys.exit('model checksum mismatch, refusing to use it')
    os.replace(mb + '.tmp', mb)
    return CACHE


def main():
    proj = sys.argv[1] if len(sys.argv) > 1 else '.'
    os.environ['HF_HUB_OFFLINE'] = '1'
    from faster_whisper import WhisperModel  # pip install faster-whisper
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(proj, 'voice.mp3'), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, np.float32)  # decoded with ffmpeg: faster-whisper's own decoder breaks on newer PyAV
    m = WhisperModel(model_dir(), device='cpu', compute_type='int8')
    segs, _ = m.transcribe(audio, language='en', word_timestamps=True, beam_size=5)
    words = [[w.word.strip(), round(w.start, 2), round(w.end, 2)] for s in segs for w in s.words]
    json.dump(words, open(os.path.join(proj, 'words.json'), 'w'))
    print(len(words), 'words, voice ends at', words[-1][2], 's')
    print(' '.join(f'{w}@{a}' for w, a, _ in words))


if __name__ == '__main__':
    main()
