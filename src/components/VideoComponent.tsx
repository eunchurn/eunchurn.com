import { Suspense } from "react";
import { list } from "@vercel/blob";
// import Player from "next-video/player";

export function Video({ fileName }) {
  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <VideoComponent fileName={fileName} />
    </Suspense>
  );
}

export default async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  });
  const { url } = blobs[0];
  console.log(blobs);
  return (
    <video controls preload="none" aria-label="Video player" width="100%">
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
