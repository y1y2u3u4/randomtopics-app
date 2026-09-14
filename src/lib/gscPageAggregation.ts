/** Page-grouped GSC rows, rolled up to the reporting pagePath dimension.
 * These are sums of URL-level impressions, not unique site-level impressions.
 */
export type GscPageMetrics = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export function aggregateGscPageRows(
  rows: Array<GscPageMetrics & { key: string }>
): Map<string, GscPageMetrics> {
  const totals = new Map<string, {
    clicks: number;
    impressions: number;
    weightedPosition: number;
  }>();
  for (const row of rows) {
    let path: string;
    try {
      const url = new URL(row.key);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      path = url.pathname;
    } catch {
      continue;
    }
    const previous = totals.get(path);
    totals.set(path, {
      clicks: (previous?.clicks ?? 0) + row.clicks,
      impressions: (previous?.impressions ?? 0) + row.impressions,
      weightedPosition: (previous?.weightedPosition ?? 0) + row.position * row.impressions,
    });
  }
  return new Map([...totals].map(([path, total]) => [path, {
    clicks: total.clicks,
    impressions: total.impressions,
    ctr: total.impressions > 0 ? total.clicks / total.impressions : 0,
    position: total.impressions > 0 ? total.weightedPosition / total.impressions : 0,
  }]));
}
