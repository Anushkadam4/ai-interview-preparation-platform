import axios from "axios";

const api= axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
})



/**
 * @description Service to generate interview report on the basis of user self description, resume pdf and job description.
 */

export const generateInterviewReport = async ({jobDescription, selfDescription, resume}) => {
    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("selfDescription", selfDescription);
    formData.append("resume", resume);

    

console.log("resume:", resume)
console.log("formData resume:", formData.get("resume"))


   const response = await api.post("api/interview/", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return response.data;
}

/**
 * @description Service to get interview report by id.
 */

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * @description Service to get all interview reports of the logged in user. 
 */

export const getAllInterviewReports = async () => {
    const response = await api.get("api/interview/");
    return response.data;
}

/**
 * @description Service to generate resume PDF based on user self description, resume and job description.
 */

export const generateResumePdf = async (interviewReportId) => {

    console.log("PDF ID:", interviewReportId);

    const response = await api.get(
        `api/interview/resume/pdf/${interviewReportId}`,
        {
            responseType: "blob"
        }
    );

    return response.data;
}