const Campground = require("../models/campground")

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render("campgrounds/index", { campgrounds })
}

module.exports.renderNewForm = (req, res, next) => {
    res.render("campgrounds/new")
}

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash("success", "Successfully made a new campground!")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("author")
    if (!campground) {
        req.flash("error", "Cannot find campground!")
        res.redirect("/campgrounds")
    }
    else {
        res.render("campgrounds/show", { campground })
    }
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit", { campground })
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params
    await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash("success", "Successfully updated campground!")
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted campground!")
    res.redirect("/campgrounds")
}