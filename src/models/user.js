const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [3, "First name must be at least 3 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Please enter a valid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [100, "Password cannot exceed 100 characters"],
    },

    age: {
      type: Number,
      min: [12, "Age must be at least 12"],
      max: [100, "Age must be 100 or below"],
    },

    about: {
      type: String,
      trim: true,
      maxlength: [500, "About cannot exceed 500 characters"],
      default: "I am a default user of Orbit!",
    },

    lookingFor: {
      type: String,
      trim: true,
      maxlength: [100, "Looking for cannot exceed 100 characters"],
    },

    gender: {
      type: String,
      trim: true,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message: "Gender must be male, female, or others",
      },
    },

    profilePictureUrl: {
      type: String,
      trim: true,
      validate: {
        validator: (value) =>
          validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          }),
        message: "Please enter a valid profile picture URL",
      },
      default:
        "https://images.unsplash.com/photo-1740252117013-4fb21771e7ca?q=80&w=1480&auto=format&fit=crop",
    },

    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (skills) => skills.length <= 30,
        message: "A user can have a maximum of 30 skills",
      },

      // Another way to do the above

      // validate(value) {
      //   if (value.length > 30) {
      //     throw new Error("A user can have a maximum of 30 skills");
      //   }
      // }
    },
  },
  {
    strict: true,
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
