import Knowledge from '../knoledge/knoledge.model.js';
import Project from '../projects/project.model.js';
import Skill from '../skills/skills.model.js';

const getOverviewStats = async () => {
  // সবগুলোর কাউন্ট প্যারালালি নেওয়ার জন্য Promise.all ব্যবহার করা হয়েছে
  const [totalSkills, totalProjects, totalKnowledge] = await Promise.all([
    Skill.countDocuments(),
    Project.countDocuments(),
    Knowledge.countDocuments()
  ]);

  return {
    totalSkills,
    totalProjects,
    totalKnowledge
  };
};

export const OverviewService = {
  getOverviewStats
};


const getRecentKnowledgeItems = async () => {
  return await Knowledge.find()
    .select("title category shortDescription thumbnail createdAt") // ড্যাশবোর্ডে সব ডাটা লাগে না, তাই প্রয়োজনীয় ফিল্ডগুলো সিলেক্ট করা ভালো
    .sort({ createdAt: -1 })
    .limit(5);
};

export const KnowledgeDashService = {
  getRecentKnowledgeItems,
};


const getRecentProjectsItems = async () => {
  return await Project.find({ isActive: true }) // শুধু একটিভ প্রজেক্টগুলো দেখাবে
    .sort({ createdAt: -1 }) // নতুনগুলো আগে দেখাবে
    .limit(5) // মাত্র ৫টি ডাটা নিবে
    .select("title category images tags links"); // ড্যাশবোর্ডের জন্য প্রয়োজনীয় ফিল্ডগুলো সিলেক্ট করা হলো
};

export const ProjectDashService = {
  getRecentProjectsItems,
};