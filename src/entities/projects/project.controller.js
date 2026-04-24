export const addProject = async (req, res, next) => {
  try {
    // সার্ভিস কল করা
    const data = await createProjectService({ 
      body: req.body, 
      files: req.files 
    });

    return generateResponse(
      res,
      201,
      true,
      'Project published successfully!',
      data
    );
  } catch (error) {
    // আপনার নির্দিষ্ট এরর মেসেজ অনুযায়ী হ্যান্ডলিং
    if (error.message === 'Project thumbnail is required!') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'Image upload failed') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message.includes('title is required')) {
      return generateResponse(res, 400, false, "Project title is required!", null);
    }

    next(error);
  }
};