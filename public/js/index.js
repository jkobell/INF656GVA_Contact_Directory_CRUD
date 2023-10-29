const Contact = {"id":"", "name":"", "phone":"", "email":"", "region":""};
const contacts_api_url = 'http://localhost:3030/contacts';
let new_dialog = null;
let new_contact_form = null;
let edit_dialog = null;
let edit_contact_form = null;
let delete_dialog = null;
let id_obj = null;

//Get all api call
async function getAll() {
    try {
        const http_response = await fetch(contacts_api_url);
        return await http_response.json(); 
    } catch(err) {
        console.log('Get all contacts failed: ', String(err));
    }
}

//POST new contact
async function postCreateNew(new_inputs_data_obj) {
    await fetch(contacts_api_url, {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(new_inputs_data_obj)
    }).then((response) => {
        if (response.status === 400) {
            return response.text().then((text) => {
                let json_errs = JSON.parse(text);
                let err_message = '\n';
                if (json_errs && json_errs.length > 0) {
                    json_errs.forEach((json_err) => {
                        err_message += `${json_err.msg}\n`;
                    });
                }
                throw Error(err_message);            
            });
        }
        console.log('POST response status: ', response.status);
        refreshTable();
    }).then(() => {
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
        }));
    }).then(() => {
        window.dispatchEvent(new Event("load", {
            bubbles: true,
            cancelable: true
        }));
    }).catch((err) => {
        showErrors(`Save new contact failed.\n----Details:----\n${String(err)}`);
    });
}

//Update contact
async function updateContact(contact) {
    await fetch(contacts_api_url, {
        method: "PUT",
        mode: "same-origin",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(contact)
    }).then((response) => {
        if (response.status === 400) {
            return response.text().then((text) => {
                let json_errs = JSON.parse(text);
                let err_message = '\n';
                if (json_errs && json_errs.length > 0) {
                    json_errs.forEach((json_err) => {
                        err_message += `${json_err.msg}\n`; //parse out only validation fail messages
                    });
                }
                throw Error(err_message);            
            });
        }
        console.log('PUT response status: ', response.status);
        refreshTable();                
    }).then(() => {
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
        }));
    }).then(() => {
        window.dispatchEvent(new Event("load", {
            bubbles: true,
            cancelable: true
        }));
    }).catch((err) => {
        showErrors(`Update contact failed.\n----Details:----\n${String(err)}`);
    });   
}

// Delete contact by Id
async function deleteContact(id) {
    await fetch(contacts_api_url, {
        method: "DELETE",
        mode: "same-origin",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(id)
    }).then((response) => {
        if (response.status === 400) {
            return response.text().then((text) => {
                let json_errs = JSON.parse(text);
                let err_message = '\n';
                if (json_errs && json_errs.length > 0) {
                    json_errs.forEach((json_err) => {
                        err_message += `${json_err.msg}\n`; //parse out only validation fail messages
                    });
                }
                throw Error(err_message);            
            });
        }
        console.log('DELETE response status: ', response.status);
        refreshTable();                
    }).then(() => {
        window.document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
        }));
    }).then(() => {
        window.dispatchEvent(new Event("load", {
            bubbles: true,
            cancelable: true
        }));
    }).catch((err) => {
        showErrors(`Delete contact failed.\n----Details:----\n${String(err)}`);
    });    
}

//populate table, then add all event listeners
//remove current anonymous callback functions with clone node 
//  before re-adding event listeners when refresh view 
document.addEventListener('DOMContentLoaded', (event) => {
    const table_refresh = new Promise((resolve) => {
        refreshTable();
        resolve();
    }).then(() => {
        new_dialog = document.querySelector("dialog[id='new_dialog']");
        edit_dialog = document.querySelector("dialog[id='edit_dialog']");
        delete_dialog = document.querySelector("dialog[id='delete_dialog']");

        const new_contact_form_promise = new Promise((resolve) => {
            new_contact_form = document.querySelector("form[id='new_dialog_form']");
            if (new_contact_form) {
                let new_contact_form_clone = new_contact_form.cloneNode(true);
                new_contact_form.parentNode.replaceChild(new_contact_form_clone, new_contact_form);
                resolve();
            }
        }).then(() => {
            new_contact_form = document.querySelector("form[id='new_dialog_form']");
            if (new_contact_form) {
                new_contact_form.addEventListener('submit', (event) => {event.preventDefault();}, false);
            }
        });

        const new_save_button_promise = new Promise((resolve) => {
            const new_save_button = document.querySelector("button[id='new_save_button']");
            if (new_save_button) {
                let new_save_button_clone = new_save_button.cloneNode(true);
                new_save_button.parentNode.replaceChild(new_save_button_clone, new_save_button);
                resolve();
            }
        }).then(() => {
            const new_save_button = document.querySelector("button[id='new_save_button']");
            if (new_save_button) {
                new_save_button.addEventListener('click', () => {
                    if (validate('new')) {
                        createNewContact();
                        new_dialog.close();
                        new_contact_form.reset();
                    }        
                }, false);
            }
        });

        const new_cancel_button_promise = new Promise((resolve) => {
            const new_cancel_button = document.querySelector("button[id='new_cancel_button']");
            if (new_cancel_button) {
                let new_cancel_button_clone = new_cancel_button.cloneNode(true);
                new_cancel_button.parentNode.replaceChild(new_cancel_button_clone, new_cancel_button);
                resolve();
            }           
        }).then(() => {
            const new_cancel_button = document.querySelector("button[id='new_cancel_button']");
            if (new_cancel_button) {
                new_cancel_button.addEventListener('click', () => {
                    new_dialog.close();
                }, false);
            }
        });

        const add_button_promise = new Promise((resolve) => {
            const add_button = document.querySelector("button[id='new_contact_button']");
            if (add_button) {
                let add_button_clone = add_button.cloneNode(true);
                add_button.parentNode.replaceChild(add_button_clone, add_button);
                resolve();
            }
        }).then(() => {
            const add_button = document.querySelector("button[id='new_contact_button']");
            if (add_button) {
                add_button.addEventListener('click', () => {
                    new_dialog.showModal();
                }, false);
            }
        });

        const edit_contact_form_promise = new Promise((resolve) => {
            edit_contact_form = document.querySelector("form[id='edit_dialog_form']");
            if (edit_contact_form) {
                let edit_contact_form_clone = edit_contact_form.cloneNode(true);
                edit_contact_form.parentNode.replaceChild(edit_contact_form_clone, edit_contact_form);
                resolve();
            }
        }).then(() => {
            edit_contact_form = document.querySelector("form[id='edit_dialog_form']");
            if (edit_contact_form) {
                edit_contact_form.addEventListener('submit', (event) => {event.preventDefault();}, false);
            }
        });

        const edit_update_button_promise = new Promise((resolve) => {
            const edit_update_button = document.querySelector("button[id='edit_update_button']");
            if (edit_update_button) {
                let edit_update_button_clone = edit_update_button.cloneNode(true);
                edit_update_button.parentNode.replaceChild(edit_update_button_clone, edit_update_button);
                resolve();
            }
        }).then(() => {
            const edit_update_button = document.querySelector("button[id='edit_update_button']");
            if (edit_update_button) {
                edit_update_button.addEventListener('click', () => { 
                    if (validate('edit')) {
                        createUpdateContact();
                        edit_dialog.close();
                        edit_contact_form.reset();
                    }        
                }, false);
            }
        });

        const edit_cancel_button_promise = new Promise((resolve) => {
            const edit_cancel_button = document.querySelector("button[id='edit_cancel_button']");
            if (edit_cancel_button) {
                let edit_cancel_button_clone = edit_cancel_button.cloneNode(true);
                edit_cancel_button.parentNode.replaceChild(edit_cancel_button_clone, edit_cancel_button);
                resolve();
            }
        }).then(() => {
            const edit_cancel_button = document.querySelector("button[id='edit_cancel_button']");
            if (edit_cancel_button) {
                edit_cancel_button.addEventListener('click', () => {
                    edit_dialog.close();
                }, false);
            }
        });

        const delete_ok_button_promise = new Promise((resolve) => {
            const delete_ok_button = document.querySelector("button[id='delete_ok_button']");
            if (delete_ok_button) {
                let delete_ok_button_clone = delete_ok_button.cloneNode(true);
                delete_ok_button.parentNode.replaceChild(delete_ok_button_clone, delete_ok_button);
                resolve();
            }
        }).then(() => {
            const delete_ok_button = document.querySelector("button[id='delete_ok_button']");
            if (delete_ok_button) {
                delete_ok_button.addEventListener('click', () => { 
                    deleteContact(id_obj);
                    delete_dialog.close();        
                }, false);
            }
        });

        const delete_cancel_button_promise = new Promise((resolve) => {
            const delete_cancel_button = document.querySelector("button[id='delete_cancel_button']");
            if (delete_cancel_button) {
                let delete_cancel_button_clone = delete_cancel_button.cloneNode(true);
                delete_cancel_button.parentNode.replaceChild(delete_cancel_button_clone, delete_cancel_button);
                resolve();
            }
        }).then(() => {
            const delete_cancel_button = document.querySelector("button[id='delete_cancel_button']");
            if (delete_cancel_button) {
                delete_cancel_button.addEventListener('click', () => {
                    delete_dialog.close();
                }, false);
            }
        });
    });
});

window.addEventListener('load', (event) => {
    const edit_button = setInterval(()=> { //wait until table dom completes
        let edit_contact_buttons = document.querySelectorAll("button[class='edit_contact_button']");
        if (edit_contact_buttons) {
            clearInterval(edit_button); 
            edit_contact_buttons.forEach((edit_contact_button)=> {
                edit_contact_button.addEventListener('click', (event) => {
                    openEditDialog(event);
                });
            })
        }
    }, 100);
    const delete_button = setInterval(()=> { //wait until table dom completes
        let delete_contact_buttons = document.querySelectorAll("button[class='delete_contact_button']");
        if (delete_contact_buttons) {
            clearInterval(delete_button); 
            delete_contact_buttons.forEach((delete_contact_button)=> {
                delete_contact_button.addEventListener('click', (event) => {
                    createDeleteContact(event);
                });
            })
        }
    }, 100);
});

function openEditDialog(event) { //update form values capture
    let table_data_elements = event.currentTarget.parentNode.parentNode.childNodes;
    if (table_data_elements && table_data_elements.length == 6) {
        const edit_contact_form = document.querySelector("form[id='edit_dialog_form']");
        if (edit_contact_form) {
            edit_contact_form.id.value = table_data_elements[0].childNodes.length > 0 ? table_data_elements[0].childNodes[0].data : '';
            edit_contact_form.name.value = table_data_elements[1].childNodes.length > 0 ? table_data_elements[1].childNodes[0].data : '';
            edit_contact_form.phone.value = table_data_elements[2].childNodes.length > 0 ? table_data_elements[2].childNodes[0].data : '';
            edit_contact_form.email.value = table_data_elements[3].childNodes.length > 0 ? table_data_elements[3].childNodes[0].data : '';
            edit_contact_form.region.value = table_data_elements[4].childNodes.length > 0 ? table_data_elements[4].childNodes[0].data : '';
        }
    }
    edit_dialog.showModal();
}

function refreshTable() {//TODO paginate after 50 records. Add sort feature to columns
    getAll().then((data) => {
        if (data) {
            const data_map = new Map(Object.entries(data));
            let trHTML = '';
            data_map.forEach((value, key) => {
                trHTML += '<tr data-rowid='+value.id+'>';
                trHTML += '<td>'+value.id+'</td>';
                trHTML += '<td>'+value.name+'</td>';
                trHTML += '<td>'+value.phone+'</td>';
                trHTML += '<td>'+value.email+'</td>';
                trHTML += '<td>'+value.region+'</td>';
                trHTML += '<td><button type="button" class="edit_contact_button">Edit</button>';
                trHTML += '<button type="button" class="delete_contact_button">Delete</button></td>';
                trHTML += "</tr>";
            });
            document.getElementById("contact_table").innerHTML = trHTML;
        }        
    });
}

function createNewContact() {
    let new_inputs_data_keys = [];
    let new_inputs_data_values = [];
    new_input_elements = document.querySelectorAll("[class='new_input']");
    if (new_input_elements && new_input_elements.length > 0) {
        new_input_elements.forEach((new_input_element) => {
            new_inputs_data_keys.push(`${new_input_element.name}`);
            new_inputs_data_values.push(`${new_input_element.value}`);
        });
    }
    let new_inputs_data_obj = Object.fromEntries(new_inputs_data_keys.map((key, index) => [key, new_inputs_data_values[index]]));
    
    postCreateNew(new_inputs_data_obj);
}

function createUpdateContact() {
    let edit_inputs_data_keys = [];
    let edit_inputs_data_values = [];
    edit_input_elements = document.querySelectorAll("[class='edit_input']");
    if (edit_input_elements && edit_input_elements.length > 0) {
        edit_input_elements.forEach((edit_input_element) => {
            edit_inputs_data_keys.push(`${edit_input_element.name}`);
            edit_inputs_data_values.push(`${edit_input_element.value}`);
        });        
    }
    let edit_inputs_data_obj = Object.fromEntries(edit_inputs_data_keys.map((key, index) => [key, edit_inputs_data_values[index]]));
    
    updateContact(edit_inputs_data_obj)
}

function createDeleteContact(event) {
    let table_row_element = event.currentTarget.parentNode.parentNode;
    if (table_row_element) {
        let row_id = table_row_element.dataset.rowid;
        if (row_id) {
            if (delete_dialog) {
                let delete_dialog_message_element = delete_dialog.querySelector("h3[id='delete_dialog_message']");
                if (delete_dialog_message_element) {
                    delete_dialog_message_element.innerHTML = `Are you sure that you want to DELETE Id ${row_id}?`;
                    delete_dialog.showModal();
                    id_obj = {id:`${row_id}`};
                }
            }
        }
    }    
}   

function validate(form_type) { //validate for empty form fields
    let form = document.querySelector("form[id='"+form_type+"_dialog_form']");
    if (form) {
        if( form.name.value == "" ) {
            alert( "Please provide your Name!" );
            form.name.focus();
            return false;
         }
         if( form.phone.value == "" ) {
            alert( "Please provide your Phone!" );
            form.phone.focus();
            return false;
         }
         if( form.email.value == "" ) {
            alert( "Please provide your Email!" );
            form.email.focus();
            return false;
         }
         if( form.region.value == "" ) {
            alert( "Please provide your Region!" );
            form.region.focus();
            return false;
         }
    return true;
    } 
}

function showErrors(message) {
    alert(`${message}`);
}


