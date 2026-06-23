const {GoogleGenAI} = require("@google/genai")
const {z}= require("zod")
const {zodToJsonSchema}=require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai=new GoogleGenAI({

    apiKey: process.env.GOOGLE_GENAI_API_KEY
})



const interviewReportSchema= z.object({

    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description, with 100 being a perfect match"),

    technicalQuestions: z.array(z.object({
question: z.string().describe("The technical question can be asked in the interview"),
intention: z.string().describe("The intention of interviewer behind the technical question"),
answer: z.string().describe("How to answer this question, what points to cover, what approach to take, what mistakes to avoid")
    })).describe("The technical questions that can be asked in the interview along with their intention and how to answer them"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind the behavioral question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take, what mistakes to avoid")
    })).describe("The behavioral questions that can be asked in the interview along with their intention and how to answer them"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"), 

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g., data structures, algorithms, system design, mock interviews,etc."),
        tasks: z.array(z.string()).describe("The list of tasks to be completed on this day in the preparation plan, e.g., read a book, watch a video, solve problems, etc.")
    })).describe("The preparation plan for the candidate to follow, with each day having a focus and a list of tasks to complete"),
    title: z.string().describe("The title of the job for which the interview report is generated, e.g., 'Senior Frontend Engineer at Google'")
})



async function generateInterviewReport({resume,selfDescription,jobDescription}){

    const prompt = `
Generate an interview report.

IMPORTANT:
Return ONLY valid JSON.

Use EXACTLY these field names:

{
  "matchScore": 85,
  "technicalQuestions": [
    {
      "question": "Question text",
      "intention": "Why interviewer asks it",
      "answer": "Expected answer"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Question text",
      "intention": "Why interviewer asks it",
      "answer": "Expected answer"
    }
  ],
  "skillGaps": [
    {
      "skill": "Docker",
      "severity": "medium"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "React",
      "tasks": ["Task 1", "Task 2"]
    }
  ],
  "title": "SDE Interview Report"
}

Do NOT use snake_case.
Do NOT return arrays of strings.
technicalQuestions and behavioralQuestions MUST contain objects with question, intention and answer.

Generate:
- 5 technical questions
- 5 behavioral questions
- 3-5 skill gaps
- 7 day preparation plan

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;


    const response= await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config:{
            responseMimeType: "application/json",
            

        }
    })

    console.log("RAW RESPONSE:");
console.log(response);

console.log("RESPONSE TEXT:");
console.log(response.text);

let parsedResponse;

try {
    parsedResponse = JSON.parse(response.text);
} catch (error) {
    console.error("JSON PARSE ERROR:");
    console.error(response.text);
    throw error;
}

console.log("PARSED RESPONSE:");
console.log(JSON.stringify(parsedResponse, null, 2));

const normalizedResponse = {
    matchScore:
        parsedResponse.matchScore ?? parsedResponse.match_score,

    technicalQuestions:
        parsedResponse.technicalQuestions ??
        parsedResponse.technical_questions,

    behavioralQuestions:
        parsedResponse.behavioralQuestions ??
        parsedResponse.behavioral_questions,

    skillGaps:
        parsedResponse.skillGaps ??
        parsedResponse.skill_gaps,

    preparationPlan:
        parsedResponse.preparationPlan ??
        parsedResponse.preparation_plan,

    title:
        parsedResponse.title ?? "SDE Interview Report"
};

console.log("NORMALIZED RESPONSE:");
console.log(normalizedResponse);

return normalizedResponse;

}

async function generatePdfFromHtml(htmlContent){

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', margin:{ top:"20mm", bottom:"20mm", left:"15mm", right:"15mm" } });

    await browser.close();

    return pdfBuffer;
}

async function generateResumePdf({resume,selfDescription,jobDescription}){

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate a resume for a candidate with the following details:
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

the response should be a JSON with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer. Do NOT return the PDF file itself, return only the HTML content in the "html" field of the JSON response. The HTML should be well-structured and properly formatted to represent a professional resume.
The resume should be for the given job description and should highlight the candidate's strengths while also addressing any potential weaknesses. The resume should be ATS-friendly, meaning it should be easily parsable by Applicant Tracking Systems, and should include relevant keywords from the job description. The resume should also be visually appealing and easy to read for human recruiters.
The content of resume should not sound like it is generated by AI and should be as close as possible to a resume written by a human. The resume should include sections like Summary, Skills, Experience, Education, and Projects, and should be tailored to the job description provided. The resume should also be concise and should ideally fit within 1-2 pages.
you can highlight the content using some colors or different font styles but do NOT include any images or graphics in the resume. The resume should be in English and should use standard resume formatting conventions.
the content should be professional and should effectively showcase the candidate's qualifications for the job described in the job description. Remember, return ONLY valid JSON with a single field "html" containing the HTML content of the resume. Do NOT return any other text or information outside of the JSON response.
the resume should not be very lengthy, it should be of 1-2 pages when converted to PDF. Focus on quality of content rather than quantity and make sure to include all the relevant information that can help the candidate to get shortlisted for the interview based on the job description provided.
`;

const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
        responseMimeType: "application/json"
    }
})

const jsonContent = JSON.parse(response.text)

const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

return pdfBuffer



}



module.exports={generateInterviewReport, generateResumePdf}