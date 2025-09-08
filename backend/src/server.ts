import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import open from "open"; // <- Install this package

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

function startServer(port: number) {
  const server = app.listen(port, "0.0.0.0", () => {
    const url = `http://localhost:${port}`;
    console.log(`✅ Server running on: ${url}`);
    
    // Auto-open in browser (only in dev mode)
    if (process.env.NODE_ENV !== "production") {
      open(url);
    }
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`⚠️ Port ${port} in use. Trying ${port + 1}...`);
      startServer(port + 1); // Try next port
    } else {
      console.error(err);
    }
  });
}

startServer(DEFAULT_PORT);
