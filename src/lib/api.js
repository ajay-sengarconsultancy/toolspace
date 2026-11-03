const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, { query, ...options } = {}) {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  });

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
      ...(options.body && typeof options.body !== "string" ? { body: JSON.stringify(options.body) } : {}),
      cache: options.cache ?? "no-store",
    });
  } catch {
    throw new ApiError("Could not connect to Toolspace. Check that the API is running and try again.");
  }

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError("The API returned an unreadable response.", response.status);
  }

  if (!response.ok || payload?.success === false) {
    throw new ApiError(payload?.error?.message || "Something went wrong. Please try again.", response.status);
  }

  return payload;
}

export function formatRequestStatus(status) {
  return String(status ?? "")
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatEta(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric", timeZone: "UTC" }).format(date);
}

export function categoryLabel(category) {
  return category?.name || "Uncategorized";
}
