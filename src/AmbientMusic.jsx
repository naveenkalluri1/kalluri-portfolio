import { useEffect, useRef, useState } from "react";

const CHORDS = [
  [261.63, 329.63, 392, 523.25],
  [349.23, 440, 523.25, 659.25],
  [392, 493.88, 587.33, 783.99],
  [261.63, 392, 523.25, 659.25],
];

function scheduleChord(context, output, time, index) {
  const notes = CHORDS[index % CHORDS.length];
  // Short, harmonic plucks instead of detuned bass drones.
  [0, 1, 2, 3, 2, 1].forEach((note, beat) => {
    const start = time + beat * 0.75;
    [1, 2, 3].forEach((harmonic) => {
      const oscillator = context.createOscillator();
      const envelope = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = notes[note] * harmonic;
      envelope.gain.setValueAtTime(0, start);
      envelope.gain.linearRampToValueAtTime(0.14 / (harmonic * harmonic), start + 0.015);
      envelope.gain.exponentialRampToValueAtTime(0.0001, start + 2.2);
      envelope.gain.linearRampToValueAtTime(0, start + 2.3);
      oscillator.connect(envelope).connect(output);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
      };
      oscillator.start(start);
      oscillator.stop(start + 2.3);
    });
  });
}

export default function AmbientMusic() {
  const engine = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [volume, setVolume] = useState(20);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (engine.current) {
        clearInterval(engine.current.timer);
        engine.current.context.close().catch(console.error);
      }
    };
  }, []);

  const toggle = async () => {
    setBusy(true);
    setError("");
    try {
      if (playing) {
        await engine.current.context.suspend();
        clearInterval(engine.current.timer);
        setPlaying(false);
      } else {
        if (!window.AudioContext) {
          throw new Error("This browser does not support ambient audio.");
        }
        if (!engine.current) {
          const context = new AudioContext();
          const output = context.createGain();
          output.gain.value = volume / 100;
          output.connect(context.destination);
          engine.current = { context, output, next: context.currentTime + 0.1, index: 0, timer: null };
        }
        const audio = engine.current;
        await audio.context.resume();
        if (audio.context.state !== "running") {
          throw new Error("Audio was blocked. Please try Play music again.");
        }
        const schedule = () => {
          while (audio.next < audio.context.currentTime + 1) {
            scheduleChord(audio.context, audio.output, audio.next, audio.index++);
            audio.next += 4.5;
          }
        };
        schedule();
        audio.timer = setInterval(schedule, 500);
        setPlaying(true);
      }
    } catch (err) {
      console.error("Ambient audio failed:", err);
      setError(err.message || "Unable to play music. Please try again.");
      setPlaying(false);
      if (engine.current) {
        clearInterval(engine.current.timer);
        await engine.current.context.close().catch(console.error);
        engine.current = null;
      }
    } finally {
      setBusy(false);
    }
  };

  const changeVolume = (event) => {
    const value = Number(event.target.value);
    setVolume(value);
    if (engine.current) {
      const { context, output } = engine.current;
      output.gain.setTargetAtTime(value / 100, context.currentTime, 0.1);
    }
  };

  return (
    <div className="music-controls music-dock">
      <button className="utility-btn" onClick={toggle} disabled={busy}
        aria-label={playing ? "Pause ambient music" : "Play ambient music"} aria-pressed={playing}
        title={playing ? "Pause piano-style music" : "Play gentle piano-style music"}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          {playing ? (
            <><path d="M15 8a6 6 0 0 1 0 8" /><path d="M18 5a10 10 0 0 1 0 14" /></>
          ) : (
            <><path d="m16 9 5 6" /><path d="m21 9-5 6" /></>
          )}
        </svg>
      </button>
      {playing && (
        <input className="music-volume" type="range" min="0" max="35" value={volume}
          onChange={changeVolume} aria-label="Music volume" aria-valuetext={`${volume}%`} />
      )}
      {error && <span className="audio-error" role="alert">{error}</span>}
    </div>
  );
}
