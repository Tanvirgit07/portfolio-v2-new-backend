import { createPaginationInfo } from "../../lib/pagination.js";
import Contact from "./contacts.model.js";
import sendEmail from "../../lib/sendEmail.js";
import { adminMail } from "../../core/config/config.js";

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

  // Admin-কে ইমেইলে নোটিফিকেশন পাঠানো
  try {
    const servicesList = Array.isArray(services)
      ? services.join(", ")
      : services || "Not specified";

    await sendEmail({
      to: adminMail || "ahmmedtanvir009@gmail.com",
      subject: `New Portfolio Message from ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #15160e; color: #c7d300; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">New Contact Form Message</h2>
            <p style="margin: 6px 0 0; color: #ffffff; font-size: 13px;">Portfolio V2 Notification</p>
          </div>
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #777; width: 140px;"><strong>Sender Name:</strong></td>
                <td style="padding: 8px 0; color: #111;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;"><strong>Email Address:</strong></td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;"><strong>Phone Number:</strong></td>
                <td style="padding: 8px 0; color: #111;">${phoneNumber}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #777;"><strong>Requested Services:</strong></td>
                <td style="padding: 8px 0; color: #111;"><span style="background: #f0f0f0; padding: 3px 8px; border-radius: 4px;">${servicesList}</span></td>
              </tr>
            </table>

            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p style="margin-bottom: 8px; color: #777; font-size: 14px;"><strong>Message:</strong></p>
            <div style="background-color: #f8f9fa; padding: 16px; border-radius: 6px; border-left: 4px solid #c7d300; font-size: 14px; color: #222; white-space: pre-line;">
              ${message}
            </div>
          </div>
          <div style="background-color: #f1f1f1; padding: 12px; text-align: center; font-size: 12px; color: #888;">
            Sent automatically from your Portfolio Website
          </div>
        </div>
      `,
    });
  } catch (emailError) {
    console.error("Failed to send contact notification email:", emailError);
  }

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