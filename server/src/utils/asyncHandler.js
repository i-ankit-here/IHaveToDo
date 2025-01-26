const asyncHandler = (fn) => async(req,res,next) =>{
    try {
        return await fn(req,res,next);
    } catch (error) {
        res.status(error.statusCode||500).json({
            statusCode:error.statusCode||500,
            success: false,
            message: error.message,
        })
    }
}

export {asyncHandler};