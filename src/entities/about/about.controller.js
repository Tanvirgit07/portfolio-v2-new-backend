import { generateResponse } from "../../lib/responseFormate.js";
import { createAboutContent, deleteAboutService, getActiveAboutService, getAllAboutService, getSingleAboutService, toggleAboutStatusService, updateAboutContent } from "./about.service.js";

export const createAbout = async (req, res, next) => {
  try {
    // ফর্ম-ডেটা থেকে আসলে ডাটা অনেক সময় স্ট্রিং আকারে থাকে, তাই পার্স করা প্রয়োজন
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
    console.log(payload);
    console.log(req.files);
    
    // সার্ভিস ফাংশনকে কল করা
    const data = await createAboutContent({ body: payload, files: req.files });

    generateResponse(
      res,
      201,
      true,
      'About content created successfully!',
      data
    );
  } catch (error) {
    // নির্দিষ্ট এরর হ্যান্ডলিং
    const errorMessages = [
      'profileImage is required!',
      'image upload failed',
      'Invalid stats format',
      'Invalid descriptions format'
    ];

    if (errorMessages.includes(error.message)) {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error); // গ্লোবাল এরর হ্যান্ডলারে পাঠানো
  }
};


export const updateAbout = async (req, res, next) => {
  try {
    const { id } = req.params; // URL থেকে ID নেওয়া
    
    // FormData থেকে আসলে ডেটা পার্স করা
    const payload = req.body.data ? JSON.parse(req.body.data) : req.body;
    
    // সার্ভিস ফাংশন কল করা
    const data = await updateAboutContent({ 
      id, 
      body: payload, 
      files: req.files 
    });

    generateResponse(
      res,
      200,
      true,
      'About content updated successfully!',
      data
    );
  } catch (error) {
    const errorMessages = [
      'About story not found!',
      'image upload failed',
      'Invalid stats format',
      'Invalid descriptions format',
      'Invalid typewriterStrings format'
    ];

    if (errorMessages.includes(error.message)) {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};

export const getAllAbouts = async (req, res, next) => {
  try {
    // সার্ভিস থেকে আসা পুরো অবজেক্টটি (abouts + paginationInfo) রিসিভ করা
    const data = await getAllAboutService(req.query);

    return generateResponse(
      res,
      200,
      true,
      'About list fetched successfully',
      data
    );
  } catch (error) {
    next(error);
  }
};

export const getSingleAbout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await getSingleAboutService(id);

    return generateResponse(
      res,
      200,
      true,
      'About content fetched successfully',
      data
    );
  } catch (error) {
    // যদি আইডি ফরম্যাট ভুল হয় বা ডেটা না পাওয়া যায়
    if (error.message === 'About content not found!') {
      return generateResponse(res, 404, false, error.message, null);
    }
    
    next(error);
  }
};

export const deleteAbout = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteAboutService(id);

    return generateResponse(
      res,
      200,
      true,
      'About content deleted successfully',
      null
    );
  } catch (error) {
    if (error.message === 'About content not found!') {
      return generateResponse(res, 404, false, error.message, null);
    }
    
    next(error);
  }
};

export const toggleAboutStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body; // ফ্রন্টএন্ড থেকে পাঠানো { "isActive": true/false }

    // যদি বডিতে isActive না পাঠানো হয়, তবে একটি এরর দেওয়া যেতে পারে (অপশনাল)
    if (isActive === undefined) {
      return generateResponse(res, 400, false, "isActive status is required in body", null);
    }

    const data = await toggleAboutStatusService(id, isActive);

    const statusMessage = data.isActive ? 'activated' : 'deactivated';

    return generateResponse(
      res,
      200,
      true,
      `About content ${statusMessage} successfully`,
      data
    );
  } catch (error) {
    if (error.message === 'About content not found!') {
      return generateResponse(res, 404, false, error.message, null);
    }
    
    next(error);
  }
};

export const getActiveAbout = async (req, res, next) => {
  try {
    const data = await getActiveAboutService();

    return generateResponse(
      res,
      200,
      true,
      'Active about section fetched successfully',
      data
    );
  } catch (error) {
    // যদি সার্ভিস থেকে Error থ্রো হয় (যেমন: ডাটা না পাওয়া গেলে)
    next(error);
  }
};