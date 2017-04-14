/**
 * Created by chenma on 12/24/2016.
 */
var passUrl = [
    '/',
    '/login'
     ];
var notAllowForReadOnlyUrls = [
    ];

function AuthFilter(req, res, next){
    var url = req.url;
    if(!!req.session.userName) {
        if(!!req.session.readOnly && notAllowForReadOnlyUrls.indexOf(url) > -1){
            res.redirect('/logout');
         }else {
            next();
        }
    }else if(passUrl.indexOf(url) < 0 ){
        res.redirect('/');
    }else {
    next();
    }
}
module.exports=AuthFilter;

