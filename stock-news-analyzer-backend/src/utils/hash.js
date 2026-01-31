import crypto from "crypto";

const generateHash = (text) => {
  return crypto.createHash("sha256").update(text).digest("hex");
};

export default generateHash;
