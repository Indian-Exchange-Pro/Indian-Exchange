import PaymentMethod from "../models/PaymentMethod.js";
import { errorResponse, successResponse } from "../utils/responseHandler.js";

// Add a Payment Method
export const addPaymentMethod = async (req, res) => {
  try {
    const {
      methodType,
      bankDetails,
      upiId,
      isDefault,
      name,
      accountHolderName,
    } = req.body;
    const userId = req.user.id;

    if (isDefault) {
      await PaymentMethod.updateMany({ user: userId }, { isDefault: false });
    }

    const paymentMethod = new PaymentMethod({
      user: userId,
      methodType,
      name,
      accountHolderName,
      bankDetails,
      upiId,
      isDefault: isDefault || false,
    });

    await paymentMethod.save();

    return successResponse(
      res,
      "Payment method added successfully.",
      paymentMethod,
      201
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Failed to create payment method.");
  }
};

// Update a Payment Method
export const updatePaymentMethod = async (req, res) => {
  try {
    const {
      methodType,
      bankDetails,
      upiId,
      isDefault,
      name,
      accountHolderName,
    } = req.body;
    const { id } = req.params;

    const method = await PaymentMethod.findById(id);
    if (!method) {
      return errorResponse(res, "Payment method not found.", 404);
    }

    if (isDefault) {
      await PaymentMethod.updateMany(
        { user: method.user },
        { isDefault: false }
      );
    }

    const updated = await PaymentMethod.findByIdAndUpdate(
      id,
      {
        methodType,
        name,
        bankDetails,
        accountHolderName,
        upiId,
        isDefault: isDefault || false,
      },
      { new: true }
    );

    return successResponse(
      res,
      "Payment method updated successfully.",
      updated
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Failed to update payment method.");
  }
};

// Get User Payment Methods
export const getUserPaymentMethods = async (req, res) => {
  try {
    const { isDefault } = req.params;
    const methods = await PaymentMethod.find({ user: req.user.id });
    return successResponse(
      res,
      "Fetched payment methods successfully.",
      methods
    );
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Failed to fetch payment methods.");
  }
};

// Delete a Payment Method
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    const method = await PaymentMethod.findById(id);
    if (!method) {
      return errorResponse(res, "Payment method not found.", 404);
    }

    await PaymentMethod.findByIdAndDelete(id);
    return successResponse(res, "Payment method deleted successfully.");
  } catch (error) {
    console.error(error);
    return errorResponse(res, "Failed to delete payment method.");
  }
};
