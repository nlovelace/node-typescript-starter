import dotenv from "dotenv";
import path from "path";
dotenv.config();
import { createLogger, writeLog } from "fast-node-logger";
import type { NodeMode } from "./typings/node/mode";
import { getCredential } from "./helpers/util";

/** server mode base on process.env.NODE_ENV */
let nodeMode: NodeMode = process.env.NODE_ENV || "production";

if (process.env.NODE_ENV) {
  nodeMode = process.env.NODE_ENV;
}

export async function main() {
  /** ready to use instance of logger */
  const logger = await createLogger({
    level: nodeMode === "development" ? "trace" : "warn",
    prettyPrint: { colorize: true, translateTime: " yyyy-mm-dd HH:MM:ss" },
    logDir: path.join(process.cwd(), "logs"),
    retentionTime: nodeMode === "development" ? 360000 : undefined,
  });
  logger.trace(`script started in ${nodeMode} mode!`);

  /** put your code below here */
  const { account, password } = await getCredential("test_cred");
  console.log(`loaded credential: `, account, password);

  return process.env.MY_SECRET; // this line is just for passing test, you can remove it in your app
}

main().catch((err: Error) => {
  writeLog(err, { level: "error", stdout: true });
});
