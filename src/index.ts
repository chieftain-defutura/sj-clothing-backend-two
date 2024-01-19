import cors from "cors";
import express from "express";
import dotenv from "dotenv";

import Jimp from "jimp";
import bodyParser from "body-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get("/", (req, res) => {
  res.send("<h2>Hello everyone </h2>");
});

app.use(express.json({}));

// app.post("/canvas", async (req, res) => {
//   const image = req.body.image;
//   const color = req.body.color;
//   try {
//     const canvas = createCanvas(1600, 1600);
//     const context = canvas.getContext("2d");
//     context.fillStyle = color;
//     context.fillRect(0, 0, canvas.width, canvas.height);

//     // Load an image and draw it on the canvas
//     loadImage(image).then((image) => {
//       const rotationAngle = Math.PI / 1;

//       // Translate to the center of the image
//       context.translate(90 + 250, 90 + 250);

//       // Rotate the canvas
//       context.rotate(rotationAngle);
//       context.drawImage(image, -320, -300, 400, 400);
//       const base64Image = canvas
//         .toDataURL("image/png")
//         .replace(/^data:image\/png;base64,/, "");
//       res.json({ base64Image });
//     });
//   } catch (error) {
//     console.log(error);
//   }

// });

app.post("/canvas", async (req, res) => {
  const image = req.body.image;
  const color = req.body.color;
  try {
    const targetImage = new Jimp(1600, 1600, color);
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const sourceImage = await Jimp.read(buffer);
    sourceImage.rotate(180);

    // Define the rectangle in the target image where the source image will be copied
    const startX = 200;
    const startY = 200;
    const endX = 700;
    const endY = 700;

    sourceImage.contain(
      endX - startX,
      endY - startY,
      Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE
    );

    // Paste the contained source image onto the target image at the specified position
    targetImage.composite(sourceImage, startX, startY);

    const base64Image = await targetImage.getBase64Async(Jimp.MIME_PNG);
    // Save the image to a file
    await targetImage.writeAsync("output.png");

    res.json({ base64Image });
  } catch (error) {
    console.error("Error creating image:", error);
    res.send(error);
  }
});
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
