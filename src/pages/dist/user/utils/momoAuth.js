"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoMoToken = void 0;
// utils/momoAuth.ts
const axios_1 = __importDefault(require("axios"));
const getMoMoToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = 'YOUR_USER_ID';
    const apiKey = 'YOUR_API_KEY';
    const basicAuth = Buffer.from(`${user}:${apiKey}`).toString('base64');
    const response = yield axios_1.default.post('https://sandbox.momodeveloper.mtn.com/collection/token/', null, {
        headers: {
            Authorization: `Basic ${basicAuth}`,
            'Ocp-Apim-Subscription-Key': '95752155dcfa4ecfabff17ede089ebe3',
        },
    });
    return response.data.access_token;
});
exports.getMoMoToken = getMoMoToken;
