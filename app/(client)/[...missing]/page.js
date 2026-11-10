import { notFound } from "next/navigation";

// Any URL that matches no route lands here, so the branded
// app/(client)/not-found.jsx renders inside the client layout
// (header + footer) instead of Next's bare default 404.
export default function CatchAllNotFound() {
  notFound();
}
