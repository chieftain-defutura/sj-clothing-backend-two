"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const jimp_1 = __importDefault(require("jimp"));
const body_parser_1 = __importDefault(require("body-parser"));
const playwright_1 = require("playwright");
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({ limit: "10mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "10mb", extended: true }));
app.get("/", (req, res) => {
    res.send("<h2>Hello everyone </h2>");
});
app.use(express_1.default.json({}));
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
app.post("/canvas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.body.image;
    const color = req.body.color;
    try {
        const targetImage = new jimp_1.default(1600, 1600, color);
        const buffer = Buffer.from(image.split(",")[1], "base64");
        const sourceImage = yield jimp_1.default.read(buffer);
        sourceImage.rotate(180);
        // Define the rectangle in the target image where the source image will be copied
        const startX = 250;
        const startY = 200;
        const endX = 650;
        const endY = 700;
        sourceImage.contain(endX - startX, endY - startY, jimp_1.default.HORIZONTAL_ALIGN_CENTER | jimp_1.default.VERTICAL_ALIGN_MIDDLE);
        // Paste the contained source image onto the target image at the specified position
        targetImage.composite(sourceImage, startX, startY);
        const base64Image = yield targetImage.getBase64Async(jimp_1.default.MIME_PNG);
        // Save the image to a file
        // await targetImage.writeAsync("output.png");
        res.json({ base64Image });
    }
    catch (error) {
        console.error("Error creating image:", error);
        res.send(error);
    }
}));
// app.post("/captureWebsite", async (req, res) => {
//   const uid = req.body.uid;
//   try {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto(
//       `https://sj-threejs-development.netlify.app/webview/?uid=${uid}`
//     );
//     await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
//     await new Promise((resolve) => setTimeout(resolve, 10000));
//     // await page.screenshot({ path: "./screenshot.png" });
//     const screenshotBase64 = await page.screenshot({ encoding: "base64" });
//     await browser.close();
//     res.send({ screenshotBase64 });
//   } catch (error) {
//     console.log(error);
//   }
// });
app.post("/captureWebsite", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.body.uid;
    try {
        const url = `https://sj-threejs-development.netlify.app/webview/?uid=${uid}`;
        const screenshotOptions = {
            path: "screenshot.png",
            fullPage: true, // Capture the full page
        };
        const browser = yield playwright_1.chromium.launch();
        const context = yield browser.newContext();
        const page = yield context.newPage();
        // Navigate to the specified URL
        yield page.goto(url);
        // Capture the screenshot
        yield new Promise((resolve) => setTimeout(resolve, 10000));
        yield page.screenshot(screenshotOptions);
        const imageBuffer = fs_1.default.readFileSync(screenshotOptions.path);
        const screenshotBase64 = imageBuffer.toString("base64");
        console.log("Screenshot captured successfully");
        // Close the browser
        yield browser.close();
        res.send({ screenshotBase64 });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
}));
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});
