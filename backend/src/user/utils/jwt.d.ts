interface TokenPayload {
    id?: string;
    email: string;
    role: 'user' | 'admin';
    [key: string]: any;
}
export declare const signToken: (payload: TokenPayload) => string;
export declare const verifyToken: (token: string) => TokenPayload;
export {};
//# sourceMappingURL=jwt.d.ts.map