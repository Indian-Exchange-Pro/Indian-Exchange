export const successResponse = (res, message = '', result = {}, code = 200) => {
    return res.status(code).json({
      success: true,
      message,
      result
    });
  };
  
  export const errorResponse = (res, message = '', code = 400, result = {}) => {
    return res.status(code).json({
      success: false,
      message,
      result
    });
  };
  