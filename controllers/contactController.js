import { ContactsMap, updateContactsJson } from "../models/contact.js";
export { getContacts, createNewContact, updateContactsJson };

const getContacts = async (req, res) => {
    const contacts_map = ContactsMap;
    if (!contacts_map)
      return res.status(400).json({ message: "No contacts were found in directory." });
    //res.json(JSON.stringify(Object.fromEntries(contacts_map)));
    await res.json(Object.fromEntries(contacts_map));
    /* let gg = Object.fromEntries(contacts_map);
    let hh = JSON.stringify(gg);
    let ll = Array.from(contacts_map);
    res.json(hh); */
  };

  const createNewContact = async (req, res) => {
    if (!Object.keys(req.body).length === 5 ) {
        return res.status(400).json({ message: "New contact did not save." });
    }
    
    //let contacts_obj = Object.fromEntries(ContactsMap);
    //Object.entries(req.body).forEach(([key,value]) => { contacts_obj[key] = value });

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
    
    /* let keys = Object.keys(req.body);
    console.log(req.body[keys[0]]);
    var pp = req.body;
    console.log('body: ', req.body); */
  };
