import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const date = new Date();
    let fileName = `${date}-${file.originalname}`.replaceAll(" ", "");
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

export { upload };
