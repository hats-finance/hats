import { Root } from "application";
import { DBConfig } from "config/DBConfig";
import { createRoot } from "react-dom/client";
import { initDB } from "react-indexed-db-hook";

initDB(DBConfig);

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
