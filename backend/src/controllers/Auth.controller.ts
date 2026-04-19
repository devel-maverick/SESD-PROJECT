import { Request, Response } from 'express';
import { AuthService } from '../services/Auth.service';

export class AuthController {
  private readonly authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({ success: false, message: 'Name, email and password are required' });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        return;
      }

      const result = await this.authService.register({ name, email, password, role: role || 'user' });
      res.status(201).json({ success: true, message: 'Registered successfully', ...result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login(email, password);
      res.status(200).json({ success: true, message: 'Login successful', ...result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  };
}
