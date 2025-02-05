let storedOTPs = {};  // Consider using a more secure store for OTPs in production, e.g., Redis

const validateOTP = async (req, res, next) => {
  const { otp, email } = req.body;
  
  // Check if OTP for this email exists
  if (!storedOTPs[email]) {
    return res.status(400).json({ message: "OTP not found" });
  }

  // Check for expiry, assuming you store an expiry timestamp in the OTP object
  const otpData = storedOTPs[email];
  const currentTime = Date.now();
  
  // If the OTP has expired
  if (currentTime > otpData.expiry) {
    delete storedOTPs[email];  // Clean up expired OTP
    return res.status(400).json({ message: "OTP expired" });
  }

  // Validate the OTP
  if (otp === otpData.otp) {
    delete storedOTPs[email];  // Remove the OTP once validated
    next();  // Proceed to the next middleware or route handler
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
};

module.exports = { validateOTP };
