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
    const targetImage = new Jimp(300, 200, color);
    const buffer = Buffer.from(image.split(",")[1], "base64");
    const sourceImage = await Jimp.read(buffer);

    // Define the rectangle in the target image where the source image will be copied
    const startX = 50;
    const startY = 50;
    const endX = 250;
    const endY = 150;

    // Copy pixels from the source image to the target image
    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const color = sourceImage.getPixelColor(x - startX, y - startY);
        targetImage.setPixelColor(color, x, y);
      }
    }

    // Save the image to a file
    await targetImage.writeAsync("output.png");

    console.log("Image created successfully");
    res.send("success");
  } catch (error) {
    console.error("Error creating image:", error);
    res.send(error);
  }
});
app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
