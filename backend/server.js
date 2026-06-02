import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
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

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

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
            description: 'A comprehensive, modern degree program designed to master front-end, back-end, and cloud engineering. Perfect for Sri Lankan A/L students looking to secure global IT jobs. Includes guaranteed industry placements in major Tech firms.',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60',
            category: 'IT & Software',
            duration: '4 Years',
            fee: 850000,
            learningOutcomes: [
              'Master Javascript/Typescript and Modern frameworks like React and Node.js',
              'Design scalable cloud architectures on AWS & Google Cloud Platform',
              'Implement robust Object Oriented designs and Advanced Data Structures',
              'Utilize modern DevOps pipelines (Docker, Kubernetes, GitHub Actions)',
              'Construct enterprise grade SQL & NoSQL MongoDB databases'
            ],
            instructor: {
              name: 'Prof. Janaka Perera',
              role: 'Head of Computer Science Dept',
              bio: 'Janaka has over 15 years of academic and industrial experience in software systems. Former Senior Tech Lead at Virtusa.',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
            },
            requirements: [
              '3 passes in G.C.E. A/L (Physical Science/Maths Stream or ICT)',
              'Credit pass in G.C.E. O/L Mathematics',
              'Basic familiarity with computers and web browsing'
            ],
            availableSeats: 45,
            startDate: new Date('2026-09-15')
          },
          {
            title: 'Advanced Diploma in Quantity Surveying (QS)',
            description: 'A premium, fully-accredited program designed to kickstart an international career in the construction and estimation industries of Middle East, UK, and Sri Lanka.',
            image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=60',
            category: 'Civil & Construction',
            duration: '1.5 Years',
            fee: 280000,
            learningOutcomes: [
              'Prepare detailed Bill of Quantities (BOQ) for large-scale civil projects',
              'Administer building and construction contracts (FIDIC & local forms)',
              'Conduct commercial cost estimation, feasibility reports, and budgeting',
              'Leverage AutoCAD and modern QS measurement softwares',
              'Understand contractor and client-side procurement pathways'
            ],
            instructor: {
              name: 'Eng. Dilhani Silva',
              role: 'Chartered Quantity Surveyor & Consultant',
              bio: 'Dilhani is a leading chartered QS in Colombo with 12+ years managing high-rise commercial project financials across the Gulf region.',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
            },
            requirements: [
              '3 passes in G.C.E. A/L in physical science/maths or engineering technology',
              'Strong quantitative and analytical skills',
              'Passing score in O/L English'
            ],
            availableSeats: 30,
            startDate: new Date('2026-10-01')
          },
          {
            title: 'BSc (Hons) in Nursing & Healthcare Science',
            description: 'Earn a degree with high international demand. Hands-on medical training and private hospital internship opportunities included. Suitable for students passionate about medical sciences and healthcare services.',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop&q=60',
            category: 'Health & Medicine',
            duration: '3 Years',
            fee: 620000,
            learningOutcomes: [
              'Understand comprehensive human anatomy, physiology, and pathology',
              'Perform advanced clinical nursing techniques and patient assessments',
              'Administer medications correctly with knowledge of pharmacology',
              'Deliver emergency trauma support, ICU aid, and first response care',
              'Understand ethical healthcare protocols and modern patient communication'
            ],
            instructor: {
              name: 'Dr. Kumara Wickramasinghe',
              role: 'Consultant Medical Director',
              bio: 'Dr. Kumara has 20+ years of clinical service in national general hospitals and is a passionate advocate for modern nursing pedagogy.',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80'
            },
            requirements: [
              '3 passes in G.C.E. A/L Biosystems stream or Biological Science',
              'Minimum passes in G.C.E. O/L English and Chemistry',
              'Empathic disposition and interest in patient care'
            ],
            availableSeats: 25,
            startDate: new Date('2026-11-10')
          },
          {
            title: 'Higher National Diploma (HND) in Business Management',
            description: 'A dynamic course that bridges the gap between G.C.E. A/L and professional management. Ideal for students aspiring to build startups or secure leading administrative roles in banking, marketing, and corporate sectors.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60',
            category: 'Business & Management',
            duration: '2 Years',
            fee: 340000,
            learningOutcomes: [
              'Design strategic marketing briefs and digital engagement campaigns',
              'Interpret company balance sheets, cashflow forecasts, and accounting models',
              'Implement recruitment structures and manage employee relations',
              'Draft robust business proposals, investor pitches, and expansion models',
              'Master public speaking, team management, and leadership dynamics'
            ],
            instructor: {
              name: 'Mrs. Ruwanthi Jayasinghe',
              role: 'Ex-Director of HR & MBA Lecturer',
              bio: 'Ruwanthi is a recognized executive coach with deep ties in the corporate sector. Former Lead Strategist at Dialog Axiata PLC.',
              image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
            },
            requirements: [
              '3 passes in G.C.E. A/L in Commerce stream (or equivalent)',
              'Credit pass in G.C.E. O/L English',
              'Active leadership initiative in sports or clubs is a plus'
            ],
            availableSeats: 50,
            startDate: new Date('2026-09-28')
          },
          {
            title: 'Diploma in Data Science & Artificial Intelligence',
            description: 'Data is the new oil. Learn to analyze corporate data, predict markets, and design smart machine learning bots. Includes custom generative AI engineering modules using Python.',
            image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&auto=format&fit=crop&q=60',
            category: 'IT & Software',
            duration: '1 Year',
            fee: 450000,
            learningOutcomes: [
              'Write production standard Python scripts for data manipulation',
              'Train Machine Learning algorithms using Scikit-Learn and XGBoost',
              'Build predictive pipelines and interactive dashboard reports (PowerBI)',
              'Query databases using highly complex SQL & aggregations in MongoDB',
              'Understand neural networks and fine-tune large language models (LLMs)'
            ],
            instructor: {
              name: 'Dr. Asela Gunawardena',
              role: 'Senior Data Scientist',
              bio: 'Asela earned his PhD in ML from the University of Melbourne. Has engineered automated trading tools for global finance houses.',
              image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80'
            },
            requirements: [
              'Completed G.C.E. A/L in any stream',
              'High grade (A/B) in G.C.E. O/L Mathematics',
              'Curiosity for analytical problem-solving and coding'
            ],
            availableSeats: 35,
            startDate: new Date('2026-10-20')
          },
          {
            title: 'Professional Certificate in Digital Marketing & E-Commerce',
            description: 'A practical, 100% hands-on certificate course targeting Sri Lankan students looking to start freelancing, run drop-shipping operations, or become social media managers.',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60',
            category: 'Business & Management',
            duration: '6 Months',
            fee: 120000,
            learningOutcomes: [
              'Optimize web pages to rank #1 on Google using SEO best practices',
              'Create and track Facebook, Google, and TikTok ad campaigns',
              'Master professional brand-building strategies and content calendars',
              'Draft highly persuasive copy and automate email sales funnels',
              'Set up Shopify stores and manage global payment gateways'
            ],
            instructor: {
              name: 'Mr. Samantha Alwis',
              role: 'Founder of BrandBoost Agency',
              bio: 'Samantha is a prominent Growth Hacker in Colombo who has successfully scaled 50+ local brands to international export levels.',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
            },
            requirements: [
              'Completed G.C.E. A/L or G.C.E. O/L',
              'Strong enthusiasm for digital trends and creative design',
              'Conversational English skills'
            ],
            availableSeats: 40,
            startDate: new Date('2026-09-10')
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
