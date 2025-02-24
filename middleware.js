const Campground = require("./models/campground")
const Review = require("./models/review")
const { campgroundSchema } = require("./schemas")
const ExpressError = require("./utils/ExpressError")
const { reviewSchema } = require("./schemas")

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be signed in first!")
        return res.redirect("/login")
    }
    next()
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash("error", "Cannot find campground!")
        return res.redirect("/campgrounds")
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    console.log(req.body)
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next()
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review) {
        req.flash("error", "Cannot find review!")
        return res.redirect(`/campgrounds/${id}`)
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}