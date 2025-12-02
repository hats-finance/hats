import { setSafeApiKey } from "@hats.finance/shared";
import { Root } from "application";
import { DBConfig } from "config/DBConfig";
import { createRoot } from "react-dom/client";
import { initDB } from "react-indexed-db-hook";
import { SAFE_API_KEY } from "settings";

// Initialize Safe API Key for authenticated API calls
if (SAFE_API_KEY) {
  setSafeApiKey(SAFE_API_KEY);
}

initDB(DBConfig);

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
