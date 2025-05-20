import { AxiosResponse } from "axios";
import { axiosPrivate, axiosPublic } from "../ApiServices/Axios";
import { AuthResponse, UserModel } from "@/models/AuthModels";
import { IProfileResponse } from "@/models/ProfileModels";
// import { axiosPublic, axiosPrivate } from "../../../../ApiServices/Axios";
// import { AuthResponse, UserModel } from "./_models";

// API Endpoints
export const GET_USER_BY_ACCESSTOKEN_URL = "/verify_token";
export const LOGIN_URL = "/auth/login";
export const REGISTER_URL = "/auth/register";
export const PROFILE_URL = "/auth/profile";
export const FORGOT_PASSWORD = "/auth/forgot-password";
export const SEND_OTP = "/auth/send-otp";
export const RESET_PASSWORD = "/auth/reset-password";

// 🔹 Login (Public API)
export function login(email: string, password: string) {
  return axiosPublic.post<AuthResponse>(LOGIN_URL, { email, password });
}

// 🔹 Register (Public API)
export function register(
  email: string,
  name: string,
  mobile: string,
  password: string,
  otp: string,
  referral: string
) {
  return axiosPublic.post(REGISTER_URL, {
    email,
    mobile,
    name,
    password,
    otp,
    referral_code: referral,
  });
}

// 🔹 Forgot Password (Public API)
export function forgotPassword(email: string) {
  return axiosPublic.post(FORGOT_PASSWORD, { email });
}

// 🔹 Reset Password Password (Public API)
export function resetPassword(token: string, newPassword: string) {
  return axiosPublic.post(RESET_PASSWORD, { token, newPassword });
}

// 🔹 Get User by Access Token (Protected API)
export function getUserByToken() {
  return axiosPrivate.get<UserModel>(GET_USER_BY_ACCESSTOKEN_URL);
}

//Get User Profile
export function getUserProfile() {
  return axiosPrivate.get<IProfileResponse>(PROFILE_URL);
}

//send otp
export function sendOTP(email: String) {
  return axiosPrivate.post<any>(SEND_OTP, { email });
}
