import express from 'express';
import { createContact, deleteContact, getAllContact, getSingleContact } from './contacts.controller.js';
const router = express.Router();

router.post('/send-message', createContact);
router.get('/get-all-messages', getAllContact);
router.get('/get-message/:id', getSingleContact);
router.delete('/delete-message/:id', deleteContact);

export default router;