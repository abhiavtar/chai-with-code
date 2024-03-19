import { asyncHandeler } from "../utils/aysnchandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { user } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandeler(async (req, res) => {
  //get user details from frontend
  // validation-not empty
  //check if user already exist or not: will check theough  email, username
  // check for images, check for avtar
  //uload on clodinary, avtar
  //create user object - create entry in db
  //remove password and refresh token field from response
  // check for user creation
  //return response

  const { userName, fullName, email, password } = req.body;
  console.log("email:", email);

  if (
    [userName, fullName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required");
  }

  const existedUser = user.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user with email or username already existed");
  }

  const avtarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avtarLocalPath) {
    throw new ApiError(400, "avtar image is required");
  }

  const avtar = await uploadOnCloudinary(avtarLocalPath);
  const CoverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avtar) {
    throw new ApiError(400, "avtar image is required");
  }

  const user = await user.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,

    userName: userName.toLowerCase(),
  });

  const createdUser = await user
    .findById(user.id)
    .select(" -password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while entering the new user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered scuessfully"));
});

export { registerUser };
