require("dotenv").config({ path: __dirname + "/../../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ConnectDB = require("../config/database");
const User = require("../models/user");
const ConnectionRequest = require("../models/connection");

const mockUsers = [
  {
    firstName: "Dev",
    lastName: "Builder",
    email: "dev@gmail.com",
    plainPassword: "dev@123",
    age: 26,
    gender: "male",
    about:
      "Full-stack engineer building scalable web products. Passionate about React, Node.js, and clean software architecture.",
    lookingFor: "Technical Co-founders & Collaborators",
    skills: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Redux"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Elon",
    lastName: "Musk",
    email: "elon@gmail.com",
    plainPassword: "elon@123",
    age: 52,
    gender: "male",
    about:
      "Engineering from first principles. Building reusable orbital rockets, electric vehicles, and high-bandwidth neural interfaces.",
    lookingFor: "Hardcore AI & Systems Engineers",
    skills: [
      "System Architecture",
      "Physics",
      "Autonomous Systems",
      "Product Strategy",
      "Manufacturing",
    ],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Sam",
    lastName: "Altman",
    email: "sam@gmail.com",
    plainPassword: "sam@123",
    age: 39,
    gender: "male",
    about:
      "Scaling compute and intelligence to benefit humanity. Curious about energy abundance, fusion, and general intelligence.",
    lookingFor: "AI Researchers & Infrastructure Architects",
    skills: ["AI Research", "Venture Capital", "Product Scaling", "Leadership"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Sarah",
    lastName: "Guo",
    email: "sarah@gmail.com",
    plainPassword: "sarah@123",
    age: 34,
    gender: "female",
    about:
      "Founder of Conviction. Early-stage investor backing technical founders building intelligent software. Previously partner at Greylock.",
    lookingFor: "Early-stage AI Founders",
    skills: [
      "Early Stage Investing",
      "AI Startups",
      "Go-To-Market",
      "Board Leadership",
    ],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Alex",
    lastName: "Morgan",
    email: "alex@gmail.com",
    plainPassword: "alex@123",
    age: 28,
    gender: "female",
    about:
      "Product designer crafting modern web interfaces, micro-interactions, and design systems that users genuinely love.",
    lookingFor: "Full-stack Developers for SaaS MVP",
    skills: [
      "UI/UX Design",
      "Figma",
      "Design Systems",
      "Tailwind CSS",
      "Motion Design",
    ],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya@gmail.com",
    plainPassword: "priya@123",
    age: 27,
    gender: "female",
    about:
      "Machine learning engineer working on open-source LLM fine-tuning, latency optimization, and distributed model serving.",
    lookingFor: "Open Source Collaborators",
    skills: ["Python", "PyTorch", "vLLM", "Docker", "Kubernetes", "LangChain"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Satya",
    lastName: "Nadella",
    email: "satya@gmail.com",
    plainPassword: "satya@123",
    age: 56,
    gender: "male",
    about:
      "Empowering every person and organization on the planet to achieve more. Cloud infrastructure, enterprise AI, and culture transformation.",
    lookingFor: "Enterprise Software Builders",
    skills: [
      "Cloud Computing",
      "Enterprise Tech",
      "Strategy",
      "Culture Transformation",
    ],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Linus",
    lastName: "Torvalds",
    email: "linus@gmail.com",
    plainPassword: "linus@123",
    age: 54,
    gender: "male",
    about:
      "Creator of Linux and Git. Interested in operating systems, kernel architecture, low-level optimization, and keeping code simple.",
    lookingFor: "Systems Programmers & Kernel Contributors",
    skills: [
      "C",
      "Linux Kernel",
      "Git",
      "Systems Programming",
      "Low-Level Optimization",
    ],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
  // ── Additional users for pagination testing ──
  {
    firstName: "Ada",
    lastName: "Lovelace",
    email: "ada@gmail.com",
    plainPassword: "ada@1234",
    age: 29,
    gender: "female",
    about:
      "Pioneering computational thinking. Building developer tools that make algorithmic reasoning more accessible to non-CS backgrounds.",
    lookingFor: "Developer Tools Co-founder",
    skills: ["Algorithms", "Compilers", "Rust", "TypeScript", "WASM"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "James",
    lastName: "Gosling",
    email: "james@gmail.com",
    plainPassword: "james@123",
    age: 68,
    gender: "male",
    about:
      "Creator of Java. Passionate about language design, virtual machines, and how programming languages shape how we think.",
    lookingFor: "Language Design Enthusiasts",
    skills: ["Java", "JVM", "Language Design", "Distributed Systems"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Grace",
    lastName: "Hopper",
    email: "grace@gmail.com",
    plainPassword: "grace@123",
    age: 35,
    gender: "female",
    about:
      "Debugging advocate and compiler nerd. Building static analysis tools that catch bugs before they ship.",
    lookingFor: "DevOps & Reliability Engineers",
    skills: ["Compilers", "Static Analysis", "Go", "CI/CD", "Observability"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Kai",
    lastName: "Chen",
    email: "kai@gmail.com",
    plainPassword: "kai@1234",
    age: 31,
    gender: "male",
    about:
      "Backend architect obsessed with event-driven microservices, message queues, and zero-downtime deployments.",
    lookingFor: "Backend Engineers for Fintech Startup",
    skills: ["Kafka", "Go", "PostgreSQL", "gRPC", "Terraform"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Mira",
    lastName: "Patel",
    email: "mira@gmail.com",
    plainPassword: "mira@123",
    age: 24,
    gender: "female",
    about:
      "Frontend engineer specializing in accessibility and performance. Building inclusive web experiences that load in under 2 seconds.",
    lookingFor: "Accessibility-first Startups",
    skills: ["React", "A11y", "Web Vitals", "CSS", "Storybook"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Raj",
    lastName: "Kumar",
    email: "raj@gmail.com",
    plainPassword: "raj@1234",
    age: 33,
    gender: "male",
    about:
      "Mobile engineer shipping cross-platform apps with Flutter and React Native. Previously built apps with 1M+ downloads.",
    lookingFor: "Mobile-first Product Founders",
    skills: ["Flutter", "React Native", "Firebase", "Swift", "Kotlin"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Elena",
    lastName: "Rossi",
    email: "elena@gmail.com",
    plainPassword: "elena@123",
    age: 30,
    gender: "female",
    about:
      "Data scientist bridging the gap between ML research and production. Expert at turning Jupyter notebooks into scalable pipelines.",
    lookingFor: "ML Platform Teams",
    skills: ["Python", "Spark", "MLflow", "SQL", "Airflow", "dbt"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus@gmail.com",
    plainPassword: "marcus@123",
    age: 37,
    gender: "male",
    about:
      "Security engineer and ethical hacker. Helping startups build secure-by-default infrastructure before they get breached.",
    lookingFor: "CTO or Security-conscious Founders",
    skills: ["Cybersecurity", "Penetration Testing", "AWS", "SOC2", "IAM"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Yuki",
    lastName: "Tanaka",
    email: "yuki@gmail.com",
    plainPassword: "yuki@123",
    age: 26,
    gender: "female",
    about:
      "Creative technologist blending generative art with web technologies. Building interactive installations and NFT platforms.",
    lookingFor: "Creative Tech Collaborators",
    skills: ["Three.js", "WebGL", "p5.js", "Solidity", "Blender"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Omar",
    lastName: "Hassan",
    email: "omar@gmail.com",
    plainPassword: "omar@123",
    age: 40,
    gender: "male",
    about:
      "DevOps and platform engineer. Building internal developer platforms that let teams ship 10x faster.",
    lookingFor: "Platform Engineering Roles",
    skills: ["Kubernetes", "ArgoCD", "Prometheus", "Helm", "Backstage"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Nina",
    lastName: "Fernandez",
    email: "nina@gmail.com",
    plainPassword: "nina@123",
    age: 29,
    gender: "female",
    about:
      "Growth engineer and product analyst. Using data to find and exploit growth loops in consumer products.",
    lookingFor: "Consumer App Founders",
    skills: ["Growth Hacking", "SQL", "Amplitude", "A/B Testing", "Python"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun@gmail.com",
    plainPassword: "arjun@123",
    age: 32,
    gender: "male",
    about:
      "Blockchain developer building decentralized identity solutions. Interested in zero-knowledge proofs and privacy-preserving computation.",
    lookingFor: "Web3 Co-founders",
    skills: ["Solidity", "ZK-proofs", "Rust", "Ethereum", "IPFS"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1495603889488-42d1d66e5523?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Sophie",
    lastName: "Laurent",
    email: "sophie@gmail.com",
    plainPassword: "sophie@123",
    age: 27,
    gender: "female",
    about:
      "Technical writer and developer advocate. Making complex APIs feel simple through documentation, tutorials, and community building.",
    lookingFor: "Developer Relations Teams",
    skills: ["Technical Writing", "API Design", "Community", "Video Content", "Markdown"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram@gmail.com",
    plainPassword: "vikram@123",
    age: 45,
    gender: "male",
    about:
      "Serial entrepreneur with 3 exits. Now mentoring first-time founders and investing in B2B SaaS at pre-seed stage.",
    lookingFor: "First-time Technical Founders",
    skills: ["Fundraising", "B2B SaaS", "Go-To-Market", "Team Building", "Strategy"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Zara",
    lastName: "Ali",
    email: "zara@gmail.com",
    plainPassword: "zara@123",
    age: 25,
    gender: "female",
    about:
      "iOS engineer crafting delightful SwiftUI experiences. Obsessed with smooth 60fps animations and haptic feedback design.",
    lookingFor: "Mobile Product Teams",
    skills: ["Swift", "SwiftUI", "UIKit", "Core Data", "Combine"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Leo",
    lastName: "Nakamura",
    email: "leo@gmail.com",
    plainPassword: "leo@1234",
    age: 34,
    gender: "male",
    about:
      "Game developer turned startup engineer. Building real-time multiplayer systems and low-latency networking solutions.",
    lookingFor: "Real-time Application Builders",
    skills: ["WebSockets", "Unity", "C#", "Redis", "Elixir"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Anya",
    lastName: "Petrov",
    email: "anya@gmail.com",
    plainPassword: "anya@123",
    age: 28,
    gender: "female",
    about:
      "NLP researcher specializing in multilingual language models. Building tools to make AI understand low-resource languages.",
    lookingFor: "NLP & Linguistics Researchers",
    skills: ["NLP", "Transformers", "HuggingFace", "Python", "FastAPI"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1502767089025-6572583495f9?q=80&w=800&auto=format&fit=crop",
  },
  {
    firstName: "Daniel",
    lastName: "Kim",
    email: "daniel@gmail.com",
    plainPassword: "daniel@123",
    age: 36,
    gender: "male",
    about:
      "Startup CTO who loves building v1 products from scratch. Expert at choosing the right tech stack for speed vs scale trade-offs.",
    lookingFor: "Non-technical Founders with Big Ideas",
    skills: ["Next.js", "Prisma", "Vercel", "Stripe", "PostgreSQL"],
    profilePictureUrl:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?q=80&w=800&auto=format&fit=crop",
  },
];

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await ConnectDB();
    console.log("Connected successfully!");

    console.log("Clearing existing users and connection requests...");
    await User.deleteMany({});
    await ConnectionRequest.deleteMany({});
    console.log("Collections cleared!");

    console.log("Hashing passwords and creating mock users...");
    const usersToInsert = await Promise.all(
      mockUsers.map(async (u) => {
        const passwordHash = await bcrypt.hash(u.plainPassword, 10);
        return {
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email.toLowerCase().trim(),
          password: passwordHash,
          age: u.age,
          gender: u.gender,
          about: u.about,
          lookingFor: u.lookingFor,
          skills: u.skills,
          profilePictureUrl: u.profilePictureUrl,
        };
      }),
    );

    const insertedUsers = await User.insertMany(usersToInsert);
    console.log(`Successfully seeded ${insertedUsers.length} mock users!`);

    console.log("\n--- Demo Accounts Created ---");
    mockUsers.forEach((u) => {
      console.log(`Email: ${u.email.padEnd(20)} Password: ${u.plainPassword}`);
    });
    console.log("-----------------------------\n");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

seedDatabase();
