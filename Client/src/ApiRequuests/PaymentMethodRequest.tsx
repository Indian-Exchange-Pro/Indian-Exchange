import { AxiosResponse } from "axios";
import { axiosPrivate, axiosPublic } from "../ApiServices/Axios";
import { AuthResponse, UserModel } from "@/models/AuthModels";
import { IProfileResponse } from "@/models/ProfileModels";
// import { axiosPublic, axiosPrivate } from "../../../../ApiServices/Axios";
// import { AuthResponse, UserModel } from "./_models";

// API Endpoints
export const GET_PAYMENT_METHODS = "/payment-methods/my-payment-method";
export const ADD_PAYMENT_METHOD = "/payment-methods/add-payment-method";
export const UPDATE_PAYMENT_METHOD = "/payment-methods/update-payment-method";
export const DELETE_PAYMENT_METHOD = "/payment-methods/delete-payment-method";

export const getPaymentMethods = () => {
  return axiosPrivate.get(`${GET_PAYMENT_METHODS}`);
  // return axiosPrivate.get(`${GET_PAYMENT_METHODS}/${isDefault || undefined}`);
};

export const addPaymentMethod = (data: any) => {
  return axiosPrivate.post(ADD_PAYMENT_METHOD, data);
};

export const updatePaymentMethod = (id: string, data: any) => {
  return axiosPrivate.put(`${UPDATE_PAYMENT_METHOD}/${id}`, data);
};

export const deletePAymentMethod = (id: any) => {
  return axiosPrivate.delete(`${DELETE_PAYMENT_METHOD}/${id}`);
};
