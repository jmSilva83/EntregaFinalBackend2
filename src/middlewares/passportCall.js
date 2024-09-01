import passport from 'passport';

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) return next(error);
            if (!user) {
                req.user = user;
                
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};
