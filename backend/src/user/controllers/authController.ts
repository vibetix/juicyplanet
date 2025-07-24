import { Request, Response } from 'express';
import supabase from '../utils/supabaseClient';

// ✅ Verify email using token
export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Invalid verification token' });
  }

  try {
    // 1. Find the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_tokens')
      .select('user_id')
      .eq('token', token)
      .maybeSingle();

    if (tokenError || !tokenData) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const userId = tokenData.user_id;

    // 2. Update the user as verified
    const { error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to verify email' });
    }

    // 3. Delete token (optional but clean)
    await supabase.from('email_tokens').delete().eq('token', token);

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
};
