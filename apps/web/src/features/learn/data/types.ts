export type DataMode = "demo" | "live";

export const IS_LIVE = !!import.meta.env.VITE_API_URL;
