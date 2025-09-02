import { builder } from "@builder.io/sdk";

export const DEFAULT_MODEL = "page" as const;

const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY || "";
if (apiKey) {
  try {
    builder.init(apiKey);
  } catch (err) {
    // Avoid crashing if init is called multiple times or key is invalid in dev
    console.warn("Builder SDK init warning:", err);
  }
}

export { builder };
