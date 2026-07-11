import { Pool } from "pg";

declare global {
  var modernRelicDbPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return new Pool({ connectionString });
}

export function getDbPool() {
  if (!global.modernRelicDbPool) {
    global.modernRelicDbPool = createPool();
  }
  return global.modernRelicDbPool;
}
