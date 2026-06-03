import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import contactRequestRoutes from './routes/contactRequestRoutes.js';

// Models for Auto Seed
import User from './models/User.js';
import Course from './models/Course.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact-requests', contactRequestRoutes);

// Base route for API Health
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Future Path API is healthy and running.' });
});

// Auto Seed check function
const runAutoSeed = async () => {
  try {
    const courseCount = await Course.countDocuments();
    const adminExists = await User.findOne({ email: 'malinda@gmail.com' });

    if (courseCount === 0 || !adminExists) {
      console.log('Database lacks initial data or admin. Seeding now...');
      
      // Let's create admin if not exists
      if (!adminExists) {
        await User.create({
          name: 'Malinda',
          email: 'malinda@gmail.com',
          password: 'malinda@12345',
          role: 'admin',
        });
        console.log('Seeded Admin account Malinda (malinda@gmail.com)');
      }

      // Seed default courses if course count is 0
      if (courseCount === 0) {
        const defaultCourses = [
          {
            title: 'BSc (Hons) in Software Engineering',
            description: 'A comprehensive program to master front-end, back-end, and cloud engineering for Sri Lankan A/L students.',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
            category: 'IT & Software',
            duration: '4 Years',
            level: 'Advanced',
            fee: 850000,
            organization: 'Future Path Institute',
            website: 'https://futurepath.example.com',
            contactNumber: '+94 77 123 4567',
            email: 'info@futurepath.example.com',
            schedule: 'Mon, Wed, Fri • 8:30 AM - 12:30 PM',
            location: 'Colombo Campus',
            startDate: new Date('2026-09-15'),
            endDate: new Date('2030-06-15'),
            status: 'Active',
            learningOutcomes: [
              'Master Javascript/Typescript and React',
              'Build scalable Node.js APIs',
              'Deploy apps on AWS and Azure',
              'Design secure database schemas',
              'Implement CI/CD workflows'
            ],
            requirements: [
              '3 passes in A/L Science or ICT',
              'Credit pass in O/L Mathematics',
              'Basic computer literacy'
            ],
            totalSeats: 45,
            availableSeats: 45,
            instructor: {
              name: 'Prof. Janaka Perera',
              role: 'Head of Computer Science Dept',
              email: 'janaka.perera@futurepath.example.com',
              phone: '+94 77 987 6543',
              bio: 'Janaka has over 15 years of experience in software engineering education and industry training.',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
            },
          },
          {
            title: 'Advanced Diploma in Quantity Surveying (QS)',
            description: 'A premium program for students who want to enter civil construction and project estimation careers across Sri Lanka and abroad.',
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=60',
            category: 'Civil & Construction',
            duration: '1.5 Years',
            level: 'Intermediate',
            fee: 280000,
            organization: 'Sri Lanka Technical Institute',
            website: 'https://slti.example.com',
            contactNumber: '+94 77 233 9987',
            email: 'qs@slti.example.com',
            schedule: 'Tue, Thu • 9:00 AM - 1:00 PM',
            location: 'Kandy Campus',
            startDate: new Date('2026-10-01'),
            endDate: new Date('2028-03-30'),
            status: 'Active',
            learningOutcomes: [
              'Prepare Bill of Quantities',
              'Manage FIDIC contracts',
              'Perform commercial cost estimation',
              'Use AutoCAD and industry software',
              'Review procurement and tendering'
            ],
            requirements: [
              '3 passes in A/L Physical Science or Maths',
              'Credit pass in O/L English',
              'Strong numerical ability'
            ],
            totalSeats: 30,
            availableSeats: 30,
            instructor: {
              name: 'Eng. Dilhani Silva',
              role: 'Chartered Quantity Surveyor & Consultant',
              email: 'dilhani.silva@slti.example.com',
              phone: '+94 77 444 1122',
              bio: 'Dilhani is a chartered quantity surveyor with extensive Gulf and local project experience.',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
            },
          },
          {
            title: 'BSc (Hons) in Nursing & Healthcare Science',
            description: 'A clinically-focused nursing degree with hospital internship pathways for students interested in healthcare careers.',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60',
            category: 'Health & Medicine',
            duration: '3 Years',
            level: 'Advanced',
            fee: 620000,
            organization: 'Sri Lanka Health Academy',
            website: 'https://slha.example.com',
            contactNumber: '+94 77 555 8899',
            email: 'admissions@slha.example.com',
            schedule: 'Mon to Fri • 8:00 AM - 2:00 PM',
            location: 'Galle Road Campus',
            startDate: new Date('2026-11-10'),
            endDate: new Date('2029-10-10'),
            status: 'Active',
            learningOutcomes: [
              'Apply clinical nursing techniques',
              'Assess and monitor patients',
              'Administer medications safely',
              'Support emergency care',
              'Practice healthcare ethics'
            ],
            requirements: [
              '3 passes in A/L Biological Science',
              'Credit pass in O/L English and Chemistry',
              'Compassionate approach to patient care'
            ],
            totalSeats: 25,
            availableSeats: 25,
            instructor: {
              name: 'Dr. Kumara Wickramasinghe',
              role: 'Consultant Medical Director',
              email: 'kumara.wickramasinghe@slha.example.com',
              phone: '+94 77 666 0033',
              bio: 'Dr. Kumara is an experienced healthcare educator and consultant with hospital leadership experience.',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
            },
          },
          {
            title: 'Higher National Diploma (HND) in Business Management',
            description: 'A practical business diploma designed to prepare students for management roles, entrepreneurship, and corporate administration.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
            category: 'Business & Management',
            duration: '2 Years',
            level: 'Intermediate',
            fee: 340000,
            organization: 'Future Path Institute',
            website: 'https://futurepath.example.com',
            contactNumber: '+94 77 123 4567',
            email: 'business@futurepath.example.com',
            schedule: 'Tue, Thu • 2:00 PM - 6:00 PM',
            location: 'Colombo Campus',
            startDate: new Date('2026-09-28'),
            endDate: new Date('2028-09-28'),
            status: 'Active',
            learningOutcomes: [
              'Create marketing plans',
              'Read financial statements',
              'Manage human resources',
              'Write business proposals',
              'Lead teams and projects'
            ],
            requirements: [
              '3 passes in A/L Commerce stream',
              'Credit pass in O/L English',
              'Strong communication skills'
            ],
            totalSeats: 50,
            availableSeats: 50,
            instructor: {
              name: 'Mrs. Ruwanthi Jayasinghe',
              role: 'Ex-Director of HR & MBA Lecturer',
              email: 'ruwanthi.jayasinghe@futurepath.example.com',
              phone: '+94 77 777 7788',
              bio: 'Ruwanthi is a business expert and former HR director who coaches students into management careers.',
              image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
            },
          },
          {
            title: 'Diploma in Data Science & Artificial Intelligence',
            description: 'A hands-on program teaching Python, machine learning, and applied AI for real-world data use cases.',
            image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop&q=60',
            category: 'IT & Software',
            duration: '1 Year',
            level: 'Intermediate',
            fee: 450000,
            organization: 'Sri Lanka Data Academy',
            website: 'https://sl-data.example.com',
            contactNumber: '+94 77 888 1122',
            email: 'data@sl-data.example.com',
            schedule: 'Mon, Wed, Fri • 4:00 PM - 7:00 PM',
            location: 'Colombo Campus',
            startDate: new Date('2026-10-20'),
            endDate: new Date('2027-10-20'),
            status: 'Active',
            learningOutcomes: [
              'Write production-grade Python code',
              'Train ML models with Scikit-Learn',
              'Build dashboards with PowerBI',
              'Query SQL and MongoDB databases',
              'Understand neural networks and AI workflows'
            ],
            requirements: [
              'Completed A/L in any stream',
              'Credit pass in O/L Mathematics',
              'Interest in data analytics'
            ],
            totalSeats: 35,
            availableSeats: 35,
            instructor: {
              name: 'Dr. Asela Gunawardena',
              role: 'Senior Data Scientist',
              email: 'asela.gunawardena@sl-data.example.com',
              phone: '+94 77 999 3344',
              bio: 'Asela is a senior data scientist and AI instructor with international research experience.',
              image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
            },
          },
          {
            title: 'Professional Certificate in Digital Marketing & E-Commerce',
            description: 'A 6-month practical certificate for students who want to launch digital marketing careers or freelance online businesses.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
            category: 'Business & Management',
            duration: '6 Months',
            level: 'Beginner',
            fee: 120000,
            organization: 'Future Path Institute',
            website: 'https://futurepath.example.com',
            contactNumber: '+94 77 123 4567',
            email: 'marketing@futurepath.example.com',
            schedule: 'Sat • 9:00 AM - 2:00 PM',
            location: 'Online + Colombo Campus',
            startDate: new Date('2026-09-10'),
            endDate: new Date('2027-03-10'),
            status: 'Active',
            learningOutcomes: [
              'Run Google and TikTok ads',
              'Build high-converting sales funnels',
              'Write persuasive copy for social media',
              'Optimize websites for SEO',
              'Launch Shopify and e-commerce stores'
            ],
            requirements: [
              'Completed A/L or O/L',
              'Basic English proficiency',
              'Creative mindset'
            ],
            totalSeats: 40,
            availableSeats: 40,
            instructor: {
              name: 'Mr. Samantha Alwis',
              role: 'Founder of BrandBoost Agency',
              email: 'samantha.alwis@futurepath.example.com',
              phone: '+94 77 111 2233',
              bio: 'Samantha is a growth marketing strategist with multiple successful ecommerce launches.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
            },
          }
        ];

        await Course.insertMany(defaultCourses);
        console.log('Seeded default course catalog successfully.');
      }
    } else {
      console.log('Database contains courses and admin. Skipping seed.');
    }
  } catch (error) {
    console.error(`Auto-seed failed: ${error.message}`);
  }
};

// Global error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  await runAutoSeed();
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Unhandled Rejection Error: ${err.message}`);
});
