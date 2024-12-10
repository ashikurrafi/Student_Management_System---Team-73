import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import studentsModel from "../model/StudentModel.js";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=<>?]).{8,20}$/;

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(req.body);
    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ success: `False`, error: `All fields are required` });
    }

    if (fullName.length < 3) {
      return res.status(400).json({
        success: `False`,
        message: `Name must be at least 3 characters`,
      });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: `False`,
        message: `Email is invalid`,
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: `False`,
        message: `Password must be 8-20 characters long, include uppercase, lowercase, numbers, and special characters`,
      });
    }

    const existingStudent = await studentsModel.findOne({ email });

    if (existingStudent) {
      return res
        .status(400)
        .json({ success: `False`, message: `Email already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 2);

    const newStudent = new studentsModel({
      fullName,
      email,
      password: hashedPassword,
    });

    await newStudent.save();

    const token = await jwt.sign(
      { id: newStudent.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.status(200).json({ success: `True`, newStudent: newStudent });
  } catch (error) {
    res.status(400).json({ success: `False`, error: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: `False`, error: `All fields are required` });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: `False`,
        message: `Email is invalid`,
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: `False`,
        message: `Password must be 8-20 characters long, include uppercase, lowercase, numbers, and special characters`,
      });
    }

    const existingStudent = await studentsModel.findOne({ email });
    console.log(email);

    if (!existingStudent) {
      return res
        .status(400)
        .json({ success: `True`, message: `Invalid emaiil` });
    }

    const isMatch = bcrypt.compare(password, existingStudent.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: `True`, message: `Invalid password` });
    }

    // const token = await jwt.sign(
    //   { id: newStudent.email },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d",
    //   }
    // );

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    // });

    return res.status(200).json({ success: `True` });
  } catch (error) {
    res.status(400).json({ success: `False`, error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ success: `False`, error: error.message });
  }
};
