import User from '../models/user.model.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// options of login/logout security and http
 const options = {
    httpOnly : true,
    secure : true
 }


//  generate Access token And RefreshToken
 const generateAccessAndRefreshToken = async(userId) => {
      const user = await  User.findById(userId)

      const accessToken = await user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()

      user.refreshToken = refreshToken


      user.save({validateBeforeSave : false})

      return {
        accessToken,
        refreshToken
      }
}


//  Signup User (Superuser Only)
const registerUser = asyncHandler(async(req,res)=>{

    const { name, email, password, phone, superSecretKey } = req.body;

    // Validate required fields
    if([name, email, password, phone, superSecretKey].some((item) => !item || item.trim() === "")) {
      throw new ApiError(400, "All fields are required")
    }

    // Verify Super Secret Key
    if (superSecretKey !== process.env.SUPER_SECRET_KEY) {
      throw new ApiError(403, "Invalid super secret key. You are not authorized to create a superuser account.")
    }

    const emailAlreadyExist = await User.findOne({ email })
    if(emailAlreadyExist) {
      throw new ApiError(400, "User already exists with this email")
    }

    const register = await User.create({
          name,
          email,
          password,
          phone,
          isSuperuser: true
    })

  return res.status(200).json(new ApiResponse(200, {}, "Superuser registered successfully"))
})



//  SingIn User
const userLoggedIn = asyncHandler(async(req,res)=>{

      const { email, password } = req.body

      if(!email || !password || email.trim() === "" || password.trim() === "") {
        throw new ApiError(400, "Email and password are required")
      }

     const user = await User.findOne({ email });


      if(!user) {
         throw new ApiError(400, "user not found")
      }

      const isPasswordValid = await user.isPasswordCorrect(password)


      if(!isPasswordValid) {
        throw new ApiError(400, "Credentials failed")
      }


      const {
         accessToken,
         refreshToken
        } = await generateAccessAndRefreshToken(user._id)


        const loginUser = await User.findById(user._id).select("-password  -refreshToken");

      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { ...loginUser._doc, accessToken, refreshToken }, "user logged successfully"))
})


//  Singout User
const userLoggedOut = asyncHandler(async(req,res)=>{

       await User.findByIdAndUpdate(req.user._id,{
          $set : {
            refreshTokne : ""
          },
      },{ new : true })


  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "user logged out successfully"))
})


//  Fetch User
const userFetch = asyncHandler(async(req,res)=>{
      return res.status(200).json(new ApiResponse(200, req.user, "user fetch successfully"))
})


export {
  registerUser, userFetch, userLoggedIn, userLoggedOut
}
