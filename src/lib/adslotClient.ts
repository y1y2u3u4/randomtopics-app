// One geo lookup per document; the server cookie covers subsequent documents.
let pending: Promise<{ src?: string; id?: string; country?: string }> | undefined;
export function adslotConfiguration() {
  return pending ??= fetch("/api/adslot/", { credentials: "same-origin" }).then(async response => {
    if (!response.ok) throw new Error("Ad slot unavailable");
    return response.json();
  }).catch(error => { pending = undefined; throw error; });
}
