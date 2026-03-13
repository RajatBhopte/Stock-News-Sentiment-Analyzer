import dns from "node:dns";
import dnsPromises from "node:dns/promises";
import net from "node:net";

async function debugConnection() {
  const hostname = "cluster0.cxlxfwl.mongodb.net";
  const srvRecord = `_mongodb._tcp.${hostname}`;

  console.log(`--- Starting Diagnostics for: ${hostname} ---`);

  // 1. Check DNS Servers
  console.log(
    "1. Node.js is currently using these DNS servers:",
    dns.getServers(),
  );

  // 2. Try SRV Resolution
  try {
    console.log(`2. Attempting SRV lookup for ${srvRecord}...`);
    const addresses = await dnsPromises.resolveSrv(srvRecord);
    console.log(
      "✅ SRV Resolution Success! Found shards:",
      addresses.map((a) => a.name),
    );
  } catch (err) {
    console.error("❌ SRV Resolution Failed:", err.code);

    // 3. Emergency Fix Test: Force Public DNS
    try {
      console.log(
        "3. Attempting Emergency Fix: Forcing Google DNS inside Node...",
      );
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
      const retryAddresses = await dnsPromises.resolveSrv(srvRecord);
      console.log("✅ Success after forcing DNS!");
      console.log(
        "Found shards:",
        retryAddresses.map((a) => a.name),
      );
    } catch (retryErr) {
      console.error(
        "❌ Even with forced DNS, resolution failed:",
        retryErr.code,
      );
    }
  }

  // 4. Test Port 27017 Reachability
  // Using a common shard format; if SRV fails, we try to ping a likely shard address directly
  const testShard = `cluster0-shard-00-00.cxlxfwl.mongodb.net`;
  console.log(`\n4. Testing if Port 27017 is open on ${testShard}...`);

  const socket = new net.Socket();
  socket.setTimeout(5000);

  socket
    .on("connect", () => {
      console.log("✅ Port 27017 is OPEN and reachable!");
      socket.destroy();
    })
    .on("timeout", () => {
      console.error(
        "❌ Port 27017 Connection TIMEOUT (Likely a Firewall/ISP block)",
      );
      socket.destroy();
    })
    .on("error", (e) => {
      console.error(`❌ Port 27017 Connection REFUSED: ${e.message}`);
    })
    .connect(27017, testShard);
}

debugConnection();
