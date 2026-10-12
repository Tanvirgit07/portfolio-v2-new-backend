import { connectDatabase } from "./src/core/config/database.js";
import Certificate from "./src/entities/certificates/certificate.model.js";

const demoCertificates = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    issuerLogo:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    certificateImage:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1200&auto=format&fit=crop&q=80",
    issueDate: "Nov 2024",
    credentialId: "AWS-SAA-839210",
    verificationUrl: "https://aws.amazon.com/verification",
    skills: [
      "AWS Architecture",
      "Cloud Computing",
      "S3 & EC2",
      "Serverless Lambda",
      "IAM & VPC Security",
      "High Availability",
    ],
    description:
      "Validated comprehensive knowledge of scalable cloud computing architecture, secure VPC networking, multi-region database replication, IAM role-based governance, and cost-optimized distributed infrastructure deployment on AWS.",
    order: 1,
    isActive: true,
  },
  {
    title: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta / Coursera",
    issuerLogo:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    certificateImage:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80",
    issueDate: "Aug 2024",
    credentialId: "META-FED-49281",
    verificationUrl:
      "https://coursera.org/verify/professional-cert/tanvir-meta",
    skills: [
      "React.js",
      "Advanced JavaScript",
      "State Management",
      "UI/UX Architecture",
      "Jest & RTL Testing",
      "Performance Optimization",
    ],
    description:
      "Nine-course rigorous specialization authorized by Meta. Covered advanced React design patterns, custom state management hooks, unit testing with Jest & React Testing Library, WCAG web accessibility (a11y), responsive modern web design, and end-to-end frontend performance optimization.",
    order: 2,
    isActive: true,
  },
  {
    title: "Full-Stack Web Development Specialization",
    issuer: "Programming Hero",
    issuerLogo:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    certificateImage:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80",
    issueDate: "May 2024",
    credentialId: "PH-FSWD-99412",
    verificationUrl: "https://programming-hero.com/verification",
    skills: [
      "Next.js 14",
      "Node.js",
      "Express.js",
      "MongoDB Aggregation",
      "TypeScript",
      "RESTful APIs",
      "Tailwind CSS",
    ],
    description:
      "Comprehensive 6-month full-stack immersion in production-grade web applications. Developed multi-tenant platforms, asynchronous microservices, MongoDB aggregations, JWT & OAuth authentication flows, and scalable Next.js server actions with high test coverage.",
    order: 3,
    isActive: true,
  },
  {
    title: "Docker & Kubernetes: The Practical Guide",
    issuer: "Udemy / Academind",
    issuerLogo:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    certificateImage:
      "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1200&auto=format&fit=crop&q=80",
    issueDate: "Feb 2024",
    credentialId: "UC-99201-DKR-K8S",
    verificationUrl: "https://ude.my/UC-99201-DKR-K8S",
    skills: [
      "Docker",
      "Kubernetes",
      "Containerization",
      "CI/CD Pipelines",
      "Cluster Management",
      "DevOps Workflows",
    ],
    description:
      "Hands-on mastery of microservice containerization, multi-stage Docker builds, Kubernetes pods, deployments, services, ingress controllers, persistent volumes, ConfigMaps, secrets, and automated container deployment pipelines.",
    order: 4,
    isActive: true,
  },
  {
    title: "JavaScript Algorithms and Data Structures (Mastery)",
    issuer: "freeCodeCamp",
    issuerLogo:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80",
    certificateImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80",
    issueDate: "Dec 2023",
    credentialId: "FCC-JSDS-40291",
    verificationUrl:
      "https://freecodecamp.org/certification/tanvir/javascript-algorithms-and-data-structures",
    skills: [
      "Data Structures",
      "Algorithms",
      "Time Complexity (Big-O)",
      "Dynamic Programming",
      "Recursion",
      "Clean Code",
    ],
    description:
      "Deep understanding of core computer science fundamentals including Big-O time and space complexity, trees & graphs, sorting and searching algorithms, memory optimization, and object-oriented & functional programming patterns in modern ECMAScript.",
    order: 5,
    isActive: true,
  },
];

async function seed() {
  try {
    console.log("Connecting to database...");
    await connectDatabase();
    console.log("Connected to MongoDB successfully!");

    for (const cert of demoCertificates) {
      const existing = await Certificate.findOne({
        credentialId: cert.credentialId,
      });
      if (existing) {
        console.log(`Certificate already exists: ${cert.title}`);
        await Certificate.updateOne({ _id: existing._id }, { $set: cert });
      } else {
        await Certificate.create(cert);
        console.log(`Created certificate: ${cert.title}`);
      }
    }

    const total = await Certificate.countDocuments();
    console.log(`Seeding complete! Total certificates in database: ${total}`);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding certificates:", error);
    process.exit(1);
  }
}

seed();

