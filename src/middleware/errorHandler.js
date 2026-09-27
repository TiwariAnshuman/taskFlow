 const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid task ID",
       error:null,

    });
  }
// mongoose validation error
if(err.name === "validationError"){
  const errors= Object.values(err.errors).map(
    (error)=>error.message
  );
   return res.status(400).json({
    success:false,
    message:"database validation failded",
    error:errors,

   });
}
// dublicate mongoDb values
 if(err.code === 11000){
  const field =Object.keys(err.keyValue)[0];
  return res.status(400).json({
    success:false,
    message:`${field} already exists`,
    error:null,

  });
 }
 // genric error
 
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error:null,
    
  });
};
 export default errorHandler;
