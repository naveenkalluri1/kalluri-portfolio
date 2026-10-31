export const profile = {
  name: "NaveenKumar Kalluri",
  roles: [
    "Enterprise Integration Engineer",
    "Banner ERP & Ethos API Specialist",
    "REST API & Integration Developer",
    "Full-Stack Developer",
  ],
  tagline:
    "I build real-time, resilient integrations that connect higher-education ERPs with the cloud — cutting manual work by 80%.",
  location: "Bangalore, India",
  photo: "photo.jpg", // put your photo at public/photo.jpg
  email: "naveenkumarkalluri341@gmail.com",
  phone: "+91-7032101914",
  links: {
    linkedin: "https://www.linkedin.com/in/naveenkumar-kalluri-3b7709224/",
    github: "https://github.com/naveenkalluri1?tab=repositories",
    leetcode: "https://leetcode.com/u/NaveenKumar_Kalluri/",
  },
};

export const stats = [
  { value: 80, suffix: "%", label: "Manual corrections reduced" },
  { value: 40, suffix: "%", label: "Faster DB login workflow" },
  { value: 100, suffix: "+", label: "Mock interviews conducted" },
  { value: 8.65, suffix: "", label: "B.Tech GPA / 10", decimals: 2 },
];

export const experience = [
  {
    company: "Ellucian",
    role: "Associate Consultant",
    type: "Full-time",
    period: "Jan 2025 — Present",
    place: "Bangalore",
    points: [
      "Building enterprise integrations for higher-ed using Banner ERP, Ethos APIs, REST APIs and cloud services.",
      "Designed a real-time inventory integration with Banner ERP, eliminating manual file-based processes.",
      "Built a mobile barcode-scanning solution with Ellucian Experience Custom Card for real-time asset updates.",
      "Integrated the Fixed Assets Ethos API and enabled asset transfers via Banner business APIs.",
      "Added real-time validation, logging, error handling and alerting — reducing manual corrections by 80%.",
      "Created an AWS S3 audit-logging pipeline for daily scan logs, supporting audit & compliance reporting.",
    ],
    tags: ["Banner ERP", "Ethos API", "AWS S3", "REST"],
  },
  {
    company: "Practo Technologies",
    role: "Platform Engineer Intern",
    type: "Internship",
    period: "Jul 2024 — Nov 2024",
    place: "Bangalore",
    points: [
      "Developed a secure .pgpass authentication workflow, improving database login efficiency by 40%.",
      "Streamlined database access management, improving performance and operational reliability.",
      "Managed Kubernetes CronJob pods to improve scalability and reduce downtime by 20%.",
    ],
    tags: ["PostgreSQL", "Kubernetes", "Linux"],
  },
];

export const projects = [
  {
    title: "Real-Time Inventory Integration",
    org: "Ellucian · Apr 2025 — Present",
    desc: "Mobile barcode scanning feeding Banner ERP in real time through Ethos & Banner APIs, with an AWS-backed audit trail. Improved inventory accuracy and audit readiness.",
    metrics: ["80% fewer manual fixes", "Real-time sync", "Audit-ready"],
    tags: ["Banner", "Ethos", "AWS Lambda", "S3", "API Gateway"],
    hue: 265,
  },
  {
    title: "Database Access Automation",
    org: "Practo · Jun — Aug 2024",
    desc: "Automated PostgreSQL authentication with .pgpass, auto-removal of inactive users (30–60 min) and Kubernetes CronJobs for maintenance, with robust failure handling.",
    metrics: ["40% faster logins", "15% less load", "20% less downtime"],
    tags: ["PostgreSQL", "Kubernetes", "Shell", "Python"],
    hue: 190,
    link: "https://github.com/naveenkalluri1/Database-Access-Automation",
  },
  {
    title: "Reinforcement Learning in Healthcare",
    org: "Academic · Feb — May 2024",
    desc: "RL model that optimizes treatment plans from patient conditions and history, with reward design balancing effectiveness, outcomes and cost, under full policy compliance.",
    metrics: ["10% lower cost", "15% better outcomes", "100% compliant"],
    tags: ["Python", "Reinforcement Learning", "Data Analysis"],
    hue: 330,
    link: "https://github.com/naveenkalluri1/Reinforcement-in-HealthCare",
  },
];

export const skills = {
  Languages: ["Java", "Python", "JavaScript", "SQL"],
  "Web": ["React.js", "Node.js", "Express.js", "REST APIs"],
  Databases: ["PostgreSQL", "MySQL", "SQLite", "MongoDB", "Redis"],
  "Cloud & DevOps": ["AWS", "Lambda", "API Gateway", "S3", "IAM", "Docker", "Git", "Linux"],
  "Integration & Tools": ["REST APIs", "JSON", "Postman", "Kubernetes", "CI/CD"],
};

export const achievements = [
  { icon: "HR", title: "HackerRank Java Gold", text: "Gold Badge and 5-Star rating in Java." },
  { icon: "MN", title: "100+ Mock Interviews", text: "Mentored peers via a community initiative." },
  { icon: "LD", title: "Delivery Leadership", text: "Led project activities across cross-functional teams on time." },
  { icon: "CE", title: "Agile Project Management", text: "Google — Coursera certification." },
];

export const education = {
  school: "SRM University, Andhra Pradesh",
  degree: "B.Tech in Computer Science (AI & ML)",
  period: "Apr 2020 — Apr 2024",
  gpa: "8.65 / 10",
};
