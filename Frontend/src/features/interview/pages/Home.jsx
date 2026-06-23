import React,{useState,useRef} from 'react'
import "../style/home.scss"
import { useInterview } from '../hook/useInterview.js'
import { useNavigate } from 'react-router'

const UploadIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#e91e63" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 16 12 12 8 16" />
        <line x1="12" y1="12" x2="12" y2="21" />
        <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
)

const BriefcaseIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
)

const PersonIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
)

const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

const StarIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
)

const Home = () => {

    
    const {loading, generateReport, reports} = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const resumeInputRef = useRef()
    const [resumeFile, setResumeFile] = useState(null)

    const charCount = jobDescription.length;
const maxChars = 5000;



    const navigate = useNavigate()

    const handleGenerateReport = async () => {
    console.log("resumeFile =", resumeFile)

    if (!resumeFile) {
        alert("Please upload a resume")
        return
    }

    console.log("resumeFile =", resumeFile)

    const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile
    })

    if (!data) {
        console.log("Report generation failed")
        return
    }

    navigate(`/interview/${data._id}`)
}

    return (
        <main className='home'>

            <header className="home__header">
                <h1>Create Your Custom <span className="home__title-accent">Interview Plan</span></h1>
                <p className="home__subtitle">
                    Let our AI analyze the job requirements and your unique profile to<br />
                    build a winning strategy.
                </p>
            </header>

            <div className="home__card">
                <div className="home__columns">

                    {/* Left — Job Description */}
                    <div className="home__left">
                        <div className="home__section-header">
                            <BriefcaseIcon />
                            <h2>Target Job Description</h2>
                            <span className="badge badge--required">REQUIRED</span>
                        </div>
                        <textarea
                        onChange={(e)=>{setJobDescription(e.target.value)}}
                            className="home__textarea"
                            name="jobDescription"
                            id="jobDescription"
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            value={jobDescription}
                
                        />
                        <span className="home__char-counter">{charCount} / {maxChars} chars</span>
                    </div>

                    {/* Right — Profile */}
                    <div className="home__right">
                        <div className="home__section-header">
                            <PersonIcon />
                            <h2>Your Profile</h2>
                        </div>

                        <div className="home__resume-section">
                            <div className="home__resume-label">
                                <span>Upload Resume</span>
                                <span className="badge badge--best">BEST RESULTS</span>
                            </div>
                            <label className="home__upload-area" htmlFor="resume">
                                <UploadIcon />
                                <p className="home__upload-title">Click to upload or drag &amp; drop</p>
                                <p className="home__upload-sub">
                                    {resumeFile ? resumeFile.name : 'PDF or DOCX (Max 5MB)'}
                                </p>
                                <input

                                    hidden
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf,.docx"
                                    ref={resumeInputRef}
                                      
                                  onChange={(e) => setResumeFile(e.target.files[0])}

                                />
                            </label>
                        </div>

                        <div className="home__divider"><span>OR</span></div>

                        <div className="home__self-description">
                            <label htmlFor="selfDescription">Quick Self-Description</label>
                            <textarea
                                onChange={(e)=>{setSelfDescription(e.target.value)}}
                                className="home__textarea home__textarea--sm"
                                name="selfDescription"
                                id="selfDescription"
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                value={selfDescription}
                                
                            />
                        </div>

                        <div className="home__info-box">
                            <InfoIcon />
                            <p>
                                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
                                required to generate a personalized plan.
                            </p>
                        </div>
                    </div>

                </div>

                {reports.length>0 && (
                    <section className= 'recent-reports'>
                        <h2>My Recent Interview Plans</h2>
                        <ul className='reports-list'>
                            {reports.map(report=>(
                                <li
                                    key={report._id}
                                    className='report-item'
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                >
                                    <h3>{report.title || 'Untitled Interview Plan'}</h3>
                                    <p>{report.createdAt ? new Date(report.createdAt).toLocaleDateString() : 'Recently created'}</p>
                                    <p className={`match-score ${report.matchScore >= 80 ? 'high' : report.matchScore >= 50 ? 'medium' : 'low'}`}>
                                        Match Score: {report.matchScore ? `${report.matchScore}%` : 'N/A'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                <div className="home__card-footer">
                    <p className="home__footer-text">AI-Powered Strategy Generation &bull; Approx 30s</p>
                    <button
                      onClick={handleGenerateReport}
                        
                        className="home__generate-btn"

                        disabled={loading}
                    >
                        <StarIcon />
                        {loading? 'Generating...' : 'Generate My Interview Strategy'}
                    </button>
                </div>
            </div>

            <nav className="home__nav-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Help Center</a>
            </nav>

        </main>
    )
}

export default Home