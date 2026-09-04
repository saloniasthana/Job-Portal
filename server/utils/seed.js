import 'dotenv/config';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Company from '../models/Company.js';

const demoRecruiters = [
  {
    name: 'Ananya Rao',
    email: 'ananya@technova.dev',
    company: { name: 'TechNova', website: 'https://technova.dev' },
    companyMeta: { industry: 'Software / SaaS', location: 'Bengaluru, India' },
  },
  {
    name: 'Rahul Mehta',
    email: 'rahul@cloudifylabs.io',
    company: { name: 'Cloudify Labs', website: 'https://cloudifylabs.io' },
    companyMeta: { industry: 'Cloud Infrastructure', location: 'Hyderabad, India' },
  },
];

const jobPool = [
  {
    title: 'Frontend Engineer (React)',
    description:
      'We are looking for a Frontend Engineer to build fast, accessible interfaces for our core product. You will work closely with design and backend teams to ship features end-to-end.\n\nResponsibilities:\n- Build reusable React components and hooks\n- Optimize performance for large data-heavy views\n- Collaborate with design on a component library\n\nRequirements:\n- 2+ years with React and modern JS\n- Comfortable with REST APIs and state management\n- Eye for detail on UI/UX',
    skills: ['React', 'JavaScript', 'Tailwind CSS', 'REST APIs'],
    category: 'Frontend Developer',
    location: 'Bengaluru, India',
    workMode: 'hybrid',
    jobType: 'full-time',
    salaryMin: 800000,
    salaryMax: 1400000,
  },
  {
    title: 'Backend Engineer (Node.js)',
    description:
      'Join our platform team building the services that power millions of requests a day. You will own services from design through production.\n\nResponsibilities:\n- Design and build REST/GraphQL APIs\n- Own data models and query performance\n- Write tests and maintain CI pipelines\n\nRequirements:\n- Strong Node.js and MongoDB/SQL experience\n- Understanding of auth, caching, and queues\n- Bonus: experience with Docker/Kubernetes',
    skills: ['Node.js', 'Express', 'MongoDB', 'Docker'],
    category: 'Backend Developer',
    location: 'Remote',
    workMode: 'remote',
    jobType: 'full-time',
    salaryMin: 1000000,
    salaryMax: 1800000,
  },
  {
    title: 'Full-Stack Developer (MERN)',
    description:
      'We need a generalist who can move fast across the stack, from database schema to polished UI, for an early-stage product team.\n\nResponsibilities:\n- Ship features across React frontend and Node backend\n- Participate in product and design discussions\n- Maintain code quality and testing standards\n\nRequirements:\n- Solid MongoDB, Express, React, Node experience\n- Comfortable working with ambiguity in a small team',
    skills: ['MongoDB', 'Express', 'React', 'Node.js'],
    category: 'Full Stack Developer',
    location: 'Pune, India',
    workMode: 'onsite',
    jobType: 'full-time',
    salaryMin: 700000,
    salaryMax: 1200000,
  },
  {
    title: 'UI/UX Designer',
    description:
      'Design intuitive, modern experiences for our web and mobile products. You will partner closely with engineering to ship pixel-perfect interfaces.\n\nResponsibilities:\n- Own end-to-end design for new features\n- Maintain and evolve our design system\n- Run lightweight user research\n\nRequirements:\n- Strong portfolio in product design\n- Proficiency in Figma\n- Experience designing for web apps',
    skills: ['Figma', 'Design Systems', 'Prototyping'],
    category: 'UI/UX Design',
    location: 'Remote',
    workMode: 'remote',
    jobType: 'contract',
    salaryMin: 500000,
    salaryMax: 900000,
  },
  {
    title: 'DevOps Engineer',
    description:
      'Help us scale our infrastructure as we grow. You will own CI/CD, observability, and cloud infrastructure across environments.\n\nResponsibilities:\n- Build and maintain CI/CD pipelines\n- Manage cloud infrastructure as code\n- Improve monitoring and incident response\n\nRequirements:\n- Experience with AWS/GCP, Docker, Kubernetes\n- Comfortable with Terraform or similar IaC tools',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    category: 'DevOps',
    location: 'Hyderabad, India',
    workMode: 'hybrid',
    jobType: 'full-time',
    salaryMin: 1200000,
    salaryMax: 2000000,
  },
  {
    title: 'Product Analyst Intern',
    description:
      'Support the product team with data analysis, dashboards, and experiment tracking. Great opportunity to learn how a fast-moving product team operates.\n\nResponsibilities:\n- Build dashboards to track key metrics\n- Analyze feature experiments\n- Assist with user research synthesis\n\nRequirements:\n- Comfortable with SQL and spreadsheets\n- Currently pursuing or recently completed a degree',
    skills: ['SQL', 'Excel', 'Data Analysis'],
    category: 'Data Science',
    location: 'Remote',
    workMode: 'remote',
    jobType: 'internship',
    salaryMin: 25000,
    salaryMax: 40000,
  },
  {
    title: 'Product Manager',
    description:
      'Drive product strategy and execution for a core product area, working closely with engineering, design, and go-to-market teams.\n\nResponsibilities:\n- Own the roadmap for your product area\n- Write specs and prioritize the backlog\n- Partner with design and engineering through delivery\n\nRequirements:\n- 2+ years in product management\n- Strong communication and prioritization skills',
    skills: ['Product Strategy', 'Roadmapping', 'Analytics'],
    category: 'Product Management',
    location: 'Bengaluru, India',
    workMode: 'hybrid',
    jobType: 'full-time',
    salaryMin: 1500000,
    salaryMax: 2500000,
  },
  {
    title: 'QA Engineer',
    description:
      'Own quality across our web platform, building automated test coverage and partnering with engineering to keep releases reliable.\n\nResponsibilities:\n- Build and maintain automated test suites\n- Triage and track bugs to resolution\n- Improve release confidence with CI-integrated testing\n\nRequirements:\n- Experience with Playwright/Cypress or similar\n- Comfortable reading and writing JavaScript',
    skills: ['Playwright', 'JavaScript', 'CI/CD'],
    category: 'QA / Testing',
    location: 'Chennai, India',
    workMode: 'onsite',
    jobType: 'full-time',
    salaryMin: 600000,
    salaryMax: 1000000,
  },
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function upsertCompanyFor(recruiter, companyInfo, meta = {}) {
  if (!companyInfo?.name) return null;
  let company = await Company.findOne({ recruiter: recruiter._id, name: companyInfo.name });
  if (!company) {
    company = await Company.create({
      recruiter: recruiter._id,
      name: companyInfo.name,
      website: companyInfo.website || '',
      logoUrl: companyInfo.logoUrl || '',
      ...meta,
    });
    console.log(`Created company: ${companyInfo.name} (for ${recruiter.email})`);
  }
  return company;
}

async function upsertRecruiter({ name, email, company }) {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      password: 'password123',
      role: 'recruiter',
      isVerified: true,
      company,
    });
    console.log(`Created demo recruiter: ${email} (password: password123)`);
  }
  return user;
}

async function seedJobsFor(recruiter, company, count) {
  const existing = await Job.countDocuments({ recruiter: recruiter._id });
  if (existing > 0) {
    console.log(`Skipping ${recruiter.email} — already has ${existing} job(s)`);
    return 0;
  }

  const jobs = Array.from({ length: count }, () => {
    const template = rand(jobPool);
    return {
      ...template,
      recruiter: recruiter._id,
      company: company?._id || null,
      views: Math.floor(Math.random() * 120),
    };
  });

  await Job.insertMany(jobs);
  console.log(`Seeded ${jobs.length} job(s) for ${recruiter.email}`);
  return jobs.length;
}

async function run() {
  await connectDB();

  for (const demo of demoRecruiters) {
    const user = await upsertRecruiter(demo);
    const company = await upsertCompanyFor(user, demo.company, demo.companyMeta);
    await seedJobsFor(user, company, 4);
  }

  const otherRecruiters = await User.find({
    role: 'recruiter',
    email: { $nin: demoRecruiters.map((d) => d.email) },
  });
  for (const recruiter of otherRecruiters) {
    const company = await upsertCompanyFor(recruiter, recruiter.company);
    await seedJobsFor(recruiter, company, 4);
  }

  console.log('Seeding complete.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
