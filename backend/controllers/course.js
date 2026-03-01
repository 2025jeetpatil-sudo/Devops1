const Course = require('../models/course');
const User = require('../models/user');
const Category = require('../models/category');
const CourseProgress = require('../models/courseProgress');

const { uploadImageToCloudinary } = require('../utils/imageUploader');
const { convertSecondsToDuration } = require("../utils/secToDuration");

// ================ create new course ================
exports.createCourse = async (req, res) => {
  try {
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      status = "Draft",
      tag,
      instructions
    } = req.body;

    console.log("REQ BODY =>", req.body);
    console.log("REQ FILES =>", req.files);

    const thumbnail = req.files?.thumbnailImage;

    if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    let parsedTags = [];
    let parsedInstructions = [];

    try {
      parsedTags = tag ? JSON.parse(tag) : [];
      parsedInstructions = instructions ? JSON.parse(instructions) : [];
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "tag or instructions must be valid JSON arrays"
      });
    }

    const instructorId = req.user.id;

    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    const thumbnailDetails = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorId,
      whatYouWillLearn,
      price,
      category: categoryDetails._id,
      tag: parsedTags,
      status,
      instructions: parsedInstructions,
      thumbnail: thumbnailDetails.secure_url,
      createdAt: Date.now(),
    });

    await User.findByIdAndUpdate(instructorId, {
      $push: { courses: newCourse._id }
    });

    await Category.findByIdAndUpdate(categoryDetails._id, {
      $push: { courses: newCourse._id }
    });

    return res.status(201).json({
      success: true,
      message: "New Course created successfully",
      data: newCourse
    });

  } catch (error) {
    console.error("CREATE COURSE ERROR =>", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating new course",
      error: error.message
    });
  }
};

// ================ show all courses ================
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find({})
      .populate("instructor", "firstName lastName email");

    return res.status(200).json({
      success: true,
      data: allCourses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================ Get Course Details ================
exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;

    const courseDetails = await Course.findById(courseId)
      .populate("instructor")
      .populate("category");

    if (!courseDetails) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    return res.status(200).json({ success: true, data: courseDetails });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================ Get Instructor Courses ================
exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;
    const courses = await Course.find({ instructor: instructorId });

    return res.status(200).json({ success: true, data: courses });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ================ Delete Course ================
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({ success: true, message: "Course deleted" });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
