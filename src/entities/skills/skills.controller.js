import { generateResponse } from "../../lib/responseFormate.js";
import { createSkillService, deleteSkillService, getAllSkillService, getSingleSkillService, updateSkillService } from "./skills.service.js";

export const skilliamge = async (req, res, next) => {
  try {
    // সরাসরি বডি এবং ফাইল পাঠানো হচ্ছে
    const data = await createSkillService({ body: req.body, files: req.files });

    generateResponse(
      res,
      201,
      true,
      'Skill created successfully!',
      data
    );
  } catch (error) {
    // আপনার প্যাটার্ন অনুযায়ী এরর হ্যান্ডলিং
    if (error.message === 'Skill image is required!') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'Skill name is required!') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'image upload failed') {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params; // URL থেকে স্কিল আইডি নেওয়া
    const data = await updateSkillService({ 
      id, 
      body: req.body, 
      files: req.files 
    });

    generateResponse(
      res,
      200,
      true,
      'Skill updated successfully!',
      data
    );
  } catch (error) {
    if (error.message === 'Skill not found!') {
      return generateResponse(res, 404, false, error.message, null);
    }
    if (error.message === 'image upload failed') {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};

export const getAllSkill = async (req, res, next) => {
  try {
    // req.query এর মধ্যে page, limit এবং searchTerm থাকতে পারে
    const data = await getAllSkillService(req.query);

    return generateResponse(
      res,
      200,
      true,
      'Skill list fetched successfully',
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleSkill = async (req, res, next) => {
  try {
    const { id } = req.params; // URL থেকে স্কিল আইডি নেওয়া
    const data = await getSingleSkillService(id);

    return generateResponse(
      res,
      200,
      true,
      'Skill fetched successfully',
      data
    );
  } catch (error) {
    // আপনার স্টাইল অনুযায়ী স্পেসিফিক এরর হ্যান্ডলিং
    if (error.message === 'Skill not found!') {
      return generateResponse(res, 404, false, error.message, null);
    }
    
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // সার্ভিস কল করা
    await deleteSkillService(id);

    return generateResponse(
      res,
      200,
      true,
      'Skill deleted successfully',
      null // ডিলিট করার পর সাধারণত কোনো ডাটা পাঠানোর প্রয়োজন হয় না
    );
  } catch (error) {
    // স্পেসিফিক এরর হ্যান্ডলিং
    if (error.message === 'Skill not found!') {
      return generateResponse(res, 404, false, error.message, null);
    }

    next(error);
  }
};