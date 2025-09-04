import { Request, Response } from 'express';
export declare const registerUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const sendVerificationEmailController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const checkVerificationStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const resendEmailController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getUserProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProductBySlug: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const initiateMoMoPayment: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map