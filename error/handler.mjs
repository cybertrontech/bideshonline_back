import {CustomError} from "./CustomError.mjs";

function errorHandler(err, req, res, next){

    // Default error values
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    // Check if the error is a CustomError
    if (err instanceof CustomError) {
      statusCode = err.statusCode;
      message = err.message;
    }
  
    // Log the error
    // console.error(err);
  
    // Send error response to the client
    res.status(statusCode).json({ error: message });
  }
 
  // module.exports=errorHandler
// export default errorHandler
export {errorHandler}