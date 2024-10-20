import cluster from "cluster";
import os from "os";
import http, { IncomingMessage, ServerResponse } from "http";
import { router } from "./router";
import { clusterRouter } from "./clusterRouter";

const PORT = Number(process.env.PORT) || 4000;
const numCPUs = os.availableParallelism
  ? os.availableParallelism()
  : os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  const loadBalancer = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const workerIndex = Math.floor(Math.random() * (numCPUs - 1)) + 1;

      const options = {
        hostname: "localhost",
        port: PORT + workerIndex,
        path: req.url,
        method: req.method,
        headers: req.headers,
      };

      const proxy = http.request(options, (workerRes) => {
        res.writeHead(workerRes.statusCode!, workerRes.headers);
        workerRes.pipe(res, { end: true });
      });

      req.pipe(proxy, { end: true });
    },
  );

  loadBalancer.listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });

  for (let i = 1; i < numCPUs; i++) {
    cluster.fork({ WORKER_PORT: PORT + i });
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  clusterRouter();

  const workerPort = process.env.WORKER_PORT;

  http
    .createServer((req: IncomingMessage, res: ServerResponse) => {
      router(req, res);
    })
    .listen(workerPort, () => {
      console.log(
        `Worker ${process.pid} started, listening on port ${workerPort}`,
      );
    });
}
