const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Swipe = require('./models/Swipe');
const Match = require('./models/Match');
const Message = require('./models/Message');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Notification = require('./models/Notification');
const { hashPassword } = require('./utils/password');
const { calculateMatchScore } = require('./services/matchService');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/collabbridge';

const demoUsers = [
  {
    name: 'Alex Chen',
    email: 'alex@demo.com',
    password: 'demo123',
    bio: 'Full-stack developer passionate about building scalable web apps. Love React and Node.js. Looking for partners to build cool projects!',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'GraphQL', 'Docker'],
    interests: ['Web Development', 'Open Source', 'AI', 'Cloud Computing'],
    techStack: ['React', 'Express', 'MongoDB', 'AWS'],
    experienceLevel: 'Advanced',
    availability: 'Full-time',
    github: 'https://github.com/alexchen',
    linkedin: 'https://linkedin.com/in/alexchen',
    avatar: '',
  },
  {
    name: 'Sarah Miller',
    email: 'sarah@demo.com',
    password: 'demo123',
    bio: 'Data Science enthusiast and ML engineer. Currently exploring NLP and computer vision. Always up for a hackathon!',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'R', 'Jupyter'],
    interests: ['AI', 'Data Science', 'Machine Learning', 'Research'],
    techStack: ['Python', 'Flask', 'PostgreSQL', 'GCP'],
    experienceLevel: 'Intermediate',
    availability: 'Part-time',
    github: 'https://github.com/sarahmiller',
    linkedin: 'https://linkedin.com/in/sarahmiller',
    avatar: '',
  },
  {
    name: 'James Wilson',
    email: 'james@demo.com',
    password: 'demo123',
    bio: 'Mobile developer specializing in React Native and Flutter. Building the next great app, one pixel at a time.',
    skills: ['React Native', 'Flutter', 'JavaScript', 'Dart', 'Firebase', 'Swift'],
    interests: ['Mobile Development', 'UI/UX Design', 'Startups', 'Web Development'],
    techStack: ['React Native', 'Firebase', 'Node.js', 'Figma'],
    experienceLevel: 'Intermediate',
    availability: 'Full-time',
    github: 'https://github.com/jameswilson',
    linkedin: 'https://linkedin.com/in/jameswilson',
    avatar: '',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@demo.com',
    password: 'demo123',
    bio: 'Backend engineer with a love for microservices and distributed systems. Golang and Rust enthusiast. Open to mentoring beginners!',
    skills: ['Go', 'Rust', 'Python', 'Kubernetes', 'Docker', 'gRPC'],
    interests: ['Cloud Computing', 'DevOps', 'Open Source', 'System Design'],
    techStack: ['Go', 'Kubernetes', 'PostgreSQL', 'Redis'],
    experienceLevel: 'Advanced',
    availability: 'Part-time',
    github: 'https://github.com/priyasharma',
    linkedin: 'https://linkedin.com/in/priyasharma',
    avatar: '',
  },
  {
    name: 'Marcus Johnson',
    email: 'marcus@demo.com',
    password: 'demo123',
    bio: 'CS student exploring web development and cybersecurity. Eager to learn and contribute to meaningful projects.',
    skills: ['JavaScript', 'Python', 'HTML/CSS', 'React', 'Node.js'],
    interests: ['Web Development', 'Cybersecurity', 'Open Source', 'AI'],
    techStack: ['React', 'Express', 'MongoDB', 'Tailwind CSS'],
    experienceLevel: 'Beginner',
    availability: 'Part-time',
    github: 'https://github.com/marcusjohnson',
    linkedin: 'https://linkedin.com/in/marcusjohnson',
    avatar: '',
  },
  {
    name: 'Emily Zhang',
    email: 'emily@demo.com',
    password: 'demo123',
    bio: 'UI/UX Designer turned Frontend Developer. Creating beautiful and accessible web experiences. Figma + React = ❤️',
    skills: ['React', 'Figma', 'CSS', 'TypeScript', 'Tailwind CSS', 'Storybook'],
    interests: ['UI/UX Design', 'Web Development', 'Accessibility', 'Design Systems'],
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'Vercel'],
    experienceLevel: 'Intermediate',
    availability: 'Full-time',
    github: 'https://github.com/emilyzhang',
    linkedin: 'https://linkedin.com/in/emilyzhang',
    avatar: '',
  },
  {
    name: 'David Kim',
    email: 'david@demo.com',
    password: 'demo123',
    bio: 'Blockchain developer and Web3 enthusiast. Building decentralized applications that push boundaries. Smart contracts are my thing.',
    skills: ['Solidity', 'JavaScript', 'React', 'Ethereum', 'Node.js', 'Web3.js'],
    interests: ['Blockchain', 'Web3', 'DeFi', 'Startups'],
    techStack: ['React', 'Hardhat', 'IPFS', 'The Graph'],
    experienceLevel: 'Advanced',
    availability: 'Full-time',
    github: 'https://github.com/davidkim',
    linkedin: 'https://linkedin.com/in/davidkim',
    avatar: '',
  },
  {
    name: 'Sofia Rodriguez',
    email: 'sofia@demo.com',
    password: 'demo123',
    bio: 'Game developer and creative coder. Love Unity and Unreal Engine. Looking for artists and developers to jam with!',
    skills: ['C#', 'Unity', 'C++', 'Python', 'Blender', 'Shader Programming'],
    interests: ['Game Development', 'AR/VR', 'Creative Coding', 'AI'],
    techStack: ['Unity', 'C#', 'Blender', 'Git'],
    experienceLevel: 'Intermediate',
    availability: 'Part-time',
    github: 'https://github.com/sofiarodriguez',
    linkedin: 'https://linkedin.com/in/sofiarodriguez',
    avatar: '',
  },
  {
    name: 'Ryan Park',
    email: 'ryan@demo.com',
    password: 'demo123',
    bio: 'DevOps engineer automating everything. CI/CD pipelines, Infrastructure as Code, and Kubernetes are my daily drivers.',
    skills: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'Python', 'Bash'],
    interests: ['DevOps', 'Cloud Computing', 'Open Source', 'Automation'],
    techStack: ['AWS', 'Terraform', 'Jenkins', 'Prometheus'],
    experienceLevel: 'Advanced',
    availability: 'Part-time',
    github: 'https://github.com/ryanpark',
    linkedin: 'https://linkedin.com/in/ryanpark',
    avatar: '',
  },
  {
    name: 'Nina Patel',
    email: 'nina@demo.com',
    password: 'demo123',
    bio: 'Aspiring full-stack developer currently learning React and Node.js. Would love to collaborate and learn from experienced devs!',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Python', 'Git'],
    interests: ['Web Development', 'AI', 'Mobile Development', 'Open Source'],
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind CSS'],
    experienceLevel: 'Beginner',
    availability: 'Full-time',
    github: 'https://github.com/ninapatel',
    linkedin: 'https://linkedin.com/in/ninapatel',
    avatar: '',
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Swipe.deleteMany({}),
      Match.deleteMany({}),
      Message.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Create users
    console.log('👤 Creating demo users...');
    const createdUsers = [];
    for (const userData of demoUsers) {
      const hashedPw = await hashPassword(userData.password);
      const user = await User.create({
        ...userData,
        password: hashedPw,
      });
      createdUsers.push(user);
      console.log(`   ✓ Created: ${user.name} (${user.email})`);
    }

    // Create some swipes and matches
    console.log('💕 Creating sample matches...');
    const alex = createdUsers[0];   // Alex Chen
    const marcus = createdUsers[4]; // Marcus Johnson
    const nina = createdUsers[9];   // Nina Patel
    const emily = createdUsers[5];  // Emily Zhang
    const james = createdUsers[2];  // James Wilson

    // Alex <-> Marcus mutual match
    await Swipe.create({ swiper: alex._id, swiped: marcus._id, direction: 'right' });
    await Swipe.create({ swiper: marcus._id, swiped: alex._id, direction: 'right' });
    const { score: score1, commonSkills: cs1, commonInterests: ci1 } = calculateMatchScore(alex, marcus);
    const match1 = await Match.create({
      users: [alex._id, marcus._id],
      initiator: alex._id,
      matchScore: score1,
      commonSkills: cs1,
      commonInterests: ci1,
    });

    // Alex <-> Emily mutual match
    await Swipe.create({ swiper: alex._id, swiped: emily._id, direction: 'right' });
    await Swipe.create({ swiper: emily._id, swiped: alex._id, direction: 'right' });
    const { score: score2, commonSkills: cs2, commonInterests: ci2 } = calculateMatchScore(alex, emily);
    const match2 = await Match.create({
      users: [alex._id, emily._id],
      initiator: emily._id,
      matchScore: score2,
      commonSkills: cs2,
      commonInterests: ci2,
    });

    // Alex <-> Nina mutual match
    await Swipe.create({ swiper: alex._id, swiped: nina._id, direction: 'right' });
    await Swipe.create({ swiper: nina._id, swiped: alex._id, direction: 'right' });
    const { score: score3, commonSkills: cs3, commonInterests: ci3 } = calculateMatchScore(alex, nina);
    const match3 = await Match.create({
      users: [alex._id, nina._id],
      initiator: nina._id,
      matchScore: score3,
      commonSkills: cs3,
      commonInterests: ci3,
    });

    // Marcus <-> Nina mutual match
    await Swipe.create({ swiper: marcus._id, swiped: nina._id, direction: 'right' });
    await Swipe.create({ swiper: nina._id, swiped: marcus._id, direction: 'right' });
    const { score: score4, commonSkills: cs4, commonInterests: ci4 } = calculateMatchScore(marcus, nina);
    const match4 = await Match.create({
      users: [marcus._id, nina._id],
      initiator: marcus._id,
      matchScore: score4,
      commonSkills: cs4,
      commonInterests: ci4,
    });

    console.log(`   ✓ Created 4 matches`);

    // Create sample messages
    console.log('💬 Creating sample messages...');
    const sampleMessages = [
      { match: match1._id, sender: alex._id, content: 'Hey Marcus! I see we both love React and Node.js. Want to build something together?' },
      { match: match1._id, sender: marcus._id, content: 'Absolutely! I\'ve been wanting to build a project management tool. Are you up for it?' },
      { match: match1._id, sender: alex._id, content: 'That sounds awesome! Let me create a project board and we can plan it out.' },
      { match: match2._id, sender: emily._id, content: 'Hi Alex! Your profile looks great. I love the React + TypeScript combo.' },
      { match: match2._id, sender: alex._id, content: 'Thanks Emily! Your design portfolio is impressive. We should collaborate on a design system.' },
      { match: match3._id, sender: nina._id, content: 'Hi Alex! I\'m just starting out with React. Would you be open to mentoring me on a project?' },
      { match: match3._id, sender: alex._id, content: 'Of course Nina! Everyone starts somewhere. Let\'s build a simple app together!' },
    ];

    for (const msg of sampleMessages) {
      await Message.create(msg);
    }
    console.log(`   ✓ Created ${sampleMessages.length} messages`);

    // Create a sample project
    console.log('📋 Creating sample project...');
    const project = await Project.create({
      name: 'CollabBridge Enhancement',
      description: 'Building new features for the CollabBridge platform including AI recommendations and improved matching.',
      owner: alex._id,
      members: [alex._id, marcus._id],
      status: 'active',
    });

    // Create sample tasks
    const sampleTasks = [
      { project: project._id, title: 'Design matching algorithm v2', description: 'Improve the matching algorithm with ML-based recommendations', status: 'completed', priority: 'high', assignee: alex._id, order: 0 },
      { project: project._id, title: 'Implement real-time notifications', description: 'Add push notifications for new matches and messages', status: 'in_progress', priority: 'high', assignee: marcus._id, order: 0 },
      { project: project._id, title: 'Build profile verification system', description: 'Add GitHub/LinkedIn verification badges to profiles', status: 'in_progress', priority: 'medium', assignee: alex._id, order: 1 },
      { project: project._id, title: 'Add dark mode toggle', description: 'Implement theme switching with smooth transitions', status: 'todo', priority: 'medium', order: 0 },
      { project: project._id, title: 'Mobile app testing', description: 'Test all features on iOS and Android simulators', status: 'todo', priority: 'low', order: 1 },
      { project: project._id, title: 'Write API documentation', description: 'Document all REST endpoints with examples', status: 'todo', priority: 'medium', order: 2 },
    ];

    for (const task of sampleTasks) {
      await Task.create(task);
    }
    console.log(`   ✓ Created project with ${sampleTasks.length} tasks`);

    // Create sample notifications
    console.log('🔔 Creating sample notifications...');
    await Notification.create([
      { user: alex._id, type: 'match', title: 'New Match!', body: 'You matched with Marcus Johnson!', data: { matchId: match1._id } },
      { user: alex._id, type: 'match', title: 'New Match!', body: 'You matched with Emily Zhang!', data: { matchId: match2._id } },
      { user: alex._id, type: 'message', title: 'New Message', body: 'Nina sent you a message', data: { matchId: match3._id }, read: true },
    ]);
    console.log('   ✓ Created notifications');

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    demoUsers.forEach((u) => {
      console.log(`   📧 ${u.email.padEnd(20)} 🔑 ${u.password}`);
    });
    console.log('   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
