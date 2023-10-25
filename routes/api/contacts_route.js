import express from 'express';
import { getContacts, createNewContact } from '../../controllers/contactController.js';
export { contacts_router };

const contacts_router = express();

contacts_router
    .route('/')
    .get(getContacts)
    .post(createNewContact);

/* contacts_router
  .route("/")
  .get(getContacts)
  .post(createNewContact)
  .put(updateContact)
  .delete(deleteContact); */

//router.route("/:id").get(getContact);


