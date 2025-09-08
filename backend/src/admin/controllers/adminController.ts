import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import supabase from '../utils/supabaseClient';
import { signToken } from '../utils/jwt';

// Register a new admin
export const registerAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { error: insertError } = await supabase.from('users').insert([
      {
        email,
        password: hashedPassword,
        role: 'admin',
      },
    ]);

    if (insertError) throw insertError;

    const token = signToken({ email, role: 'admin' });
    res.status(201).json({ success: true, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

// Login admin
export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .eq('role', 'admin')
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken({ email: user.email, role: user.role });
    res.json({ success: true, token });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Something went wrong' });
  }
};

// Admin profile
export const getAdminProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }

  res.json({ success: true, admin: user });
};
