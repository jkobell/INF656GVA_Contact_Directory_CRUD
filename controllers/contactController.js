import { Contact, ContactsMap, updateContactsJson } from "../models/contact.js";
export { getContacts, createNewContact, updateContact, updateContactsJson };

const getContacts = async (req, res) => {
    const contacts_map = ContactsMap;
    if (!contacts_map)
      return res.status(400).json({ message: "No contacts were found in directory." });
    await res.json(Object.fromEntries(contacts_map));
  };

  const createNewContact = async (req, res) => {
    if (!Object.keys(req.body).length === 5 ) {
        return res.status(400).send("message: New contact did not save.");
    }    

    let last_contacts_map_key = parseInt(Array.from(ContactsMap.keys()).pop());

    if (last_contacts_map_key >= 0) {
        req.body.id = last_contacts_map_key + 1;
        ContactsMap.set(`${last_contacts_map_key + 1}`, req.body);
    }
    else {
        req.body.id = 0;
        ContactsMap.set('0', req.body);
    }

    const contacts_map_updated = ContactsMap;
    updateContactsJson(contacts_map_updated);

    res.status(200);
    return res.send();
  };

  const updateContact = async (req, res) => {
    if (!Object.keys(req.body).length === 5 ) {
      return res.status(400).send("message: Contact did not update.");
    }
    
    let contact_obj = new Object(Contact);
    contact_obj = req.body;
    ContactsMap.set(contact_obj.id, contact_obj);

    const contacts_map_updated = ContactsMap;
    updateContactsJson(contacts_map_updated);

    res.status(200);
    return res.send();
  };
