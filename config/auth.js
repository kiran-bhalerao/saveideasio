module.exports = (req,res,next)=>{
    if(req.isAuthenticated())
    return next();
    req.flash('error_msg','Not Authorized');
    res.redirect('/user/login');
};