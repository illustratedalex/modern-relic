type Store = { id: number; name: string };
type ApiResponse = {
  code?: number;
  data?: Store[];
  result?: unknown[];
  paging?: { total?: number };
};

export type PrintfulProduct = { id: number; name: string; image: string | null };
export type PrintfulCatalog = { ready: boolean; products: PrintfulProduct[] };

// Only public product fields leave the server. Checkout is a separate integration.
export async function getPrintfulCatalog(): Promise<PrintfulCatalog> {
  const connection = await checkPrintfulConnection();
  if (!connection.connected) return { ready: false, products: [] };
  if (connection.productCount === 0) return { ready: true, products: [] };
  try {
    const response = await fetch("https://api.printful.com/store/products?limit=100", {
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_ACCESS_TOKEN!.trim()}`,
        "X-PF-Store-Id": String(connection.store.id),
      },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return { ready: false, products: [] };
    const body = await response.json();
    if (!Array.isArray(body.result)) return { ready: false, products: [] };
    const products: PrintfulProduct[] = [];
    for (const product of body.result) {
      if (!Number.isSafeInteger(product.id) || typeof product.name !== "string") continue;
      let image: string | null = null;
      try {
        const url = new URL(product.thumbnail_url);
        if (url.protocol === "https:") image = url.href;
      } catch { /* Missing preview image is fine. */ }
      products.push({ id: product.id, name: product.name, image });
    }
    return { ready: true, products };
  } catch {
    return { ready: false, products: [] };
  }
}

export type PrintfulConnection =
  | { connected: true; store: Store; productCount: number }
  | { connected: false; reason: string; apiStatus?: number };

// Server-side, read-only connection check. Never return upstream bodies or credentials.
export async function checkPrintfulConnection(
  token = process.env.PRINTFUL_ACCESS_TOKEN,
  fetcher: typeof fetch = fetch,
): Promise<PrintfulConnection> {
  if (!token?.trim()) return { connected: false, reason: "missing_access_token" };
  const headers = { Authorization: `Bearer ${token.trim()}` };
  try {
    const response = await fetcher("https://api.printful.com/v2/stores", {
      headers, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return { connected: false, reason: "store_access_failed", apiStatus: response.status };
    const body = (await response.json()) as ApiResponse;
    if (!Array.isArray(body.data)) return { connected: false, reason: "invalid_store_response" };
    const matches = body.data.filter((store) =>
      typeof store.name === "string" && store.name.trim().toLowerCase() === "modern relic"
      && Number.isSafeInteger(store.id) && store.id > 0,
    );
    if (matches.length !== 1) return { connected: false, reason: "modern_relic_store_not_unique" };
    const store = { id: matches[0].id, name: matches[0].name };
    const productsResponse = await fetcher("https://api.printful.com/store/products?limit=1", {
      headers: { ...headers, "X-PF-Store-Id": String(store.id) },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(10000),
    });
    if (!productsResponse.ok) return { connected: false, reason: "product_access_failed", apiStatus: productsResponse.status };
    const products = (await productsResponse.json()) as ApiResponse;
    if (!Array.isArray(products.result) || !Number.isSafeInteger(products.paging?.total)
      || (products.paging?.total ?? -1) < 0) {
      return { connected: false, reason: "invalid_product_response" };
    }
    return { connected: true, store, productCount: products.paging!.total! };
  } catch {
    return { connected: false, reason: "printful_request_failed" };
  }
}
