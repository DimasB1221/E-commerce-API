import Users from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // cek user
    const userExist = await Users.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exist" });
    }

    // hash paswword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // simpan user baru
    const user = await Users.create({
      name,
      password: hashedPassword,
      email,
      role: role || "user",
    });

    // kirim respon ke json
    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Errror :", error: error.message });
  }
};

// login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // cek user
    const user = await Users.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }

    // cek password
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // kalau cocok generate token
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
