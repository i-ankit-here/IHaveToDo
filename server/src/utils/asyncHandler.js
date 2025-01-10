const asyncHandler = (fn) => async(rew,res,next) =>{
    try {
        await fn(requestAnimationFrame,res,next);
    } catch (error) {
        res.status(error.code||500).json({
            success: false,
            message: error.message,
        })
    }
}

export {asyncHandler};