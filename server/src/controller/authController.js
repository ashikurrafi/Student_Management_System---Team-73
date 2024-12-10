import bcrypt from "bcrypt";

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_+=<>?]).{8,20}$/;

export const signup = async (req, res) => {
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

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    return res
      .status(200)
      .json({ success: `True`, hashedPassword: hashedPassword });
  } catch (error) {
    res.status(400).json({ success: `False`, error: error.message });
  }
};
