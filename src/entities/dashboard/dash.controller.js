import { KnowledgeDashService, OverviewService, ProjectDashService } from "./dash.service.js";

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await OverviewService.getOverviewStats();

    res.status(200).json({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};


export const getRecentKnowledge = async (req, res) => {
  try {
    const recentKnowledge = await KnowledgeDashService.getRecentKnowledgeItems();

    res.status(200).json({
      success: true,
      message: "Recent 5 knowledge posts retrieved",
      data: recentKnowledge,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recent knowledge",
      error: error.message,
    });
  }
};


export const getRecentProjects = async (req, res) => {
  try {
    const projects = await ProjectDashService.getRecentProjectsItems();

    res.status(200).json({
      success: true,
      message: "Recent 5 projects fetched successfully",
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recent projects",
      error: error.message,
    });
  }
};