import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import supabase from '../utils/supabaseClient';
import { signToken } from '../utils/jwt';
import { generateToken } from '../utils/token';
import { sendVerificationEmail } from '../utils/mailer';
import crypto from 'crypto';
import axios from 'axios';


// 🔢 Generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // 🔍 Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userCheckError) throw userCheckError;
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ➕ Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          email,
          password: hashedPassword,
          role: "user",
          username,
          phone,
          is_verified: false,
        },
      ])
      .select("id, email, username")
      .single();

    if (insertError) throw insertError;
    if (!newUser) {
      return res.status(500).json({ error: "User creation failed" });
    }

    // 🔑 Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // 💾 Save OTP
    const { error: otpError } = await supabase
      .from("email_tokens")
      .insert([
        {
          user_id: newUser.id,
          token: otp,
          expires_at: expiresAt,
        },
      ]);

    if (otpError) throw otpError;

    // 📧 Send OTP email
    await sendVerificationEmail({ email, token: otp });

    // 🍪 Cookie for pending verification
    res.cookie("pendingVerification", newUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // ✅ Final response
    return res.status(201).json({
      success: true,
      message:
        "User registered successfully. Please check your email for the OTP to verify your account.",
      user_id: newUser.id,
      email: newUser.email,
    });
  } catch (err: any) {
    console.error("Register User Error:", err.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const sendVerificationEmailController = async (req: Request, res: Response) => {
  const { user_id, email } = req.body;

  console.log("📥 OTP email request received:", { user_id, email });

  if (!user_id || !email) {
    return res.status(400).json({ error: "user_id and email are required" });
  }

  try {
    // 🔍 Retrieve OTP from email_tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from("email_tokens")
      .select("token, expires_at")
      .eq("user_id", user_id)
      .maybeSingle();

    if (tokenError) throw tokenError;

    if (!tokenData) {
      return res.status(404).json({ error: "Verification OTP not found" });
    }

    // ⏳ Check expiry
    if (new Date(tokenData.expires_at) < new Date()) {
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    // 📧 Send OTP via email
    await sendVerificationEmail({ email, token: tokenData.token });

    return res.status(200).json({ message: "Verification OTP sent." });
  } catch (err: any) {
    console.error("❌ Failed to send OTP:", err);
    return res.status(500).json({ error: err.message || "Failed to send OTP" });
  }
};


// ✅ Check OTP verification status
export const checkVerificationStatus = async (req: Request, res: Response) => {
  try {
    const { user_id, email } = req.body;

    if (!user_id || !email) {
      return res.status(400).json({ error: "user_id and email are required." });
    }

    // 🔍 Fetch user’s verification status
    const { data: user, error } = await supabase
      .from("users")
      .select("is_verified")
      .eq("id", user_id)
      .eq("email", email)
      .single();

    if (error) {
      console.error("❌ Supabase error in checkVerificationStatus:", error.message);
      return res.status(500).json({ error: error.message });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(200).json({ verified: user.is_verified });
  } catch (err: any) {
    console.error("❌ checkVerificationStatus failed:", err.message || err);
    return res.status(500).json({ error: "Something went wrong." });
  }
};

// ✅ Verify Email using OTP (Hybrid Flow)
export const verifyEmail = async (req: Request, res: Response) => {
  const { user_id, email, otp } = req.body;
  console.log("🔐 OTP verification attempt:", { user_id, email, otp });

  if (!user_id || !email || !otp) {
    return res.status(400).json({ error: "user_id, email, and otp are required" });
  }

  try {
    // 1. Look up OTP in email_tokens table
    const { data: tokenRow, error: tokenError } = await supabase
      .from("email_tokens")
      .select("*")
      .eq("user_id", user_id)
      .eq("token", otp)
      .maybeSingle();

    if (tokenError || !tokenRow) {
      console.error("❌ Invalid OTP or not found.");
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // 2. Check if OTP is expired
    const now = new Date();
    const tokenExpiry = new Date(tokenRow.expires_at);
    if (tokenExpiry < now) {
      console.warn("⌛ OTP has expired.");
      return res.status(400).json({ error: "OTP has expired. Please request a new one." });
    }

    // 3. Look up user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, email, is_verified, username, role")
      .eq("id", user_id)
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.error("❌ User not found for OTP.");
      return res.status(404).json({ error: "User not found" });
    }

    if (user.is_verified) {
      console.log("ℹ️ User already verified.");
      return res.status(200).json({ message: "Email already verified" });
    }

    // 4. Update user to set is_verified = true
    const { error: updateError } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("id", user_id);

    if (updateError) {
      console.error("❌ Failed to update user verification:", updateError);
      return res.status(500).json({ error: "Could not verify email" });
    }

    // 5. Delete OTP after successful verification
    await supabase.from("email_tokens").delete().eq("user_id", user_id);

    console.log(`✅ Email verified for user: ${user.email}`);

    // 🔹 HYBRID FLOW
    if (req.cookies?.pendingVerification === user.id) {
      // Auto-login case
      const token = signToken(user);
      res.clearCookie("pendingVerification");
      return res.status(200).json({
        message: "Email verified and logged in!",
        autoLogin: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      });
    } else {
      // Manual login case
      return res.status(200).json({
        message: "Email verified successfully. Please log in.",
        autoLogin: false,
        redirect: "/login",
      });
    }
  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message || err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// ✅ Resend Verification Email (OTP-based + Hybrid Flow)
export const resendEmailController = async (req: Request, res: Response) => {
  const { user_id, email } = req.body;

  console.log("📥 Resend verification email request:", { user_id, email });

  if (!user_id || !email) {
    return res.status(400).json({ error: "user_id and email are required" });
  }

  try {
    // 1. Generate new OTP (6 digits)
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // 2. Delete old OTPs for this user
    await supabase.from("email_tokens").delete().eq("user_id", user_id);

    // 3. Save new OTP
    const { error: insertError } = await supabase.from("email_tokens").insert([
      {
        user_id,
        token: newOtp, // storing OTP in token column
        expires_at: expiry.toISOString(),
      },
    ]);

    if (insertError) throw insertError;

    // 4. Send OTP via email
    await sendVerificationEmail({ email, token: newOtp });

    // 5. Reset pendingVerification cookie
    res.cookie("pendingVerification", user_id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    return res.status(200).json({ message: "Verification OTP resent successfully." });
  } catch (err: any) {
    console.error("❌ Error resending verification OTP:", err.message || err);
    return res.status(500).json({ error: "Could not resend verification OTP." });
  }
};


// ✅ Login
export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    // 1. Find user by email, username, or phone
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${identifier},username.eq.${identifier},phone.eq.${identifier}`)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // 3. Check if user is verified
    if (!user.is_verified) {
      console.log("⚠️ User not verified. Checking OTP rate limit...");

      // Look for existing OTP
      const { data: existingToken } = await supabase
        .from("email_tokens")
        .select("token, created_at, expires_at")
        .eq("user_id", user.id)
        .maybeSingle();

      const now = new Date();

      if (existingToken) {
        const createdAt = new Date(existingToken.created_at);
        const expiresAt = new Date(existingToken.expires_at);

        // If OTP is still valid and was created less than 2 min ago → reuse it
        const within2Mins = now.getTime() - createdAt.getTime() < 2 * 60 * 1000;
        if (within2Mins && expiresAt > now) {
          return res.status(403).json({
            message: "Email not verified. OTP already sent recently, please check your inbox.",
            redirect: "/check-email",
            user_id: user.id,
            email: user.email,
          });
        }

        // Otherwise cleanup old OTP
        await supabase.from("email_tokens").delete().eq("user_id", user.id);
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

      // Save new OTP
      const { error: insertError } = await supabase.from("email_tokens").insert([
        {
          user_id: user.id,
          token: otp,
          expires_at: expiry.toISOString(),
        },
      ]);

      if (insertError) {
        console.error("❌ Failed to save OTP:", insertError.message);
        return res.status(500).json({ message: "Could not generate OTP" });
      }

      // Send OTP email
      await sendVerificationEmail({ email: user.email, token: otp });

      return res.status(403).json({
        message: "Email not verified. New OTP sent to your email.",
        redirect: "/check-email",
        user_id: user.id,
        email: user.email,
      });
    }

    // 4. If verified, issue token
    const token = signToken(user);

    // ✅ Return user details
    const { id, email, username, phone, role } = user;
    return res.json({
      token,
      user: {
        id,
        email,
        username,
        phone,
        role,
      },
    });

  } catch (err: any) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ Get User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  console.log("👤 Logged-in user:", user);
  
  if (!user || user.role !== 'user') {
    return res.status(403).json({ error: 'Forbidden: Users only' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, phone, role, is_verified, created_at')
      .eq('id', user.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'User not found' });

    return res.json({ success: true, user: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

// GET /api/products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;
    const isFeatured = req.query.featured === 'true';

    // Build Supabase query
    let query = supabase
      .from('products')
      .select(`
        id,
        slug,
        name,
        description,
        price,
        original_price,
        images,
        rating,
        review_count,
        category,
        benefits,
        is_featured
      `)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (isFeatured) {
      query = query.eq('is_featured', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      console.error('Product fetch error:', error?.message || 'Product not found');
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/paymentController.ts
export const initiateMoMoPayment = async (req: Request, res: Response) => {
  const { phone, amount } = req.body;

  try {
    const momoRes = await axios.post(
      'https://sandbox.momodeveloper.mtn.com/collection/v1_0/requesttopay',
      {
        amount: amount,
        currency: 'GHS',
        externalId: Date.now().toString(),
        payer: {
          partyIdType: 'MSISDN',
          partyId: phone, // e.g. 233540000000
        },
        payerMessage: 'Payment for your order',
        payeeNote: 'Thanks for shopping!',
      },
      {
        headers: {
          'X-Reference-Id': 'GENERATE_UUID_HERE', // required
          'X-Target-Environment': 'sandbox',
          'Ocp-Apim-Subscription-Key': '95752155dcfa4ecfabff17ede089ebe3',
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ success: true, momoRes: momoRes.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Payment failed' });
  }
};
// GET /user/contact-info
export const getContactInfo = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from("contact_info")
    .select("*");

  if (error) {
    console.error("❌ Error fetching contact info:", error);
    return res.status(500).json({ error: "Failed to load contact info" });
  }

  return res.json(data);
};

// POST /user/contact
export const sendContactMessage = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert([{ name, email, message }]);

  if (error) {
    console.error("❌ Error saving contact message:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }

  return res.json({ message: "Message sent successfully!" });
};

interface Testimonial {
  id: number;
  name: string;
  text: string;
  image?: string;
  rating: number;
  user_id?: string;
  created_at?: string;
}

// Type for inserting (id is optional because it will be generated)
interface InsertTestimonial {
  name: string;
  text: string;
  image?: string;
  rating: number;
  user_id?: string;
}

// Get all testimonials
export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("*") as unknown as { data: Testimonial[]; error: any };

    if (error) {
      console.error("❌ Supabase error while fetching testimonials:", error);
      throw error;
    }

    // 🔎 Debug log
    console.log("✅ Testimonials fetched from DB:", data);

    res.json(data);
  } catch (err: any) {
    console.error("❌ Unexpected error in getTestimonials:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Add testimonial
export const addTestimonial = async (req: Request, res: Response) => {
  const { name, text, image, rating } = req.body;
  const user = (req as any).user;

  if (!name || !text || !rating) {
    return res.status(400).json({ error: 'Name, text, and rating are required' });
  }

  const newTestimonial: InsertTestimonial = {
    name,
    text,
    image,
    rating,
    user_id: user.id,
  };

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .insert(newTestimonial)
      .select()
      .single() as { data: Testimonial; error: any };

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete testimonial
export const deleteTestimonial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const { data: testimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single() as { data: Testimonial; error: any };

    if (fetchError || !testimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    if (testimonial.user_id !== user.id) {
      return res.status(403).json({ error: 'You can only delete your own testimonial' });
    }

    const { data, error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)
      .select()
      .single() as { data: Testimonial; error: any };

    if (error) throw error;
    res.json({ message: 'Testimonial deleted', testimonial: data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadImageController = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imageUrl = `/images/${req.file.filename}`;
  return res.json({ url: imageUrl });
};