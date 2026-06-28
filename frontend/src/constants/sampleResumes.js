// ─────────────────────────────────────────────────────────────
//  HireCraftt – Sample Resumes for Demonstration & Templates
//  10 profession-specific, realistic resumes
// ─────────────────────────────────────────────────────────────

export const sampleResumes = [
  // ───────────────────────── 1. Software Engineer ─────────────────────────
  {
    settings: { template: 'classic', color: 'blue', font: 'sans' },
    personalInfo: {
      fullName: 'Arjun Mehta',
      jobTitle: 'Senior Software Engineer',
      email: 'arjun.mehta@gmail.com',
      phone: '+91 98765 43210',
      location: 'Bengaluru, India',
      linkedin: 'linkedin.com/in/arjunmehta',
      photo: '',
    },
    summary:
      'Senior Software Engineer with 5+ years of experience designing and building scalable distributed systems at top-tier technology companies. Proficient in Go, Java, and Python with deep expertise in microservices architecture, cloud-native development, and performance optimization. Passionate about mentoring junior engineers and driving engineering excellence through robust code review practices.',
    experience: [
      {
        company: 'Google',
        position: 'Senior Software Engineer',
        startDate: '2023-01',
        endDate: 'Present',
        description:
          'Lead the backend team for Google Cloud Monitoring, architecting a real-time metrics pipeline processing 12 million events per second. Reduced p99 latency by 40% through query optimization and intelligent caching layers. Mentored a team of 4 engineers and drove adoption of gRPC across 3 internal services.',
      },
      {
        company: 'Microsoft',
        position: 'Software Engineer II',
        startDate: '2021-03',
        endDate: '2022-12',
        description:
          'Developed core features for Azure DevOps Pipelines, improving CI/CD build times by 25% for enterprise customers. Designed and implemented a fault-tolerant task scheduling system using Azure Service Bus and Cosmos DB. Contributed to open-source SDKs used by over 50,000 developers worldwide.',
      },
      {
        company: 'Flipkart',
        position: 'Software Engineer',
        startDate: '2019-07',
        endDate: '2021-02',
        description:
          'Built high-throughput order management microservices handling 500K+ daily transactions during peak sales events. Implemented an event-driven inventory sync system using Apache Kafka, reducing stock discrepancies by 60%. Participated in on-call rotations and resolved production incidents with an average MTTR of 15 minutes.',
      },
    ],
    education: [
      {
        school: 'Indian Institute of Technology, Bombay',
        degree: 'B.Tech in Computer Science & Engineering',
        startDate: '2015-07',
        endDate: '2019-05',
      },
      {
        school: 'Delhi Public School, R.K. Puram',
        degree: 'CBSE Class XII – Science (96.4%)',
        startDate: '2013-04',
        endDate: '2015-03',
      },
    ],
    skills: [
      'Go',
      'Java',
      'Python',
      'Kubernetes',
      'Docker',
      'gRPC & Protobuf',
      'Apache Kafka',
      'PostgreSQL',
      'Redis',
      'Google Cloud Platform',
      'CI/CD Pipelines',
      'System Design',
    ],
    projects: [
      {
        name: 'DistroCache',
        url: 'https://github.com/arjunmehta/distrocache',
        startDate: '2022-06',
        endDate: '2022-09',
        description:
          'Built an open-source distributed caching library in Go inspired by Groupcache, supporting consistent hashing, hot-key detection, and automatic peer discovery. Achieved 120K reads/sec on a 3-node cluster. Garnered 1,200+ GitHub stars.',
      },
      {
        name: 'CodeReview Bot',
        url: 'https://github.com/arjunmehta/cr-bot',
        startDate: '2021-01',
        endDate: '2021-04',
        description:
          'Developed a GitHub bot using Node.js and OpenAI APIs that automatically reviews pull requests, flags potential security issues, and suggests performance improvements. Deployed across 8 internal repositories at Microsoft.',
      },
      {
        name: 'Real-Time Analytics Dashboard',
        url: '',
        startDate: '2020-03',
        endDate: '2020-07',
        description:
          "Designed a real-time analytics dashboard for Flipkart's logistics team using React, D3.js, and WebSockets. Visualized delivery metrics across 20 cities, enabling operations managers to identify bottlenecks 3× faster.",
      },
    ],
    achievements: [
      {
        title: 'Google Spot Bonus – Engineering Excellence',
        date: '2023-09',
        description:
          'Awarded for leading the migration of a legacy monolith to microservices architecture, resulting in 99.99% uptime and 35% infrastructure cost reduction.',
      },
      {
        title: 'ACM ICPC Asia Regionals – Silver Medal',
        date: '2018-12',
        description:
          'Secured 14th place among 800+ teams in the ACM ICPC Asia Amritapuri Regional, solving 8 out of 11 problems within the 5-hour contest window.',
      },
    ],
    certifications: [
      {
        name: 'Google Cloud Professional Cloud Architect',
        issuer: 'Google Cloud',
        date: '2023-04',
      },
      {
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2021-08',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
      { language: 'Kannada', proficiency: 'Conversational' },
    ],
  },

  // ───────────────────────── 2. Full Stack Developer ─────────────────────────
  {
    settings: { template: 'classic', color: 'indigo', font: 'sans' },
    personalInfo: {
      fullName: 'Priya Sharma',
      jobTitle: 'Full Stack Developer',
      email: 'priya.sharma.dev@gmail.com',
      phone: '+91 87654 32109',
      location: 'Pune, India',
      linkedin: 'linkedin.com/in/priyasharmadev',
      photo: '',
    },
    summary:
      'Full Stack Developer with 3 years of experience building modern web applications at fast-paced startups. Skilled in React, Node.js, and TypeScript with a strong focus on delivering delightful user experiences and clean, maintainable codebases. Thrives in small, cross-functional teams where ownership and speed are paramount.',
    experience: [
      {
        company: 'Razorpay',
        position: 'Full Stack Developer',
        startDate: '2022-06',
        endDate: 'Present',
        description:
          'Spearheaded development of the merchant onboarding portal using React, Next.js, and Tailwind CSS, reducing average onboarding time from 48 hours to 6 hours. Built RESTful APIs with Node.js and Express powering the KYC verification pipeline. Collaborated with the design team to implement an accessible component library used across 5 product teams.',
      },
      {
        company: 'Cred',
        position: 'Frontend Developer',
        startDate: '2021-01',
        endDate: '2022-05',
        description:
          'Developed interactive reward experiences and gamification features on the CRED app web platform using React and Framer Motion, increasing user engagement by 22%. Optimized bundle size by 35% through code-splitting and lazy loading strategies. Integrated payment gateway flows handling ₹50Cr+ monthly transactions.',
      },
      {
        company: 'Freelance',
        position: 'Web Developer',
        startDate: '2020-03',
        endDate: '2020-12',
        description:
          'Delivered 12+ client projects ranging from e-commerce stores to SaaS dashboards. Built a custom CMS for a media company using Next.js and Strapi, serving 100K+ monthly visitors. Managed client relationships, timelines, and deployments independently.',
      },
    ],
    education: [
      {
        school: 'Pune Institute of Computer Technology',
        degree: 'B.E. in Information Technology (CGPA: 9.1/10)',
        startDate: '2016-08',
        endDate: '2020-06',
      },
      {
        school: 'Fergusson College, Pune',
        degree: 'HSC – Science (91.2%)',
        startDate: '2014-06',
        endDate: '2016-03',
      },
    ],
    skills: [
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'Tailwind CSS',
      'GraphQL',
      'Docker',
      'AWS (S3, Lambda, EC2)',
      'Git & GitHub Actions',
    ],
    projects: [
      {
        name: 'DevKanban',
        url: 'https://devkanban.vercel.app',
        startDate: '2023-02',
        endDate: '2023-05',
        description:
          'A real-time Kanban board for developer teams built with Next.js 14, Socket.io, and MongoDB. Features drag-and-drop task management, live collaboration cursors, and GitHub issue sync. Serves 500+ active users.',
      },
      {
        name: 'SnapReceipt',
        url: 'https://github.com/priyasharma/snapreceipt',
        startDate: '2022-08',
        endDate: '2022-11',
        description:
          'An expense tracking app that uses OCR to scan receipts and auto-categorize expenses. Built with React Native, Tesseract.js, and Firebase. Published on Google Play Store with 2,000+ downloads.',
      },
      {
        name: 'Portfolio Generator',
        url: 'https://github.com/priyasharma/portgen',
        startDate: '2021-04',
        endDate: '2021-06',
        description:
          'An open-source CLI tool that generates beautiful developer portfolio websites from a YAML config file. Supports 6 themes, automatic deployment to Vercel, and SEO optimization out of the box.',
      },
    ],
    achievements: [
      {
        title: 'Razorpay Hackathon Winner – Best Developer Tool',
        date: '2023-03',
        description:
          'Won first place at the internal Razorpay hackathon for building an AI-powered API documentation generator that reduced documentation time by 70%.',
      },
      {
        title: 'Top 100 – Google Summer of Code Mentor',
        date: '2022-09',
        description:
          'Selected as a mentor for the OWASP organization in GSoC 2022, guiding a student contributor through building a security testing plugin for VS Code.',
      },
    ],
    certifications: [
      {
        name: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta (Coursera)',
        date: '2022-02',
      },
      {
        name: 'MongoDB Certified Developer Associate',
        issuer: 'MongoDB University',
        date: '2021-11',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
      { language: 'Marathi', proficiency: 'Native' },
    ],
  },

  // ───────────────────────── 3. Data Analyst ─────────────────────────
  {
    settings: { template: 'classic', color: 'teal', font: 'sans' },
    personalInfo: {
      fullName: 'Kavitha Rajan',
      jobTitle: 'Senior Data Analyst',
      email: 'kavitha.rajan@outlook.com',
      phone: '+91 99887 76655',
      location: 'Hyderabad, India',
      linkedin: 'linkedin.com/in/kavitharajan',
      photo: '',
    },
    summary:
      'Detail-oriented Data Analyst with 4+ years of experience transforming complex datasets into actionable business insights for Fortune 500 clients. Expert in SQL, Python, and Tableau with a proven track record of building automated reporting pipelines that save 20+ hours per week. Adept at translating technical findings into executive-level presentations.',
    experience: [
      {
        company: 'Deloitte',
        position: 'Senior Data Analyst',
        startDate: '2022-04',
        endDate: 'Present',
        description:
          'Lead data analytics for a ₹200Cr revenue optimization project for a major telecom client, identifying ₹15Cr in annual cost savings through churn prediction modeling. Built automated ETL pipelines using Python and Airflow, reducing manual reporting effort by 80%. Created interactive Tableau dashboards tracking 45+ KPIs for C-suite stakeholders.',
      },
      {
        company: 'Mu Sigma',
        position: 'Data Analyst',
        startDate: '2020-08',
        endDate: '2022-03',
        description:
          'Performed customer segmentation analysis for a leading FMCG brand using K-means clustering, enabling targeted marketing campaigns that improved conversion rates by 18%. Developed A/B testing frameworks for pricing experiments across 3 product lines. Delivered weekly analytical reports to cross-functional teams of 25+ members.',
      },
      {
        company: 'Tata Consultancy Services',
        position: 'Junior Data Analyst',
        startDate: '2019-07',
        endDate: '2020-07',
        description:
          'Analyzed sales and inventory data for a retail client, building forecast models that improved demand prediction accuracy by 22%. Cleaned and standardized datasets containing 5M+ records using Python and pandas. Automated 12 recurring Excel reports using VBA macros and Python scripts.',
      },
    ],
    education: [
      {
        school: 'Indian Statistical Institute, Kolkata',
        degree: 'M.Stat in Applied Statistics',
        startDate: '2017-07',
        endDate: '2019-05',
      },
      {
        school: 'Stella Maris College, Chennai',
        degree: 'B.Sc. in Mathematics (Gold Medalist)',
        startDate: '2014-06',
        endDate: '2017-04',
      },
    ],
    skills: [
      'SQL (Advanced)',
      'Python (pandas, NumPy, scikit-learn)',
      'Tableau',
      'Power BI',
      'Apache Airflow',
      'Excel & VBA',
      'R Programming',
      'Statistical Modeling',
      'A/B Testing',
      'Google BigQuery',
      'Data Storytelling',
    ],
    projects: [
      {
        name: 'Customer Lifetime Value Predictor',
        url: '',
        startDate: '2023-01',
        endDate: '2023-04',
        description:
          'Built a CLV prediction model using XGBoost and historical transaction data of 2M+ customers. Achieved an R² score of 0.87, enabling the marketing team to allocate ad spend 30% more efficiently. Deployed as a Streamlit dashboard for non-technical stakeholders.',
      },
      {
        name: 'COVID-19 Impact Dashboard',
        url: 'https://github.com/kavitharajan/covid-dashboard',
        startDate: '2020-04',
        endDate: '2020-06',
        description:
          'Developed an interactive Tableau dashboard tracking COVID-19\'s impact on supply chain logistics across 8 Indian states. Used publicly available government datasets and automated daily data refreshes. Featured in Analytics India Magazine.',
      },
      {
        name: 'Automated Financial Report Generator',
        url: '',
        startDate: '2021-06',
        endDate: '2021-09',
        description:
          'Created a Python-based automated report generation system that pulls data from SAP, performs variance analysis, and produces formatted PDF reports. Reduced monthly close reporting time from 5 days to 8 hours for the finance team.',
      },
    ],
    achievements: [
      {
        title: 'Deloitte Applause Award – Analytics Innovation',
        date: '2023-06',
        description:
          'Recognized for developing a novel churn prediction framework that was adopted as a reusable asset across 4 telecom engagements, generating ₹2Cr in additional project revenue.',
      },
      {
        title: 'Gold Medal – B.Sc. Mathematics',
        date: '2017-04',
        description:
          'Graduated top of class with a CGPA of 9.8/10 from Stella Maris College, receiving the Chancellor\'s Gold Medal for academic excellence.',
      },
    ],
    certifications: [
      {
        name: 'Google Data Analytics Professional Certificate',
        issuer: 'Google (Coursera)',
        date: '2021-03',
      },
      {
        name: 'Tableau Desktop Specialist',
        issuer: 'Tableau (Salesforce)',
        date: '2020-11',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Tamil', proficiency: 'Native' },
      { language: 'Hindi', proficiency: 'Conversational' },
    ],
  },

  // ───────────────────────── 4. UI/UX Designer ─────────────────────────
  {
    settings: { template: 'classic', color: 'purple', font: 'sans' },
    personalInfo: {
      fullName: 'Rohan Kapoor',
      jobTitle: 'Senior UI/UX Designer',
      email: 'rohan.kapoor.design@gmail.com',
      phone: '+91 98321 45678',
      location: 'Mumbai, India',
      linkedin: 'linkedin.com/in/rohankapoorux',
      photo: '',
    },
    summary:
      'Creative UI/UX Designer with 3+ years of experience crafting intuitive digital experiences at leading design agencies. Specializes in design systems, user research, and interaction design for mobile and web platforms. Combines data-driven insights with aesthetic sensibility to deliver products that users love.',
    experience: [
      {
        company: 'Lollypop Design Studio',
        position: 'Senior UI/UX Designer',
        startDate: '2022-09',
        endDate: 'Present',
        description:
          'Lead designer for 6 client projects spanning fintech, healthtech, and edtech verticals, overseeing end-to-end design from discovery to handoff. Built a reusable design system with 200+ components in Figma, reducing design-to-development time by 40%. Conducted 50+ user interviews and usability tests, achieving an average SUS score of 82 across delivered products.',
      },
      {
        company: 'Thoughtspot',
        position: 'Product Designer',
        startDate: '2021-03',
        endDate: '2022-08',
        description:
          'Redesigned the analytics search experience, increasing feature adoption by 35% and reducing average task completion time by 28%. Created high-fidelity prototypes and conducted A/B tests on 3 onboarding flow variations. Collaborated closely with engineering teams to ensure pixel-perfect implementation of design specifications.',
      },
      {
        company: 'Freelance',
        position: 'UI/UX Designer',
        startDate: '2020-06',
        endDate: '2021-02',
        description:
          'Designed mobile apps and websites for 8 clients across e-commerce, food delivery, and social networking domains. Created brand identity packages including logos, color palettes, and typography systems. Delivered interactive Figma prototypes with detailed annotation for developer handoff.',
      },
    ],
    education: [
      {
        school: 'National Institute of Design, Ahmedabad',
        degree: 'M.Des in New Media Design',
        startDate: '2018-07',
        endDate: '2020-05',
      },
      {
        school: 'Sir J.J. Institute of Applied Art, Mumbai',
        degree: 'BFA in Applied Art',
        startDate: '2014-06',
        endDate: '2018-04',
      },
    ],
    skills: [
      'Figma',
      'Adobe Creative Suite',
      'Sketch',
      'Prototyping & Wireframing',
      'Design Systems',
      'User Research',
      'Usability Testing',
      'Information Architecture',
      'Interaction Design',
      'HTML & CSS',
      'Framer',
      'Miro',
    ],
    projects: [
      {
        name: 'FinFlow – Banking App Redesign',
        url: 'https://behance.net/rohankapoor/finflow',
        startDate: '2023-03',
        endDate: '2023-07',
        description:
          'Led the complete UX redesign of a digital banking app for a leading Indian private bank. Conducted contextual inquiry with 30 users, created journey maps, and redesigned 42 screens. Post-launch NPS improved from 32 to 58.',
      },
      {
        name: 'MedEase – Telemedicine Platform',
        url: 'https://behance.net/rohankapoor/medease',
        startDate: '2022-01',
        endDate: '2022-05',
        description:
          'Designed a telemedicine platform enabling rural patients to consult doctors via video call. Created an accessibility-first design supporting low-literacy users with voice guidance and vernacular language support. Won the iF Design Award 2022 Student Category.',
      },
      {
        name: 'Flavour – Food Discovery App',
        url: 'https://dribbble.com/rohankapoor/flavour',
        startDate: '2021-05',
        endDate: '2021-08',
        description:
          'Designed a food discovery app concept with AI-powered restaurant recommendations based on taste preferences and dietary restrictions. Created 28 unique screens with micro-interactions and Lottie animations. Featured on Dribbble\'s "Popular" page with 4,500+ likes.',
      },
    ],
    achievements: [
      {
        title: 'iF Design Award – Student Category',
        date: '2022-06',
        description:
          'Won the prestigious iF Design Award for the MedEase telemedicine platform concept, competing against 4,800 entries from 56 countries.',
      },
      {
        title: 'Adobe Design Achievement Awards – Semifinalist',
        date: '2020-10',
        description:
          'Selected as a semifinalist for the M.Des thesis project on inclusive design patterns for elderly users in digital banking.',
      },
    ],
    certifications: [
      {
        name: 'Google UX Design Professional Certificate',
        issuer: 'Google (Coursera)',
        date: '2021-06',
      },
      {
        name: 'Interaction Design Foundation – UX Management',
        issuer: 'Interaction Design Foundation',
        date: '2022-03',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
      { language: 'Gujarati', proficiency: 'Conversational' },
    ],
  },

  // ───────────────────────── 5. Mechanical Engineer ─────────────────────────
  {
    settings: { template: 'classic', color: 'slate', font: 'sans' },
    personalInfo: {
      fullName: 'Vikram Deshmukh',
      jobTitle: 'Senior Mechanical Engineer',
      email: 'vikram.deshmukh@gmail.com',
      phone: '+91 94567 89012',
      location: 'Chennai, India',
      linkedin: 'linkedin.com/in/vikramdeshmukh',
      photo: '',
    },
    summary:
      'Results-driven Mechanical Engineer with 6+ years of experience in product design, manufacturing process optimization, and quality assurance in the automotive and heavy machinery sectors. Proficient in CAD/CAM tools and FEA simulations with a track record of reducing production costs by 18% while maintaining Six Sigma quality standards.',
    experience: [
      {
        company: 'Tata Motors',
        position: 'Senior Mechanical Engineer',
        startDate: '2022-01',
        endDate: 'Present',
        description:
          'Lead the powertrain design team for the next-generation commercial vehicle platform, managing a ₹45Cr development budget. Optimized engine mounting systems using ANSYS FEA simulations, reducing NVH levels by 12 dB. Implemented DFMEA processes that decreased warranty claims by 25% across 3 product lines.',
      },
      {
        company: 'Mahindra & Mahindra',
        position: 'Mechanical Engineer',
        startDate: '2019-06',
        endDate: '2021-12',
        description:
          'Designed and validated suspension components for the XUV700 platform using CATIA V5 and HyperMesh. Conducted physical testing and correlation studies, achieving 95% simulation-to-test accuracy. Led a Kaizen initiative on the assembly line that improved throughput by 15% without additional capital expenditure.',
      },
      {
        company: 'Bosch India',
        position: 'Graduate Engineer Trainee',
        startDate: '2017-07',
        endDate: '2019-05',
        description:
          'Supported manufacturing process development for diesel fuel injection systems. Programmed CNC machines and designed jigs & fixtures for new product introductions. Contributed to a process improvement project that reduced scrap rate from 3.2% to 1.1%.',
      },
    ],
    education: [
      {
        school: 'College of Engineering, Pune',
        degree: 'B.E. in Mechanical Engineering (First Class with Distinction)',
        startDate: '2013-07',
        endDate: '2017-05',
      },
      {
        school: 'IIT Madras (Online)',
        degree: 'PG Diploma in Automotive Engineering',
        startDate: '2020-01',
        endDate: '2021-06',
      },
      {
        school: 'Kendriya Vidyalaya, Pune',
        degree: 'CBSE Class XII – Science (92.8%)',
        startDate: '2011-04',
        endDate: '2013-03',
      },
    ],
    skills: [
      'CATIA V5',
      'SolidWorks',
      'ANSYS (Structural & Thermal)',
      'AutoCAD',
      'GD&T',
      'Six Sigma (Green Belt)',
      'DFMEA/PFMEA',
      'CNC Programming',
      'Lean Manufacturing',
      'MATLAB',
      'SAP PLM',
      'Project Management',
    ],
    projects: [
      {
        name: 'Lightweight Chassis Frame Design',
        url: '',
        startDate: '2022-06',
        endDate: '2023-02',
        description:
          'Redesigned the ladder-frame chassis for a 16-ton commercial vehicle using high-strength steel and topology optimization in ANSYS. Achieved 8% weight reduction while maintaining structural rigidity, resulting in improved fuel efficiency by 3.5%.',
      },
      {
        name: 'Automated Quality Inspection System',
        url: '',
        startDate: '2020-09',
        endDate: '2021-03',
        description:
          'Developed a machine vision-based automated inspection system for detecting surface defects in machined components. Used OpenCV and a Raspberry Pi to classify defects with 97% accuracy, replacing manual inspection for 2 production lines.',
      },
      {
        name: 'Solar-Powered Water Purifier (Capstone)',
        url: '',
        startDate: '2016-08',
        endDate: '2017-04',
        description:
          'Designed and fabricated a portable solar-powered water purification system for rural communities as a final-year capstone project. The unit produces 50 liters of clean water per day at a material cost of ₹3,500. Won Best Project Award at the university expo.',
      },
    ],
    achievements: [
      {
        title: 'Tata Innovista Award – Silver',
        date: '2023-04',
        description:
          'Recognized for the lightweight chassis innovation that became a standard design practice for the commercial vehicle division, projected to save ₹8Cr annually in material costs.',
      },
      {
        title: 'Six Sigma Green Belt Certification & Project',
        date: '2020-06',
        description:
          'Completed a Six Sigma project at Mahindra reducing weld defect rate by 40% on the body shop line, achieving estimated annual savings of ₹1.2Cr.',
      },
    ],
    certifications: [
      {
        name: 'Certified Six Sigma Green Belt',
        issuer: 'American Society for Quality (ASQ)',
        date: '2020-06',
      },
      {
        name: 'CATIA V5 Mechanical Design Expert',
        issuer: 'Dassault Systèmes',
        date: '2019-03',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
      { language: 'Marathi', proficiency: 'Native' },
    ],
  },

  // ───────────────────────── 6. Civil Engineer ─────────────────────────
  {
    settings: { template: 'classic', color: 'amber', font: 'sans' },
    personalInfo: {
      fullName: 'Sneha Krishnan',
      jobTitle: 'Senior Civil Engineer',
      email: 'sneha.krishnan@gmail.com',
      phone: '+91 90123 45678',
      location: 'Kochi, India',
      linkedin: 'linkedin.com/in/snehakrishnan',
      photo: '',
    },
    summary:
      'Experienced Civil Engineer with 5+ years in structural design, project management, and construction supervision for commercial and infrastructure projects. Proficient in STAAD.Pro, ETABS, and AutoCAD with a strong background in RCC and steel design conforming to IS codes. Skilled at managing multi-crore projects from concept to completion.',
    experience: [
      {
        company: 'Larsen & Toubro Construction',
        position: 'Senior Civil Engineer',
        startDate: '2022-03',
        endDate: 'Present',
        description:
          'Managing structural design and site execution for a ₹180Cr metro rail station project in Kochi. Coordinating with 4 subcontractors and a 60-member site team to ensure on-time delivery within quality standards. Implemented BIM workflows using Revit that reduced design clashes by 55% during the coordination phase.',
      },
      {
        company: 'Shapoorji Pallonji Group',
        position: 'Site Engineer',
        startDate: '2020-01',
        endDate: '2022-02',
        description:
          'Supervised construction of a 24-floor residential tower in Bengaluru, managing daily activities of 120 workers. Conducted quality checks for RCC work, ensuring compliance with IS 456:2000 standards. Reduced material wastage by 12% through improved inventory management and pour planning.',
      },
      {
        company: 'Mott MacDonald',
        position: 'Graduate Engineer',
        startDate: '2018-07',
        endDate: '2019-12',
        description:
          'Performed structural analysis and design for bridge and flyover projects using STAAD.Pro and ETABS. Prepared detailed engineering drawings and BOQ estimates for 3 highway infrastructure projects. Supported environmental impact assessments for a coastal highway expansion project.',
      },
    ],
    education: [
      {
        school: 'National Institute of Technology, Calicut',
        degree: 'B.Tech in Civil Engineering (CGPA: 8.7/10)',
        startDate: '2014-07',
        endDate: '2018-05',
      },
      {
        school: 'IIT Roorkee (Distance)',
        degree: 'M.Tech in Structural Engineering',
        startDate: '2020-07',
        endDate: '2022-06',
      },
      {
        school: 'Bhavan\'s Vidya Mandir, Kochi',
        degree: 'CBSE Class XII – Science (94.2%)',
        startDate: '2012-04',
        endDate: '2014-03',
      },
    ],
    skills: [
      'STAAD.Pro',
      'ETABS',
      'AutoCAD',
      'Revit (BIM)',
      'Primavera P6',
      'MS Project',
      'RCC & Steel Design',
      'IS Code Standards',
      'Quantity Surveying',
      'Site Supervision',
      'Geotechnical Analysis',
      'MATLAB',
    ],
    projects: [
      {
        name: 'Kochi Metro Phase II – Station Design',
        url: '',
        startDate: '2022-06',
        endDate: 'Present',
        description:
          'Leading the structural design of an elevated metro station with a 45m span roof truss system. Performed seismic analysis per IS 1893 and wind load analysis per IS 875 Part 3. Coordinated MEP integration using BIM to achieve zero-clash construction documents.',
      },
      {
        name: 'Bamboo Reinforced Concrete Research',
        url: '',
        startDate: '2017-01',
        endDate: '2018-04',
        description:
          'Conducted research on treated bamboo as a sustainable reinforcement alternative in low-cost housing construction. Tested 24 beam specimens and demonstrated that bamboo-reinforced beams achieved 65% of the flexural strength of conventional RCC at 20% of the cost. Published findings in the Indian Concrete Journal.',
      },
      {
        name: 'Residential Complex Foundation Design',
        url: '',
        startDate: '2020-04',
        endDate: '2020-09',
        description:
          'Designed pile foundations for a 24-story residential tower on marine clay using PLAXIS 2D. Optimized pile layout reducing the number of piles from 180 to 142 while maintaining a factor of safety of 2.5, saving ₹85L in foundation costs.',
      },
    ],
    achievements: [
      {
        title: 'L&T ECC Star Performer Award',
        date: '2023-09',
        description:
          'Awarded for implementing BIM-integrated project management that delivered the metro station foundation phase 3 weeks ahead of schedule, saving ₹1.5Cr in liquidated damages.',
      },
      {
        title: 'Published Research Paper – Indian Concrete Journal',
        date: '2018-08',
        description:
          'Published "Flexural Behavior of Bamboo Reinforced Concrete Beams" in the Indian Concrete Journal (Vol. 92, Issue 8), contributing to sustainable construction research.',
      },
    ],
    certifications: [
      {
        name: 'PMP – Project Management Professional',
        issuer: 'Project Management Institute (PMI)',
        date: '2022-09',
      },
      {
        name: 'Autodesk Certified Professional – Revit Structure',
        issuer: 'Autodesk',
        date: '2021-05',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Malayalam', proficiency: 'Native' },
      { language: 'Hindi', proficiency: 'Conversational' },
    ],
  },

  // ───────────────────────── 7. Marketing Executive ─────────────────────────
  {
    settings: { template: 'classic', color: 'rose', font: 'sans' },
    personalInfo: {
      fullName: 'Ananya Verma',
      jobTitle: 'Vice President of Marketing',
      email: 'ananya.verma@gmail.com',
      phone: '+91 88776 65544',
      location: 'Gurugram, India',
      linkedin: 'linkedin.com/in/ananyaverma',
      photo: '',
    },
    summary:
      'Strategic marketing leader with 7+ years of experience scaling SaaS and consumer tech brands from seed stage to market leadership. Expert in growth marketing, brand strategy, and data-driven campaign management with a proven record of driving 3× revenue growth. Passionate about building high-performing marketing teams and creating narratives that resonate.',
    experience: [
      {
        company: 'Notion',
        position: 'Vice President of Marketing – India',
        startDate: '2023-01',
        endDate: 'Present',
        description:
          'Spearheading Notion\'s India market expansion strategy, growing the user base from 2M to 8M in 18 months. Built and lead a 12-member marketing team across content, growth, and community functions. Launched the "Build with Notion" creator program, generating 5,000+ templates and driving 40% organic growth.',
      },
      {
        company: 'Freshworks',
        position: 'Senior Marketing Manager',
        startDate: '2020-04',
        endDate: '2022-12',
        description:
          'Managed a $2.5M annual marketing budget across paid acquisition, content, and event channels. Launched the "Freshworks for Startups" program, onboarding 3,000+ startup customers in the first year. Orchestrated the company\'s IPO marketing communications, including press strategy, investor presentations, and brand campaigns.',
      },
      {
        company: 'Zomato',
        position: 'Marketing Manager',
        startDate: '2018-06',
        endDate: '2020-03',
        description:
          'Led social media and influencer marketing for Zomato Gold, growing the subscriber base from 50K to 400K within 12 months. Conceived and executed viral campaigns including "Zomato Delivers" which garnered 15M impressions and became a top trending topic. Managed relationships with 200+ food influencers and content creators.',
      },
      {
        company: 'Ogilvy India',
        position: 'Account Executive',
        startDate: '2016-07',
        endDate: '2018-05',
        description:
          'Managed client accounts for 3 FMCG brands with combined annual ad spend of ₹30Cr. Developed integrated marketing campaigns spanning TV, digital, and print channels. Coordinated with creative, media, and production teams to deliver 15+ campaigns on schedule and within budget.',
      },
    ],
    education: [
      {
        school: 'MICA, Ahmedabad',
        degree: 'PGDM in Strategic Marketing',
        startDate: '2014-06',
        endDate: '2016-04',
      },
      {
        school: 'Lady Shri Ram College, Delhi',
        degree: 'B.A. (Hons.) in English Literature',
        startDate: '2011-07',
        endDate: '2014-05',
      },
    ],
    skills: [
      'Growth Marketing',
      'Brand Strategy',
      'Content Marketing',
      'SEO & SEM',
      'Google Analytics & GA4',
      'HubSpot',
      'Paid Advertising (Meta, Google)',
      'Marketing Automation',
      'Influencer Marketing',
      'Product Marketing',
      'Team Leadership',
      'Budget Management',
    ],
    projects: [
      {
        name: 'Build with Notion – Creator Program',
        url: 'https://notion.so/build',
        startDate: '2023-03',
        endDate: '2023-09',
        description:
          'Conceptualized and launched Notion\'s creator economy initiative in India, partnering with 200+ content creators to build and monetize Notion templates. Generated $500K in template marketplace revenue in the first 6 months and increased organic traffic by 120%.',
      },
      {
        name: 'Freshworks IPO Communications',
        url: '',
        startDate: '2021-06',
        endDate: '2021-09',
        description:
          'Led the marketing workstream for Freshworks\' NASDAQ IPO, India\'s first SaaS company to list on a US stock exchange. Managed PR outreach resulting in 350+ media mentions across Bloomberg, TechCrunch, and Economic Times. Produced the IPO brand film viewed 2M+ times.',
      },
      {
        name: 'Zomato Gold Growth Campaign',
        url: '',
        startDate: '2019-01',
        endDate: '2019-06',
        description:
          'Designed a referral-driven growth campaign for Zomato Gold using tiered incentives and gamification mechanics. Achieved 8× viral coefficient with 65% of new subscribers coming through referrals. Campaign was featured as a case study at the Indian Marketing Summit 2019.',
      },
    ],
    achievements: [
      {
        title: 'Economic Times 40 Under 40 – Marketing',
        date: '2023-11',
        description:
          'Recognized in the Economic Times "40 Under 40" list for marketing leadership, specifically for scaling Notion\'s India presence to 8M users within 18 months.',
      },
      {
        title: 'Effie Award – Gold (Digital Marketing)',
        date: '2019-12',
        description:
          'Won the Gold Effie Award for the "Zomato Delivers" campaign in the Digital Marketing category, demonstrating measurable impact on subscriber growth and brand awareness.',
      },
    ],
    certifications: [
      {
        name: 'Google Digital Marketing & E-commerce Certificate',
        issuer: 'Google (Coursera)',
        date: '2022-05',
      },
      {
        name: 'HubSpot Inbound Marketing Certification',
        issuer: 'HubSpot Academy',
        date: '2020-08',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
      { language: 'French', proficiency: 'Intermediate' },
    ],
  },

  // ───────────────────────── 8. Human Resources Manager ─────────────────────────
  {
    settings: { template: 'classic', color: 'emerald', font: 'sans' },
    personalInfo: {
      fullName: 'Deepak Nair',
      jobTitle: 'Senior HR Manager',
      email: 'deepak.nair.hr@gmail.com',
      phone: '+91 97654 12345',
      location: 'Chennai, India',
      linkedin: 'linkedin.com/in/deepaknairhr',
      photo: '',
    },
    summary:
      'Seasoned Human Resources professional with 8+ years of experience leading talent acquisition, employee engagement, and organizational development at large enterprises. Expert in building scalable HR processes, driving DEI initiatives, and managing employee lifecycle across geographically distributed teams of 2,000+ employees. SHRM-SCP certified.',
    experience: [
      {
        company: 'Infosys',
        position: 'Senior HR Manager – Technology Division',
        startDate: '2021-04',
        endDate: 'Present',
        description:
          'Manage HR operations for a 2,500-employee technology division across 4 locations. Reduced annual attrition from 24% to 16% by implementing a career pathing framework and internal mobility program. Led the rollout of Workday HCM across the division, training 45 HR business partners and achieving 98% data migration accuracy.',
      },
      {
        company: 'Wipro',
        position: 'HR Business Partner',
        startDate: '2018-07',
        endDate: '2021-03',
        description:
          'Served as HRBP for the cloud and infrastructure services unit with 1,200 employees. Designed and executed a competency-based performance management system that improved manager-employee feedback cycles by 60%. Led campus recruitment drives across 25 engineering colleges, hiring 400+ graduates annually with a 90% offer acceptance rate.',
      },
      {
        company: 'Cognizant',
        position: 'HR Executive',
        startDate: '2015-08',
        endDate: '2018-06',
        description:
          'Managed end-to-end recruitment for technology roles, filling 150+ positions annually with an average time-to-hire of 28 days. Organized employee engagement programs including hackathons, wellness weeks, and town halls reaching 3,000+ employees. Administered payroll and benefits for a 500-member team using SAP SuccessFactors.',
      },
    ],
    education: [
      {
        school: 'Xavier Labour Relations Institute (XLRI), Jamshedpur',
        degree: 'MBA in Human Resource Management',
        startDate: '2013-06',
        endDate: '2015-04',
      },
      {
        school: 'Loyola College, Chennai',
        degree: 'B.A. in Sociology (First Class)',
        startDate: '2010-06',
        endDate: '2013-04',
      },
    ],
    skills: [
      'Talent Acquisition',
      'Employee Engagement',
      'Performance Management',
      'Workday HCM',
      'SAP SuccessFactors',
      'Compensation & Benefits',
      'Labour Law Compliance',
      'Diversity & Inclusion',
      'Organizational Development',
      'Change Management',
      'HRIS Administration',
      'Employer Branding',
    ],
    projects: [
      {
        name: 'Infosys Internal Mobility Platform',
        url: '',
        startDate: '2022-01',
        endDate: '2022-08',
        description:
          'Designed and launched an internal job marketplace platform enabling employees to explore cross-functional opportunities. Facilitated 350+ internal transfers in the first year, reducing external hiring costs by ₹4.5Cr and improving employee retention by 8 percentage points.',
      },
      {
        name: 'DEI Dashboard & Strategy',
        url: '',
        startDate: '2021-06',
        endDate: '2022-01',
        description:
          'Built a comprehensive DEI analytics dashboard tracking gender ratio, pay equity, promotion rates, and accessibility metrics across the technology division. Developed a 3-year DEI roadmap that increased women in leadership roles from 18% to 27%.',
      },
      {
        name: 'Campus Recruitment Automation',
        url: '',
        startDate: '2019-09',
        endDate: '2020-03',
        description:
          'Automated the campus recruitment pipeline using custom-built tools integrating with LinkedIn Recruiter and Mettl assessment platform. Reduced time-to-offer from 45 days to 12 days and improved candidate experience scores by 35%.',
      },
    ],
    achievements: [
      {
        title: 'Infosys Excellence Award – HR Innovation',
        date: '2022-12',
        description:
          'Awarded for the Internal Mobility Platform that was adopted organization-wide, impacting 250,000+ employees and becoming a key retention strategy highlighted in the annual investor report.',
      },
      {
        title: 'NHRD Best HR Practice Award',
        date: '2020-02',
        description:
          'Received the National HRD Network award for the competency-based performance management system designed at Wipro, recognized as a best practice in the IT services industry.',
      },
    ],
    certifications: [
      {
        name: 'SHRM Senior Certified Professional (SHRM-SCP)',
        issuer: 'Society for Human Resource Management',
        date: '2021-09',
      },
      {
        name: 'Certified Compensation Professional (CCP)',
        issuer: 'WorldatWork',
        date: '2019-11',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Tamil', proficiency: 'Native' },
      { language: 'Hindi', proficiency: 'Fluent' },
    ],
  },

  // ───────────────────────── 9. MBA Graduate ─────────────────────────
  {
    settings: { template: 'classic', color: 'cyan', font: 'sans' },
    personalInfo: {
      fullName: 'Ishaan Gupta',
      jobTitle: 'MBA Graduate – Strategy & Consulting',
      email: 'ishaan.gupta.iima@gmail.com',
      phone: '+91 95432 10987',
      location: 'Ahmedabad, India',
      linkedin: 'linkedin.com/in/ishaangupta-iima',
      photo: '',
    },
    summary:
      'Recent MBA graduate from IIM Ahmedabad with a specialization in Strategy and Consulting. Brings 2 years of pre-MBA experience in business analytics and 3 rigorous internships spanning management consulting, venture capital, and product strategy. Strong analytical thinker with exceptional communication and stakeholder management skills.',
    experience: [
      {
        company: 'McKinsey & Company',
        position: 'Summer Associate',
        startDate: '2025-04',
        endDate: '2025-07',
        description:
          'Worked on a growth strategy engagement for a leading Indian pharmaceutical company expanding into Southeast Asian markets. Conducted market sizing for 4 therapeutic areas, interviewed 15 KOLs, and developed a go-to-market playbook. Recommended a phased entry strategy projected to generate $120M in revenue over 5 years. Received a pre-placement offer.',
      },
      {
        company: 'Blume Ventures',
        position: 'Venture Capital Intern',
        startDate: '2024-11',
        endDate: '2025-01',
        description:
          'Evaluated 20+ startup deal flow opportunities in the B2B SaaS and fintech verticals. Built financial models and competitive landscape analyses for 5 shortlisted companies. Authored an investment memo for a Series A deal that was approved by the investment committee for a $3M investment.',
      },
      {
        company: 'Fractal Analytics',
        position: 'Business Analyst',
        startDate: '2022-07',
        endDate: '2024-06',
        description:
          'Delivered analytics solutions for Fortune 500 clients in the CPG and retail sectors. Built customer segmentation models that improved targeted marketing ROI by 25% for a global beverage company. Led a team of 3 analysts and managed client relationships with VP-level stakeholders.',
      },
    ],
    education: [
      {
        school: 'Indian Institute of Management, Ahmedabad',
        degree: 'MBA (PGP) – Strategy & Consulting (Top 10%)',
        startDate: '2024-06',
        endDate: '2026-04',
      },
      {
        school: 'BITS Pilani',
        degree: 'B.E. in Electronics & Communication (CGPA: 8.9/10)',
        startDate: '2018-08',
        endDate: '2022-05',
      },
      {
        school: 'St. Columba\'s School, Delhi',
        degree: 'CBSE Class XII – Science (95.6%)',
        startDate: '2016-04',
        endDate: '2018-03',
      },
    ],
    skills: [
      'Strategy Consulting',
      'Market Sizing & Entry',
      'Financial Modeling',
      'Competitive Analysis',
      'Stakeholder Management',
      'Python & SQL',
      'Tableau',
      'Advanced Excel',
      'Case Problem Solving',
      'Presentation Design',
      'Business Writing',
    ],
    projects: [
      {
        name: 'India EV Charging Infrastructure – Strategy Study',
        url: '',
        startDate: '2025-01',
        endDate: '2025-04',
        description:
          'Led a 5-member team in a live consulting project for Tata Power, analyzing the viability of a nationwide EV charging network. Conducted 30+ stakeholder interviews, analyzed unit economics for 3 business models, and presented a phased rollout plan to the Tata Power executive team. Recommended a franchise-hybrid model projected to achieve breakeven in 3.5 years.',
      },
      {
        name: 'Fintech for Bharat – B-Plan Competition Winner',
        url: '',
        startDate: '2024-09',
        endDate: '2024-11',
        description:
          'Developed a business plan for a vernacular-first digital lending platform targeting Tier 3-4 cities. Conducted primary research with 200+ respondents, built a 5-year financial model, and designed a go-to-market strategy. Won first place at the IIM Ahmedabad annual business plan competition with ₹5L prize money.',
      },
      {
        name: 'Customer Churn Prediction – CPG Analytics',
        url: '',
        startDate: '2023-03',
        endDate: '2023-06',
        description:
          'Built a gradient boosting model predicting customer churn for a global beverage brand with 85% accuracy. Identified key churn drivers through SHAP analysis and recommended 3 targeted retention interventions estimated to save $2M annually in customer lifetime value.',
      },
    ],
    achievements: [
      {
        title: 'IIM Ahmedabad – Dean\'s Merit List',
        date: '2025-04',
        description:
          'Consistently ranked in the top 10% of the PGP batch across 4 terms, earning a place on the Dean\'s Merit List for academic excellence.',
      },
      {
        title: 'CAT – 99.7 Percentile',
        date: '2023-12',
        description:
          'Scored 99.7 percentile in the Common Admission Test (CAT) 2023, securing admission to IIM Ahmedabad, Bangalore, and Calcutta.',
      },
    ],
    certifications: [
      {
        name: 'CFA Level I – Passed',
        issuer: 'CFA Institute',
        date: '2024-02',
      },
      {
        name: 'McKinsey Forward Program',
        issuer: 'McKinsey & Company',
        date: '2025-06',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Elementary' },
    ],
  },

  // ───────────────────────── 10. Fresher / College Student ─────────────────────────
  {
    settings: { template: 'classic', color: 'violet', font: 'sans' },
    personalInfo: {
      fullName: 'Riya Patel',
      jobTitle: 'Computer Science Graduate',
      email: 'riya.patel.cs@gmail.com',
      phone: '+91 91234 56789',
      location: 'Ahmedabad, India',
      linkedin: 'linkedin.com/in/riyapatelcs',
      photo: '',
    },
    summary:
      'Enthusiastic Computer Science graduate from NIT Surat with a strong foundation in data structures, algorithms, and full-stack web development. Completed 3 significant academic and personal projects demonstrating proficiency in React, Python, and cloud technologies. Actively seeking entry-level software engineering roles to apply academic knowledge in a fast-paced team environment.',
    experience: [
      {
        company: 'Amazon',
        position: 'Software Development Intern',
        startDate: '2025-05',
        endDate: '2025-07',
        description:
          'Interned with the Amazon Pay team, developing a transaction reconciliation microservice using Java and AWS Lambda that automated manual verification of 10,000+ daily transactions. Wrote 95% unit test coverage and participated in code reviews with senior engineers. Received a return offer for a full-time position.',
      },
      {
        company: 'Google Developer Student Club – NIT Surat',
        position: 'Technical Lead',
        startDate: '2024-08',
        endDate: '2025-04',
        description:
          'Led a team of 15 student developers organizing workshops, hackathons, and coding bootcamps for 500+ students. Conducted 8 technical sessions on web development, Git, and open-source contribution. Coordinated the annual "Solution Challenge" event with participation from 12 colleges.',
      },
      {
        company: 'CodeNation (Startup)',
        position: 'Frontend Development Intern',
        startDate: '2024-05',
        endDate: '2024-07',
        description:
          'Built interactive coding challenge interfaces using React and Monaco Editor for the online competitive programming platform. Implemented real-time code execution feedback using WebSocket connections. Improved page load performance by 40% through lazy loading and asset optimization.',
      },
    ],
    education: [
      {
        school: 'National Institute of Technology, Surat',
        degree: 'B.Tech in Computer Science & Engineering (CGPA: 8.6/10)',
        startDate: '2022-07',
        endDate: '2026-05',
      },
      {
        school: 'Delhi Public School, Ahmedabad',
        degree: 'CBSE Class XII – Science (94.8%)',
        startDate: '2020-04',
        endDate: '2022-03',
      },
      {
        school: 'Delhi Public School, Ahmedabad',
        degree: 'CBSE Class X (97.2%)',
        startDate: '2018-04',
        endDate: '2020-03',
      },
    ],
    skills: [
      'JavaScript',
      'React',
      'Python',
      'Java',
      'C++',
      'Node.js',
      'MongoDB',
      'MySQL',
      'Git & GitHub',
      'AWS (Lambda, S3)',
      'Data Structures & Algorithms',
      'REST APIs',
    ],
    projects: [
      {
        name: 'StudySync – Collaborative Learning Platform',
        url: 'https://github.com/riyapatel/studysync',
        startDate: '2025-01',
        endDate: '2025-04',
        description:
          'Built a full-stack collaborative study platform using React, Node.js, and MongoDB where students can create study rooms, share notes, and take real-time quizzes together. Implemented WebRTC-based video calling and Socket.io for live collaboration. Currently used by 200+ students at NIT Surat.',
      },
      {
        name: 'PlantDoc – AI Plant Disease Detector',
        url: 'https://github.com/riyapatel/plantdoc',
        startDate: '2024-08',
        endDate: '2024-11',
        description:
          'Developed a mobile-responsive web app that identifies plant diseases from leaf images using a TensorFlow CNN model trained on 15,000+ images. Achieved 92% classification accuracy across 38 disease categories. Built the frontend with React and the API with Flask, deployed on Google Cloud Run.',
      },
      {
        name: 'ExpenseTracker CLI',
        url: 'https://github.com/riyapatel/expense-cli',
        startDate: '2023-10',
        endDate: '2023-12',
        description:
          'Created a command-line expense tracking tool in Python with SQLite storage, supporting budget alerts, category-wise analytics, and CSV export. Wrote comprehensive documentation and published the package on PyPI with 300+ downloads.',
      },
    ],
    achievements: [
      {
        title: 'Smart India Hackathon 2024 – Winner',
        date: '2024-12',
        description:
          'Won the Smart India Hackathon (Grand Finale) for building an AI-powered grievance redressal system for the Ministry of Education. Led a 6-member team through 36 hours of continuous development, competing against 50,000+ participants nationwide.',
      },
      {
        title: 'LeetCode – Knight Badge (Top 5%)',
        date: '2025-03',
        description:
          'Solved 800+ problems on LeetCode with a contest rating of 1,950+, earning the Knight badge. Consistently ranked in the top 5% globally in weekly contests.',
      },
    ],
    certifications: [
      {
        name: 'AWS Cloud Practitioner',
        issuer: 'Amazon Web Services',
        date: '2024-09',
      },
      {
        name: 'Meta React Developer Certificate',
        issuer: 'Meta (Coursera)',
        date: '2024-03',
      },
    ],
    languages: [
      { language: 'English', proficiency: 'Fluent' },
      { language: 'Hindi', proficiency: 'Native' },
      { language: 'Gujarati', proficiency: 'Native' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
//  Professions list – used for dropdowns, filters, etc.
// ─────────────────────────────────────────────────────────────

export const professionsList = [
  'Software Engineer',
  'Full Stack Developer',
  'Data Analyst',
  'UI/UX Designer',
  'Mechanical Engineer',
  'Civil Engineer',
  'Marketing Executive',
  'Human Resources Manager',
  'MBA Graduate',
  'Fresher / College Student',
];

// ─────────────────────────────────────────────────────────────
//  Utility – look up a sample resume by profession keyword
// ─────────────────────────────────────────────────────────────

/**
 * Returns the first sample resume whose `personalInfo.jobTitle`
 * or matching `professionsList` entry contains the given keyword
 * (case-insensitive). Returns `null` if no match is found.
 *
 * @param {string} profession – e.g. "software", "data analyst", "fresher"
 * @returns {object|null}
 */
export function getSampleByProfession(profession) {
  if (!profession) return null;

  const query = profession.toLowerCase().trim();

  // First try an exact match against the professions list
  const exactIndex = professionsList.findIndex(
    (p) => p.toLowerCase() === query
  );
  if (exactIndex !== -1) return { ...sampleResumes[exactIndex] };

  // Then try a partial / fuzzy match
  const partialIndex = professionsList.findIndex((p) =>
    p.toLowerCase().includes(query)
  );
  if (partialIndex !== -1) return { ...sampleResumes[partialIndex] };

  // Finally try matching against the job title in personal info
  const titleMatch = sampleResumes.find((r) =>
    r.personalInfo.jobTitle.toLowerCase().includes(query)
  );
  if (titleMatch) return { ...titleMatch };

  return null;
}

/**
 * Returns a copy of a sample resume with the settings.template
 * value overridden to the requested templateId.
 *
 * @param {string} templateId
 * @returns {object}
 */
export function getSampleForTemplate(templateId) {
  // Use Software Engineer as the default showcase sample
  const baseSample = JSON.parse(JSON.stringify(sampleResumes[0]));
  baseSample.settings.template = templateId;
  return baseSample;
}
