const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")

console.log(authMiddleware)
console.log(upload)
console.log(interviewController)

const interviewRouter = express.Router()



/**
 * @route POST /api/interview/
 * @description generate new interview report on the basis of user self description, resume pdf and job description.
 * @access Private
 */

interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterViewReportController
)

/**
 * @route GET /api/interview/:interviewId
 * @description get interview report by id.
 * @access Private
 */
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportByIdController)  

/**
 * @route GET /api/interview/
 * @description get all interview reports of the logged in user.
 * @access Private
 */
interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllInterviewReportsController)

/**
 * @route GET /api/interview/resume/pdf
 * @description generate resume PDF based on user self description, resume and job description.
 * @access Private
 */

interviewRouter.get("/resume/pdf/:interviewReportId", authMiddleware.authUser, interviewController.generateResumePdfController)

 
module.exports = interviewRouter