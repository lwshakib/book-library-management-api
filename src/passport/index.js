import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserRoleEnum } from "../constants.js";
import { AuthenticatedUserModel } from "../models/auth/authenticated-user.model.js";
import { UserModel } from "../models/auth/user.model.js";
import { ApiError } from "../utils/ApiError.js";

passport.serializeUser((user, next) => {
  next(null, user._id);
});

passport.deserializeUser(async (id, next) => {
  try {
    const user = await AuthenticatedUserModel.findById(id);
    if (user) next(null, user);
    else next(new ApiError(404, "User does not exist"), null);
  } catch (error) {
    next(
      new ApiError(
        500,
        "Something went wrong while deserializing the user. Error: " + error
      ),
      null
    );
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, next) => {
      const user = await AuthenticatedUserModel.findOne({
        email: profile._json.email,
        type: "GOOGLE",
      });
      if (user) {
        next(null, user);
      } else {
        const createdUser = await AuthenticatedUserModel.create({
          email: profile._json.email,
          password: profile._json.sub,
          name: profile._json.name,
          verified: true,
          role: UserRoleEnum.USER,
          avatar: profile._json.picture,
          type: "GOOGLE",
        });
        if (createdUser) {
          const newUser = await UserModel.create({
            authUserId: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            avatar: profile._json.picture,
          });
          if (!newUser) {
            return next(new Error("Error while creating user profile"));
          }
          await newUser.save({ validateBeforeSave: false });
          next(null, createdUser);
        } else {
          next(new ApiError(500, "Error while registering the user"), null);
        }
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, next) => {
      if (!profile._json.email) {
        return next(
          new ApiError(
            400,
            "User does not have a public email associated with their account. Please try another login method"
          ),
          null
        );
      }

      const user = await AuthenticatedUserModel.findOne({
        email: profile._json.email,
        type: "GITHUB",
      });

      if (user) {
        next(null, user);
      } else {
        const createdUser = await AuthenticatedUserModel.create({
          email: profile._json.email,
          password: profile._json.node_id,
          name: profile._json.name || profile._json.login,
          verified: true,
          role: UserRoleEnum.USER,
          avatar: profile._json.avatar_url,
          type: "GITHUB",
        });
        if (createdUser) {
          const newUser = await UserModel.create({
            authUserId: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            avatar: `https://placehold.co/600x400?text=${createdUser.name
              .charAt(0)
              .toUpperCase()}`,
          });
          if (!newUser) {
            return next(new Error("Error while creating user profile"));
          }
          await newUser.save({ validateBeforeSave: false });
          next(null, createdUser);
        } else {
          next(new ApiError(500, "Error while registering the user"), null);
        }
      }
    }
  )
);

export default passport;
