import * as fs from 'node:fs';
//import { contacts_json } from "../data/contacts_orig.js"; 
export { Contact, ContactsMap, updateContactsJson };

const Contact = {"id":"", "name":"", "phone":"", "email":"", "region":""};

var contacts_json = JSON.parse(ReadContactsJson());
var ContactsMap = new Map(Object.entries(contacts_json));

function updateContactsJson(contacts_map_updated) {
    let contacts_json_updated = Object.fromEntries(contacts_map_updated);
    if (contacts_json_updated !== null) {
        fs.writeFile('./data/contacts.json', JSON.stringify(contacts_json_updated), 'utf8', (err) => {
            if (err) {
                console.log('Update json file failed', err);
                //Write_log_entry(err); TODO
            }
            else {
                contacts_json = JSON.parse(ReadContactsJson());
                ContactsMap = new Map(Object.entries(contacts_json));
            }
        });
    }    
}

function ReadContactsJson() {
    try {
        let data = fs.readFileSync('./data/contacts.json', 'utf8');
        if (data) {
            return data;
        }
    }
    catch (error) {
        console.log('Read json file failed.', error);
        //Write_log_entry(error);
    } 
}

function writeJsonFile() {
    fs.writeFile('./data/contacts.json', JSON.stringify(contacts_json), 'utf8', (err) => {
        if (err) {
            console.log('Update json file failed.', err);
            //Write_log_entry(err); TODO
        }
    });
}

//writeJsonFile();


