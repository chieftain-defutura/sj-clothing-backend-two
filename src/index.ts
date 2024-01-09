import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import { createCanvas, loadImage } from "canvas";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("<h2>Hello world </h2>");
});

app.use(express.json({}));

app.post("/canvas", async (req, res) => {
  const image = req.body.image;
  const color = req.body.color;
  try {
    const canvas = createCanvas(1600, 1600);
    const context = canvas.getContext("2d");
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Load an image and draw it on the canvas
    loadImage(image).then((image) => {
      const rotationAngle = Math.PI / 1;

      // Translate to the center of the image
      context.translate(90 + 250, 90 + 250);

      // Rotate the canvas
      context.rotate(rotationAngle);

      // Draw the image
      context.drawImage(image, -320, -300, 400, 400);

      // Reset transformations (important to avoid issues with subsequent drawings)
      // context.setTransform(0);

      // const out = fs.createWriteStream("output.png");
      // const stream = canvas.createPNGStream();
      // stream.pipe(out);
      // res.send("success");
      const base64Image = canvas
        .toDataURL("image/png")
        .replace(/^data:image\/png;base64,/, "");
      res.json({ base64Image });
    });
  } catch (error) {
    console.log(error);
  }
});
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
