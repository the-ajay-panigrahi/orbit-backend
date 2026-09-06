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
