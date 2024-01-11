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
const canvas_1 = require("canvas");
const body_parser_1 = __importDefault(require("body-parser"));
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
app.post("/canvas", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const image = req.body.image;
    const color = req.body.color;
    try {
        const canvas = (0, canvas_1.createCanvas)(1600, 1600);
        const context = canvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // Load an image and draw it on the canvas
        (0, canvas_1.loadImage)(image).then((image) => {
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
    }
    catch (error) {
        console.log(error);
    }
}));
app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
});
