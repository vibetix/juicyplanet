// controllers/userController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt";
import supabase from "../utils/supabaseClient";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase.from("users").insert([
    { email, password: hashedPassword, role: "user" }
  ]);

  if (error) return res.status(500).json({ error: error.message });

  const token = signToken({ email, role: "user" });
  res.status(201).json({ success: true, token });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("role", "user")
    .maybeSingle();

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Incorrect password" });

  const token = signToken({ email: user.email, role: user.role });
  res.json({ success: true, token });
};

export const getUserProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  if (user?.role !== "user") return res.status(403).json({ error: "Forbidden" });

  res.json({ success: true, user });
};
