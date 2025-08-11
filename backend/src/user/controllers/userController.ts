import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import supabase from '../utils/supabaseClient';
import { signToken } from '../utils/jwt';
import { generateToken } from '../utils/token';
import { sendVerificationEmail,sendContactNotification } from '../utils/mailer';
import crypto from 'crypto';
import axios from 'axios';

export const registerUser = async (req: Request, res: Response) => {
  const { email, password, username, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 🚫 Check if user exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          role: 'user',
          username,
          phone,
          is_verified: false,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 🧪 Generate token and save to email_tokens
    const token = generateToken();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    const { error: tokenError } = await supabase
      .from('email_tokens')
      .insert([{ user_id: newUser.id, token, expires_at: expiry.toISOString(), }]);

    if (tokenError) {
      return res.status(500).json({ error: 'Failed to save verification token' });
    }

    // ✅ Return user_id and email so frontend can trigger email sending separately
    return res.status(201).json({
      success: true,
      message: 'User registered. Please check your email to verify your account.',
      user_id: newUser.id,
      email: newUser.email
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};

export const sendVerificationEmailController = async (req: Request, res: Response) => {
  const { user_id, email } = req.body;

  console.log("📥 Email verification request received:", { user_id, email }); // 🔍 Log input

  if (!user_id || !email) {
    return res.status(400).json({ error: 'user_id and email are required' });
  }

  try {
    // Get token from email_tokens table
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_tokens')
      .select('token')
      .eq('user_id', user_id)
      .maybeSingle();

    if (tokenError) throw tokenError;

    if (!tokenData) {
      return res.status(404).json({ error: 'Verification token not found' });
    }

    // Send the email
    await sendVerificationEmail({ email, token: tokenData.token });

    return res.status(200).json({ message: 'Verification email sent.' });
  } catch (err: any) {
    console.error("❌ Failed to send verification email:", err); // Log error
    return res.status(500).json({ error: err.message || 'Failed to send verification email' });
  }
};

// ✅ check Email verification status
export const checkVerificationStatus = async (req: Request, res: Response) => {
  try {
    const { user_id, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('is_verified')
      .eq('email', email)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ verified: user?.is_verified });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// ✅ Verify Email
export const verifyEmail = async (req: Request, res: Response) => {
  const token = req.params.token;
  console.log("🔐 Token received in URL:", token);

  try {
    // 1. Look up token in email_tokens table
    const { data: tokenRow, error: tokenError } = await supabase
      .from('email_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenError || !tokenRow) {
      console.error("❌ Token not found or already used.");
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    // 2. Check if token is expired
    const now = new Date();
    const tokenExpiry = new Date(tokenRow.expires_at);
    if (tokenExpiry < now) {
      console.warn("⌛ Token has expired.");
      return res.status(400).json({ error: 'Token has expired. Please request a new one.' });
    }

    const userId = tokenRow.user_id;

    // 3. Look up user by user_id
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error("❌ User not found for token.");
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.is_verified) {
      console.log("ℹ️ User already verified.");
      return res.status(200).json({ message: 'Email already verified' });
    }

    // 4. Update user to set is_verified = true
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', userId);

    if (updateError) {
      console.error("❌ Failed to update user verification:", updateError);
      return res.status(500).json({ error: 'Could not verify email' });
    }

    // 5. Delete token after successful verification
    await supabase
      .from('email_tokens')
      .delete()
      .eq('token', token);

    console.log(`✅ Email verified for user: ${user.email}`);
    return res.status(200).json({ message: 'Email verified successfully' });

  } catch (err: any) {
    console.error("❌ Unexpected error:", err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Resend Verification Email
export const resendEmailController = async (req: Request, res: Response) => {
  const { user_id, email } = req.body;

  console.log("📥 Resend verification email request:", { user_id, email });

  if (!user_id || !email) {
    return res.status(400).json({ error: "user_id and email are required" });
  }

  try {
    // 1. Generate new token
    const newToken = generateToken();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    // 2. Delete old token (cleanup)
    await supabase.from("email_tokens").delete().eq("user_id", user_id);

    // 3. Save new token
    const { error: insertError } = await supabase.from("email_tokens").insert([
      {
        user_id,
        token: newToken,
        expires_at: expiry.toISOString(),
      },
    ]);

    if (insertError) throw insertError;

    // 4. Send verification email
    await sendVerificationEmail({ email, token: newToken });

    return res.status(200).json({ message: "Verification email sent." });
  } catch (err: any) {
    console.error("❌ Error resending verification email:", err);
    return res.status(500).json({ error: "Could not resend verification email." });
  }
};

// ✅ Login
export const loginUser = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .or(`email.eq.${identifier},username.eq.${identifier},phone.eq.${identifier}`)
    .single();

  if (error || !user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = signToken(user); // use your JWT utility

  // ✅ Return more user fields
  const { id, email, username, phone, role } = user;
  return res.json({
    token,
    user: {
      id,
      email,
      username,
      phone,
      role
    }
  });
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
    .select("*")
    .single();

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
   // Send notification email
    await sendContactNotification({ name, email, message });

  return res.json({ message: "Message sent successfully!" });
};

