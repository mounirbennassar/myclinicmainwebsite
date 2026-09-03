import { gzipSync } from "node:zlib";

/**
 * JSON responses for the lead API, gzipped when it pays off.
 *
 * Neither nginx nor the Next server compresses the JSON that the route
 * handlers return (only the HTML pages come back gzipped), so an export of the
 * whole lead table used to cross the wire as several megabytes of plain text.
 * Bodies above GZIP_MIN_BYTES are compressed here, in the handler, whenever
 * the caller advertises gzip; anything smaller is not worth the CPU or the
 * extra header. Next's own `compress` middleware skips responses that already
 * carry a content-encoding, so this never double-compresses.
 *
 * Every response is `private, no-store`: the payload is patient data scoped to
 * the session cookie and must never land in a shared cache.
 */
const GZIP_MIN_BYTES = 16 * 1024;

export function jsonResponse(request: Request, body: unknown, status = 200): Response {
  const text = JSON.stringify(body);
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "cache-control": "private, no-store",
  });
  const acceptsGzip = /\bgzip\b/i.test(request.headers.get("accept-encoding") ?? "");
  if (acceptsGzip && Buffer.byteLength(text) > GZIP_MIN_BYTES) {
    headers.set("content-encoding", "gzip");
    headers.set("vary", "accept-encoding");
    return new Response(new Uint8Array(gzipSync(text)), { status, headers });
  }
  return new Response(text, { status, headers });
}
