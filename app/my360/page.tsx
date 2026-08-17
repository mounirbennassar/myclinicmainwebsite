import My360Client from "./My360Client";

// Static — the page has no DB reads. The lead form posts to /api/appointments
// at runtime, which is dynamic on its own.
export default function My360Page() {
  return <My360Client />;
}
