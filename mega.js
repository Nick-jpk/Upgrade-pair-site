const mega = require("megajs");

const auth = {
  email: "opakstg@gmail.com",
  password: "sweetsixteen",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246",
};

async function upload(data, name) {
  return new Promise((resolve, reject) => {
    const storage = new mega.Storage(auth);

    let cleanedUp = false;
    function cleanup() {
      if (!cleanedUp) {
        cleanedUp = true;
        storage.close();
      }
    }

    storage.on("ready", () => {
      console.log("Mega storage ready. Uploading file:", name);

      const uploadStream = storage.upload({ name, allowUploadBuffering: true });

      uploadStream.on("complete", (file) => {
        file.link((err, url) => {
          cleanup();
          if (err) return reject(err);
          resolve(url);
        });
      });

      uploadStream.on("error", (err) => {
        cleanup();
        reject(err);
      });

      data.pipe(uploadStream);
    });

    storage.on("error", (err) => {
      cleanup();
      reject(err);
    });
  });
}

module.exports = { upload };
