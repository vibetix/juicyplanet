"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoMoToken = void 0;
// utils/momoAuth.ts
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const getMoMoToken = async () => {
    const user = 'YOUR_USER_ID';
    const apiKey = 'YOUR_API_KEY';
    const basicAuth = Buffer.from(`${user}:${apiKey}`).toString('base64');
    const response = await axios_1.default.post('https://sandbox.momodeveloper.mtn.com/collection/token/', null, {
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Ocp-Apim-Subscription-Key': '95752155dcfa4ecfabff17ede089ebe3',
        },
    });
    return response.data.access_token;
};
exports.getMoMoToken = getMoMoToken;
//# sourceMappingURL=momoAuth.js.map