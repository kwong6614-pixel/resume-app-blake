/** Sample resume text for API-mode template preview (pdf-lib). */
export const SAMPLE_API_RESUME_TEXT = `Alex Johnson
alex.johnson@email.com | +1 (555) 234-5678 | Austin, TX | linkedin.com/in/alexjohnson

Summary:
Results-driven software engineer with 8+ years of experience designing and delivering scalable web applications, APIs, and cloud-native systems. Proven track record leading cross-functional teams and improving system reliability.

Skills:
• Languages: JavaScript, TypeScript, Python, Go
• Frameworks: React, Next.js, Node.js, Express
• Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD

Professional Experience:
Senior Software Engineer at Horizon Labs: 03/2021 - Present
- Led migration of monolithic platform to microservices, reducing deployment time by 40%
- Architected real-time data pipeline serving 2M+ daily active users with sub-200ms latency
- Mentored team of 5 engineers and established code review standards across the org

Software Engineer at BrightPath Inc: 06/2017 - 02/2021
- Built customer-facing React dashboards used by 500+ enterprise clients
- Implemented OAuth2 authentication and role-based access control for internal tools
- Optimized database queries and caching, improving API response times by 35%

Education:
Bachelor of Science in Computer Science, University of Texas at Austin, 2017`;

/** Sample structured data for Without API mode template preview (React-PDF). */
export const SAMPLE_WITHOUT_API_PDF_DATA = {
  name: 'Alex Johnson',
  title: 'Senior Software Engineer',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 234-5678',
  location: 'Austin, TX',
  linkedin: 'linkedin.com/in/alexjohnson',
  website: null as string | null,
  summary:
    'Results-driven software engineer with 8+ years of experience designing scalable web applications and cloud-native systems. Strong focus on reliability, performance, and team leadership.',
  skills: {
    Languages: ['JavaScript', 'TypeScript', 'Python', 'Go'],
    Frameworks: ['React', 'Next.js', 'Node.js', 'Express'],
    'Cloud & DevOps': ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'Horizon Labs',
      location: 'Austin, TX',
      start_date: '03/2021',
      end_date: 'Present',
      industry: 'SaaS',
      details: [
        'Led migration to microservices, reducing deployment time by **40%**',
        'Architected real-time pipeline serving **2M+** daily users',
        'Mentored team of 5 engineers and improved code quality standards',
      ],
    },
    {
      title: 'Software Engineer',
      company: 'BrightPath Inc',
      location: 'Remote',
      start_date: '06/2017',
      end_date: '02/2021',
      industry: 'FinTech',
      details: [
        'Built React dashboards for **500+** enterprise clients',
        'Implemented OAuth2 and RBAC for internal admin tools',
        'Optimized queries and caching, improving API latency by **35%**',
      ],
    },
  ],
  education: [
    {
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of Texas at Austin',
      start_year: '2013',
      end_year: '2017',
      grade: '3.7',
    },
  ],
};
