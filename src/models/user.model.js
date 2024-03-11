import mongoose, { Schema } from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    avtar: {
      type: String, // cloudinary url
      required: true,
    },
    coverimage: {
      type: String, // cloudinary url
    },
    watchhistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "vedio",
      },
    ],
    password: {
      type: String,
      required: [true, "password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methodes.generateAcessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCES_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCES_TOKEN_EXPIRY,
    },
  );
};
userSchema.methodes.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};
export const user = mongoose.model("user", userSchema);
