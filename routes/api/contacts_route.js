import express from 'express';
import { validationResult } from 'express-validator';
import { getContacts, createNewContact, updateContact, deleteContact } from '../../controllers/contactController.js';
import { newContactValidator, updateContactValidator, deleteContactValidator } from '../../validation/validator.js';
export { contacts_router };

const contacts_router = express.Router()

contacts_router.get('/contacts', (req, res) => {
  getContacts(req, res);
});

contacts_router.post('/contacts',
  newContactValidator, //validator middleware post
  (req, res, next) => {
    const result_errors = validationResult(req).array();
    if (result_errors && result_errors.length > 0) {
      return res.status(400).json(result_errors);
    }
    createNewContact(req, res);
});

contacts_router.put('/contacts',
  updateContactValidator, //validator middleware for put
  (req, res, next) => {
    const result_errors = validationResult(req).array();
    if (result_errors && result_errors.length > 0) {
      return res.status(400).json(result_errors);
    }
    updateContact(req, res);
});

contacts_router.delete('/contacts',
  deleteContactValidator, //validator middleware for delete -- xss mitigation
  (req, res, next) => {
    const result_errors = validationResult(req).array();
    if (result_errors && result_errors.length > 0) {
      return res.status(400).json(result_errors);
    }
    deleteContact(req, res);
});
