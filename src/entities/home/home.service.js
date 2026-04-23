import { cloudinaryUpload } from '../../lib/cloudinaryUpload.js';
import { createPaginationInfo } from '../../lib/pagination.js';
import Hero from './home.model.js';

export const createHomeContent = async ({ body, files }) => {
  const {
    overlayOpacity,
    typingAnimationLines,
    titleLine1,
    titleLine2,
    description,
    primaryBtnText,
    secondaryBtnText,
    videoUrl
  } = body;

  const backgroundImage = files?.heroImage?.[0];
  if (!backgroundImage) {
    throw new Error('backgroundImage is required!');
  }

  const backgroundImageResult = await cloudinaryUpload(
    backgroundImage.path,
    `bg-${Date.now()}`,
    'portfoliov2/images'
  );

  if (!backgroundImageResult?.secure_url) {
    throw new Error('image upload failed');
  }

  const cvFile = files?.heroIcon?.[0];

  let cvFileUrl = null;

  if (cvFile) {
    const cvFileResult = await cloudinaryUpload(
      cvFile.path,
      `cv-${Date.now()}`,
      'portfoliov2/docs'
    );

    if (!cvFileResult?.secure_url) {
      throw new Error('cv upload failed');
    }

    cvFileUrl = cvFileResult.secure_url;
  }

  let parsedTypingLines = [];

  try {
    parsedTypingLines =
      typeof typingAnimationLines === 'string'
        ? JSON.parse(typingAnimationLines)
        : typingAnimationLines;
  } catch (err) {
    throw new Error('Invalid typingAnimationLines format');
  }

  const newHero = await Hero.create({
    backgroundImage: backgroundImageResult.secure_url,
    overlayOpacity: overlayOpacity !== undefined ? Number(overlayOpacity) : 20,
    typingAnimationLines: parsedTypingLines,
    titleLine1,
    titleLine2,
    description,
    primaryBtnText,
    cvFileUrl, // optional
    secondaryBtnText,
    videoUrl
  });

  return newHero;
};

export const updateHomeContent = async ({ id, body, files }) => {
  const {
    overlayOpacity,
    typingAnimationLines,
    titleLine1,
    titleLine2,
    description,
    primaryBtnText,
    secondaryBtnText,
    videoUrl
  } = body;

  const hero = await Hero.findById(id);
  if (!hero) {
    throw new Error('Hero content not found');
  }

  // ── Background Image Update ──
  if (files?.heroImage?.[0]) {
    const backgroundImage = files.heroImage[0];

    const result = await cloudinaryUpload(
      backgroundImage.path,
      `bg-${Date.now()}`,
      'portfoliov2/images'
    );

    if (!result?.secure_url) {
      throw new Error('image upload failed');
    }

    hero.backgroundImage = result.secure_url;
  }

  // ── CV / Icon File Update ──
  if (files?.heroIcon?.[0]) {
    const cvFile = files.heroIcon[0];

    const result = await cloudinaryUpload(
      cvFile.path,
      `cv-${Date.now()}`,
      'portfoliov2/docs'
    );

    if (!result?.secure_url) {
      throw new Error('cv upload failed');
    }

    hero.cvFileUrl = result.secure_url;
  }

  // ── Typing Lines Parse ──
  if (typingAnimationLines) {
    try {
      hero.typingAnimationLines =
        typeof typingAnimationLines === 'string'
          ? JSON.parse(typingAnimationLines)
          : typingAnimationLines;
    } catch {
      throw new Error('Invalid typingAnimationLines format');
    }
  }

  // ── Normal Fields Update ──
  if (overlayOpacity !== undefined)
    hero.overlayOpacity = Number(overlayOpacity);

  if (titleLine1) hero.titleLine1 = titleLine1;
  if (titleLine2) hero.titleLine2 = titleLine2;
  if (description) hero.description = description;
  if (primaryBtnText) hero.primaryBtnText = primaryBtnText;
  if (secondaryBtnText) hero.secondaryBtnText = secondaryBtnText;
  if (videoUrl) hero.videoUrl = videoUrl;

  await hero.save();

  return hero;
};

export const getAllHeroService = async ({ page = 1, limit = 10, isActive }) => {
  const filter = {};

  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const total = await Hero.countDocuments(filter);

  const heroes = await Hero.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    heroes,
    paginationInfo: createPaginationInfo(pageNumber, limitNumber, total)
  };
};

export const getsingleheroService = async ({ id }) => {
  const hero = await Hero.findById(id);

  if (!hero) {
    throw new Error('Hero content not found');
  }

  return hero;
};


export const deleteHeroService = async ({id}) => {
  const hero = await Hero.findByIdAndDelete(id);

  if (!hero) {
    throw new Error('Hero content not found');
  }

  return hero;
};

export const toggleHeroStatusService = async (id, isActive) => {
  // ১. চেক করা এই আইডি-তে ডেটা আছে কি না
  const hero = await Hero.findById(id);
  if (!hero) {
    throw new Error('Hero content not found!'); // এরর মেসেজ Hero অনুযায়ী ফিক্স করা হয়েছে
  }

  // ২. বডি থেকে আসা isActive ভ্যালু দিয়ে আপডেট করা
  const updatedHero = await Hero.findByIdAndUpdate(
    id,
    { isActive: isActive },
    { new: true, runValidators: true }
  );

  return updatedHero;
};