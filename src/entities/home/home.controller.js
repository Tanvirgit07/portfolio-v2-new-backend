import { generateResponse } from '../../lib/responseFormate.js';
import { createHomeContent, deleteHeroService, getAllHeroService, getsingleheroService, updateHomeContent } from './home.service.js';

export const createHome = async (req, res, next) => {
  try {

    const payload = req.body.data ? JSON.parse(req.body.data) : req.body
    const data = await createHomeContent({ body:payload, files: req.files });

    generateResponse(
      res,
      201,
      true,
      'Hero content created successfully!',
      data
    );
  } catch (error) {
    if (error.message === 'backgroundImage is required!') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'cvFileUrl is required!') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'image upload failed') {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};


export const updateHome = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payload = req.body.data
      ? JSON.parse(req.body.data)
      : req.body;

    const data = await updateHomeContent({
      id,
      body: payload,
      files: req.files
    });

    return generateResponse(
      res,
      200,
      true,
      'Hero content updated successfully!',
      data
    );
  } catch (error) {
    if (error.message === 'Hero content not found') {
      return generateResponse(res, 404, false, error.message, null);
    }
    if (error.message === 'image upload failed') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'cv upload failed') {
      return generateResponse(res, 400, false, error.message, null);
    }
    if (error.message === 'Invalid typingAnimationLines format') {
      return generateResponse(res, 400, false, error.message, null);
    }

    next(error);
  }
};


export const getAllHero = async (req, res, next) => {
  try {
    const data = await getAllHeroService(req.query);

    return generateResponse(
      res,
      200,
      true,
      'Hero list fetched successfully',
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getsingleHero = async (req,res,next) => {
  try {
    const data = await getsingleheroService(req.params);
    generateResponse(res, 200, true, 'Entry fetched', data);
  } catch (error) {
    if (error.message === 'Hero content not found') return generateResponse(res, 404, false, error.message, null);
    next(error);
  }
}


export const deleteHero = async (req, res, next) => {
  try {
    const data = await deleteHeroService(req.params);

    return generateResponse(
      res,
      200,
      true,
      'Hero deleted successfully',
    );
  } catch (error) {
    if (error.message === 'Hero content not found') {
      return generateResponse(res, 404, false, error.message, null);
    }

    next(error);
  }
};