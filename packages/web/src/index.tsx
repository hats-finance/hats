import { Root } from "application";
import LogRocket from "logrocket";
import { createRoot } from "react-dom/client";
import { LOGROCKET_APP_ID } from "settings";

if (!window.location.hostname.includes("localhost")) {
  LogRocket.init(LOGROCKET_APP_ID, {
    dom: {
      inputSanitizer: true,
    },
  });
}

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
