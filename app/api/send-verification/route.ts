export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

    // In production, integrate with email service like SendGrid, Nodemailer, or Resend
    // For demo purposes, we'll simulate sending and log the code
    console.log(`[v0] Verification code for ${email}: ${verificationCode}`)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return Response.json(
      {
        success: true,
        message: "Verification code sent to email",
        // For demo: return code (remove in production)
        demoCode: verificationCode,
      },
      { status: 200 },
    )
  } catch (error) {
    return Response.json({ success: false, message: "Failed to send verification code" }, { status: 500 })
  }
}
