import { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import ChatApp from './components/ChatApp'
import AdminDashboard from './components/AdminDashboard'

function App() {
  const [showCitationWindow, setShowCitationWindow] = useState(false)
  const citationContentRef = useRef<HTMLDivElement>(null)

  const handleShowCitation = () => {
    setShowCitationWindow(true)
  }

  const handleCloseCitation = () => {
    setShowCitationWindow(false)
  }

  // Auto-scroll to highlighted text when citation window opens
  useEffect(() => {
    if (showCitationWindow && citationContentRef.current) {
      const highlightedElement = citationContentRef.current.querySelector('.highlighted-text')
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }
    }
  }, [showCitationWindow])

  return (
    <Router>
      <div className="app">
        <div className="app-layout">
          <Routes>
            <Route path="/" element={<ChatApp onShowCitation={handleShowCitation} citationOpen={showCitationWindow} />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          
          {showCitationWindow && (
            <div className="citation-window">
              <div className="citation-window-header">
                <div className="citation-window-title">
                  <span className="logo-icon">📄</span>
                  <span className="logo-text">Source Document</span>
                </div>
                <div className="status">
                  <div className="status-dot connected"></div>
                  <span>Employee Handbook 2024</span>
                </div>
              </div>
              
              <main className="citation-window-main">
                <div className="citation-content" ref={citationContentRef}>
                  <div className="document-content">
                    <h1>EMPLOYEE HANDBOOK 2024</h1>
                    <p><strong>Version 3.2 - Last Updated: January 15, 2024</strong></p>

                    <h2>TABLE OF CONTENTS</h2>
                    <ol>
                      <li>Introduction and Welcome</li>
                      <li>Company Mission and Values</li>
                      <li>Organizational Structure</li>
                      <li>Employment Policies</li>
                      <li>Work Environment</li>
                      <li>Compensation and Benefits</li>
                      <li>Performance Management</li>
                      <li>Professional Development</li>
                      <li>Communication Protocols</li>
                      <li>Health and Safety</li>
                      <li>Legal Compliance</li>
                      <li>Contact Information</li>
                    </ol>

                    <hr />

                    <h2>1. INTRODUCTION AND WELCOME</h2>

                    <p>Welcome to our company! We are thrilled to have you join our team. This comprehensive employee handbook serves as your guide to understanding our company culture, policies, and procedures. Please take the time to read through this document carefully, as it contains essential information that will help you succeed in your role and contribute to our organization's success.</p>

                    <p>Our company was founded in 2010 with a vision to revolutionize the way businesses approach customer service and product development. Over the past decade, we have grown from a small startup to a thriving organization with over 500 employees across multiple locations. We pride ourselves on our innovative approach to problem-solving and our commitment to excellence in everything we do.</p>

                    <hr />

                    <h2>2. COMPANY MISSION AND VALUES</h2>

                    <h3>Mission Statement:</h3>
                    <p>To deliver exceptional value to our customers through innovative solutions, while fostering a workplace that empowers our employees to reach their full potential.</p>

                    <h3>Core Values:</h3>
                    <ul>
                      <li><strong>Innovation:</strong> We constantly seek new ways to improve and evolve</li>
                      <li><strong>Collaboration:</strong> We believe that great results come from working together</li>
                      <li><strong>Integrity:</strong> We conduct business with honesty and transparency</li>
                      <li><strong>Excellence:</strong> We strive for the highest quality in all our work</li>
                      <li><strong>Diversity:</strong> We celebrate and embrace different perspectives and backgrounds</li>
                    </ul>

                    <hr />

                    <h2>3. ORGANIZATIONAL STRUCTURE</h2>

                    <p>Our company operates under a flat organizational structure that promotes open communication and quick decision-making. The executive team consists of:</p>

                    <ul>
                      <li>Chief Executive Officer (CEO)</li>
                      <li>Chief Technology Officer (CTO)</li>
                      <li>Chief Financial Officer (CFO)</li>
                      <li>Chief Operating Officer (COO)</li>
                      <li>Chief People Officer (CPO)</li>
                    </ul>

                    <p>Each department is led by a Director who reports directly to the appropriate executive. We encourage all employees to reach out to leadership with questions, concerns, or innovative ideas.</p>

                    <hr />

                    <h2>4. EMPLOYMENT POLICIES</h2>

                    <h3>Equal Employment Opportunity:</h3>
                    <p>We are committed to providing equal employment opportunities to all individuals regardless of race, color, religion, sex, national origin, age, disability, or genetic information. We value diversity and inclusion in our workplace and believe that different perspectives lead to better outcomes.</p>

                    <h3>Anti-Harassment Policy:</h3>
                    <p>We maintain a zero-tolerance policy for harassment of any kind. All employees have the right to work in an environment free from discrimination, harassment, and retaliation. Any concerns should be reported immediately to Human Resources.</p>

                    <hr />

                    <h2>5. WORK ENVIRONMENT</h2>

                    <h3>Company Culture:</h3>
                    <p>Our company values innovation, collaboration, and continuous learning. We believe in fostering an inclusive environment where every team member feels valued and heard. We encourage open communication, creative thinking, and a growth mindset. Our culture is built on mutual respect, trust, and a shared commitment to excellence.</p>

                    <h3>Work Hours:</h3>
                    <p><span className="highlighted-text">Standard work hours are 9:00 AM to 5:00 PM, Monday through Friday. We offer flexible scheduling options for team members who need to accommodate personal commitments.</span></p>

                    <h3>Remote Work Policy:</h3>
                    <p>We support hybrid work arrangements. Team members can work from home up to 3 days per week, with approval from their direct supervisor. All remote work must be conducted in a professional environment with reliable internet connectivity. We provide the necessary tools and technology to ensure productivity regardless of location.</p>

                    <h3>Office Environment:</h3>
                    <p>Our office spaces are designed to promote collaboration and creativity. We provide ergonomic furniture, natural lighting, and quiet spaces for focused work. Break rooms are equipped with coffee, snacks, and comfortable seating areas for informal meetings and relaxation.</p>

                    <hr />

                    <h2>6. COMPENSATION AND BENEFITS</h2>

                    <h3>Salary and Compensation:</h3>
                    <p>We offer competitive salaries that are regularly reviewed and adjusted based on market conditions, individual performance, and company success. Annual performance reviews include salary discussions and potential adjustments.</p>

                    <h3>Benefits Package:</h3>
                    <p>Our comprehensive benefits package includes health insurance, dental coverage, vision care, and a 401(k) retirement plan with company matching. We also offer unlimited paid time off and professional development opportunities. Additional benefits include life insurance, disability coverage, and wellness programs.</p>

                    <h3>Health and Wellness:</h3>
                    <p>We prioritize employee health and wellness through various programs and initiatives. This includes gym memberships, mental health support, wellness challenges, and regular health screenings. We believe that healthy employees are more productive and engaged.</p>

                    <hr />

                    <h2>7. PERFORMANCE MANAGEMENT</h2>

                    <h3>Performance Reviews:</h3>
                    <p>Performance reviews are conducted quarterly to provide feedback and set goals for professional growth. These reviews are collaborative discussions between team members and their supervisors. We use a continuous feedback model that encourages regular communication about performance and development.</p>

                    <h3>Goal Setting:</h3>
                    <p>Employees work with their managers to set SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals that align with company objectives. These goals are reviewed and updated regularly throughout the year.</p>

                    <h3>Recognition and Rewards:</h3>
                    <p>We believe in recognizing and rewarding exceptional performance. Our recognition program includes peer nominations, manager acknowledgments, and company-wide celebrations of achievements.</p>

                    <hr />

                    <h2>8. PROFESSIONAL DEVELOPMENT</h2>

                    <h3>Learning and Growth:</h3>
                    <p>We invest heavily in employee development through various learning opportunities. This includes internal training programs, external workshops, conference attendance, and tuition reimbursement for relevant courses and certifications.</p>

                    <h3>Career Development:</h3>
                    <p>We support career growth through mentorship programs, internal mobility opportunities, and clear career progression paths. Employees are encouraged to explore different roles and departments to expand their skills and experience.</p>

                    <hr />

                    <h2>9. COMMUNICATION PROTOCOLS</h2>

                    <h3>Communication Guidelines:</h3>
                    <p>We use Slack for team communication, email for formal correspondence, and Zoom for video meetings. All team members are expected to respond to messages within 24 hours during business days. We encourage open and transparent communication at all levels of the organization.</p>

                    <h3>Meeting Protocols:</h3>
                    <p>Meetings should have clear agendas, start and end on time, and include action items with assigned responsibilities. We use collaborative tools to ensure all team members can contribute regardless of their location.</p>

                    <hr />

                    <h2>10. HEALTH AND SAFETY</h2>

                    <h3>Workplace Safety:</h3>
                    <p>We are committed to maintaining a safe and healthy work environment. All employees are required to follow safety protocols and report any hazards or incidents immediately. Regular safety training is provided to ensure everyone understands their role in maintaining workplace safety.</p>

                    <h3>Emergency Procedures:</h3>
                    <p>Clear emergency procedures are posted throughout the office and communicated to all employees. This includes evacuation routes, emergency contacts, and procedures for various types of emergencies.</p>

                    <hr />

                    <h2>11. LEGAL COMPLIANCE</h2>

                    <h3>Regulatory Compliance:</h3>
                    <p>We are committed to complying with all applicable laws and regulations. This includes labor laws, data protection regulations, and industry-specific requirements. All employees are expected to understand and follow relevant compliance requirements.</p>

                    <h3>Data Protection:</h3>
                    <p>We take data protection seriously and have implemented comprehensive security measures to protect sensitive information. All employees must follow data protection policies and procedures.</p>

                    <hr />

                    <h2>12. CONTACT INFORMATION</h2>

                    <h3>Human Resources:</h3>
                    <p>Email: hr@company.com<br />
                    Phone: (555) 123-4567<br />
                    Office: Suite 200, Main Building</p>

                    <h3>IT Support:</h3>
                    <p>Email: support@company.com<br />
                    Phone: (555) 123-4568<br />
                    Office: Suite 150, Main Building</p>

                    <h3>Facilities:</h3>
                    <p>Email: facilities@company.com<br />
                    Phone: (555) 123-4569<br />
                    Office: Ground Floor, Main Building</p>

                    <hr />

                    <p>This handbook is a living document that will be updated regularly to reflect our evolving policies and procedures. All employees will be notified of any changes and are responsible for staying current with the latest version.</p>

                    <p>For questions or clarifications about any policy or procedure outlined in this handbook, please contact Human Resources.</p>
                  </div>
                </div>
              </main>

              <button className="close-citation-btn" onClick={handleCloseCitation}>
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </Router>
  )
}

export default App
