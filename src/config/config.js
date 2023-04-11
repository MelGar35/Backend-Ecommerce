import dotenv from "dotenv"

dotenv.config()

export default {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  PERSISTENCE: process.env.PERSISTENCE,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  NODEMAILER_ACCOUNT: process.env.NODEMAILER_ACCOUNT,
  NODEMAILER_PASS: process.env.NODEMAILER_PASS,
}



