export const tabs = [
  {
    title: 'Home',
    url: '/',
    icon: '/side-home-Icon.svg'
  },
  {
    title: 'Jobs',
    url: '#',
    icon: '/side-job-Icon.svg'
  },
  {
    title: 'Candidates',
    url: '/candidates/1',
    icon: '/side-candidate-Icon.svg'
  },
  {
    title: 'Reports',
    url: '#',
    icon: '/side-report-Icon.svg'
  },
  {
    title: 'Calendar',
    url: '#',
    icon: '/side-calendar-Icon.svg'
  },
]

export const candidateFiles = [
  { name: 'Cover_letter.pdf', icon: "pdf.png" },
  { name: 'My_resume.docx', icon: "word.png" },
  { name: 'Oct_payslip.pdf', icon: "pdf.png" },
  { name: 'Oct_payslip.pdf', icon: "pdf.png" }
];

export const candidateQualifications = [
  ['Qualifications and skills match', true],
  ['Experience Relevance', true],
  ['Education', true],
  ['Keywords Match', false],
  ['Years of Experience', true],
  ['Job Hopping', false],
  ['Cultural Fit', true],
  ['Interview Performance', true],
  ['References', false],
  ['Additional Factors', true],
];

export const candidateExperience = [
  {
    title: 'Data Analyst',
    company: 'Insightful Analytics Ltd.',
    period: 'Jan 2019 – Apr 2021',
    responsibilities: [
      'Performed data mining and statistical analysis to support business objectives and improve operational efficiency.',
      'Automated data collection and reporting processes using Python scripts, reducing manual effort by 40%.',
      'Collaborated with cross-functional teams to define KPIs and deliver actionable insights through interactive dashboards.',
    ],
  },
  {
    title: 'Junior Data Analyst',
    company: 'Tech Solutions Inc.',
    period: 'Jun 2017 – Dec 2018',
    responsibilities: [
      'Assisted in data collection, cleaning, and preprocessing tasks to prepare datasets for analysis.',
      'Conducted exploratory data analysis (EDA) to identify trends and patterns in data.',
      'Supported senior analysts in creating reports and visualizations to communicate findings to stakeholders.',
    ],
  }
]