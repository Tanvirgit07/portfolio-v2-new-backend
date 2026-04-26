import { createPaginationInfo } from "../../lib/pagination.js";
import Contact from "./contacts.model.js";

export const createContactService = async (body) => {
  const { firstName, lastName, email, phoneNumber, services, message } = body;

  const contact = await Contact.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    services,
    message,
  });

  return contact;
};

export const getAllContactService = async ({
  page = 1,
  limit = 10,
  status,
}) => {
  const filter = {};

  // স্ট্যাটাস অনুযায়ী ফিল্টার (Pending, Reviewed, etc.)
  if (status) {
    filter.status = status;
  }

  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;

  const total = await Contact.countDocuments(filter);

  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNumber - 1) * limitNumber)
    .limit(limitNumber);

  return {
    contacts,
    paginationInfo: createPaginationInfo(
      pageNumber,
      limitNumber,
      total
    ),
  };
};

export const getSingleContactService = async ({ id }) => {
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new Error("Message not found");
  }

  return contact;
};

export const deleteContactService = async ({ id }) => {
  const contact = await Contact.findByIdAndDelete(id);

  if (!contact) {
    throw new Error("Message not found");
  }

  return contact;
};