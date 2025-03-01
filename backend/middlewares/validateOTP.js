let storedOTPs = {};  
const validateOTP = async (req, res, next) => {
  const { otp, email } = req.body;
  
  if (!storedOTPs[email]) {
    return res.status(400).json({ message: "OTP not found" });
  }

  const otpData = storedOTPs[email];
  const currentTime = Date.now();
  
  if (currentTime > otpData.expiry) {
    delete storedOTPs[email];  
    return res.status(400).json({ message: "OTP expired" });
  }

  if (otp === otpData.otp) {
    delete storedOTPs[email];  
    next();  
    return res.status(400).json({ message: "Invalid OTP" });
  }
};

module.exports = { validateOTP };
