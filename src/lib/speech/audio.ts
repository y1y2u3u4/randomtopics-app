import { MAX_SECONDS } from "./schema";
// Normalize Safari/Chrome recordings to the same bounded PCM input on-device.
export async function recordingToWav(blob: Blob): Promise<string> {
  if (blob.size > 8_000_000)
    throw new Error("Recording too large. Please record up to two minutes.");
  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await blob.arrayBuffer());
    if (decoded.duration < 5 || decoded.duration > MAX_SECONDS)
      throw new Error("Please record between 5 seconds and two minutes.");
    const frames = Math.floor(decoded.duration * 12000);
    const offline = new OfflineAudioContext(1, frames, 12000);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const samples = (await offline.startRendering()).getChannelData(0);
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const text = (offset: number, value: string) => {
      for (let i = 0; i < value.length; i++)
        view.setUint8(offset + i, value.charCodeAt(i));
    };
    text(0, "RIFF");
    view.setUint32(4, buffer.byteLength - 8, true);
    text(8, "WAVEfmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, 12000, true);
    view.setUint32(28, 24000, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    text(36, "data");
    view.setUint32(40, samples.length * 2, true);
    for (let i = 0; i < samples.length; i++) {
      const n = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(44 + i * 2, n < 0 ? n * 32768 : n * 32767, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192)
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    return btoa(binary);
  } finally {
    await context.close();
  }
}
