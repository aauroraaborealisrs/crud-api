import cluster from "cluster";

let globalData: { [key: string]: any } = {};

interface SyncMessage {
  type: "syncData";
  data: { [key: string]: any };
}

export const clusterRouter = () => {
  process.on("message", (msg: SyncMessage) => {
    if (msg.type === "syncData") {
      console.log(`Worker ${process.pid} received sync update`);
      globalData = { ...globalData, ...msg.data };
    }
  });
};

export const sendDataToWorkers = (data: { [key: string]: any }) => {
  for (const id in cluster.workers) {
    if (
      cluster.workers[id] &&
      cluster.workers[id].process.pid !== process.pid
    ) {
      cluster.workers[id]?.send({ type: "syncData", data });
    }
  }
};
