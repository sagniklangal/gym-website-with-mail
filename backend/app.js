import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";

const app = express();
const router = express.Router();

config({path: "./config.env"});

// //To check if connected or not
// console.log(process.env.PORT)

app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ["post"],
  credentials: true
})
);

//Parse data into json format
app.use(express.json());

//To know the data type
app.use(express.urlencoded({ extended: true}));

router.get("/", (req, res, next)=>{
  res.json({success: true, message:"Hello World"});
});

router.post("/send/mail", async(req,res,next)=>{
  const { name, email, message } = req.body;
  if(!name || !email || !message){
    return next(res.status(400).json({
      success: false,
      message: "Please provide all the details",
    })
  );
  }
  try {
    await sendEmail({
      email: "sagniklangal360@gmail.com",
      subject: "Gym Website Contact",
      message,
      userEmail: email,
    });
    res.status(200).json({
      success: true,
      message: "Message Sent Successfully."
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.use(router);

app.listen(process.env.PORT, ()=>{
  console.log(`Server listening at port ${process.env.PORT}`);
});