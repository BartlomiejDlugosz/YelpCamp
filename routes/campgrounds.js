const express = require("express")
const router = express.Router()
const multer = require("multer")
const { storage } = require("../cloudinary")
const upload = multer({ storage })
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware")

const catchAsync = require("../utils/catchAsync")
const campgrounds = require("../controllers/campgrounds")

router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground))

router.get("/new", isLoggedIn, campgrounds.renderNewForm)

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router