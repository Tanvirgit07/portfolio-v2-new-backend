import { generateResponse } from "../../lib/responseFormate.js";
import { createResumeService, deleteResumeService, getAllResumeService, updateResumeStatusService } from "./resume.service.js";

export const addResume = async (req, res, next) => {
  try {
    // বডি এবং ফাইল সার্ভিস-এ পাঠানো হচ্ছে
    const data = await createResumeService({ 
      body: req.body, 
      files: req.files 
    });

    generateResponse(
      res,
      201,
      true,
      'Resume uploaded and saved successfully!',
      data
    );
  } catch (error) {
    // এরর মেসেজ অনুযায়ী রেসপন্স
    if (error.message === 'Resume PDF file is required!') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'PDF upload failed') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message.includes('title is required')) {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};

export const getAllResume = async (req, res, next) => {
  try {
    // req.query থেকে page, limit, isActive পাঠানো হচ্ছে
    const data = await getAllResumeService(req.query);

    return generateResponse(
      res,
      200,
      true,
      'Resume list fetched successfully',
      data
    );
  } catch (error) {
    // গ্লোবাল এরর হ্যান্ডলারে পাঠিয়ে দেয়া
    next(error);
  }
};

export const updateResumeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body; // ফ্রন্টএন্ড থেকে true/false পাঠানো হবে

    // ভ্যালিডেশন: ভ্যালুটা বুলিয়ান কি না চেক করা
    if (typeof isActive !== 'boolean') {
      return generateResponse(res, 400, false, "Status must be true or false", null);
    }

    const data = await updateResumeStatusService(id, isActive);

    return generateResponse(
      res,
      200,
      true,
      `Resume is now ${data.isActive ? 'Active' : 'Inactive'}`,
      data
    );
  } catch (error) {
    if (error.message === 'Resume not found!') {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    // req.params সরাসরি পাঠানো হচ্ছে যেমনটা আপনি হিরো সেকশনে করেছেন
    const data = await deleteResumeService(req.params);

    return generateResponse(
      res,
      200,
      true,
      'Resume deleted successfully',
    );
  } catch (error) {
    // এরর মেসেজ চেক করে রেসপন্স দেওয়া
    if (error.message === 'Resume not found') {
      return generateResponse(res, 404, false, error.message, null);
    }

    next(error);
  }
};