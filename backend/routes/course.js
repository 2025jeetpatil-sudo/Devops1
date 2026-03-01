const express = require("express");
const router = express.Router();

const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getInstructorCourses,
  deleteCourse
} = require("../controllers/course");

const { auth, isInstructor } = require("../middleware/auth");

// create course
router.post("/createCourse", auth, isInstructor, createCourse);

// get all courses
router.get("/getAllCourses", getAllCourses);

// get single course
router.post("/getCourseDetails", getCourseDetails);

// instructor courses
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);

// delete course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

module.exports = router;
