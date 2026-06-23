const pdfParse = require("pdf-parse")
const {generateInterviewReport, generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * 
 * @description
 */


async function generateInterViewReportController(req,res){

    console.log("BODY:", req.body)
console.log("FILE:", req.file)

    const resumeFile=req.file

    console.log(req.file);

    if (!req.file) {
    return res.status(400).json({
        message: "Resume file not received"
    })
}

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()

    console.log("RESUME CONTENT:");
console.log(resumeContent.text);



    const {selfDescription,jobDescription} = req.body


    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })
console.log("AI REPORT:");
console.log(JSON.stringify(interviewReportByAi, null, 2));


    const interviewReport = await interviewReportModel.create({

        user: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({

        message:"Interview report generated successfully",
        interviewReport
    })


}


/**
 * @description get interview report by id.
 * 
 */
async function getInterviewReportByIdController(req,res){

    const {interviewId} = req.params

    const interviewReport = await interviewReportModel.findOne({_id:interviewId,user:req.user._id})

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    res.status(200).json({
        message:"Interview report found",
        interviewReport
    })

}

/**
 * @description get all interview reports of the logged in user.
 */

async function getAllInterviewReportsController(req,res){

    const interviewReports = await ( interviewReportModel.find({user:req.user._id})).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message:"Interview reports found",
        interviewReports
    })

}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */

async function generateResumePdfController(req,res){

    const {interviewReportId} = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    console.log("PARAMS:", req.params);
console.log("interviewReportId:", req.params.interviewReportId);

    if(!interviewReport){
        return res.status(404).json({
            message:"Interview report not found"
        })
    }

    const {resume, selfDescription, jobDescription} = interviewReport

    const pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription})

    res.set({
        "Content-Type":"application/pdf",
        "Content-Disposition":`attachment; filename=resume_${interviewReportId}.pdf`
    })
    res.send(pdfBuffer)
}

module.exports= {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}
