const Contact = {"id":"", "name":"", "phone":"", "email":"", "region":""};

//Get all api call
async function getAll() {
    const http_response = await fetch('http://localhost:3030/contacts');
    return await http_response.json();
}

document.addEventListener('DOMContentLoaded', (event) => {
    refreshTable();    
});

async function postCreateNew(new_inputs_data_obj) {
    const create_new_url = 'http://localhost:3030/contacts';
    const response = await fetch(create_new_url, {
        method: "POST",
        mode: "same-origin",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json",
        },
        referrerPolicy: "no-referrer",
        body: JSON.stringify(new_inputs_data_obj)
    });
    console.log('post response status: ', response.status);
}

function refreshTable() {
    getAll().then((data) => {
        const data_map = new Map(Object.entries(data));
        let trHTML = '';
        //let data_obj = JSON.parse(data);
        data_map.forEach((value, key) => {
            trHTML += '<tr>';
            trHTML += '<td>'+value.id+'</td>';
            trHTML += '<td>'+value.name+'</td>';
            trHTML += '<td>'+value.phone+'</td>';
            trHTML += '<td>'+value.email+'</td>';
            trHTML += '<td>'+value.region+'</td>';
            trHTML += '<td><button type="button" class="btn btn-outline-secondary" onclick="showUserEditBox('+value.id+')">Edit</button>';
            trHTML += '<button type="button" class="btn btn-outline-danger" onclick="userDelete('+value.id+')">Del</button></td>';
            trHTML += "</tr>";
        });
        document.getElementById("mytable").innerHTML = trHTML;
    });
}

function createNewContact() {
    let new_inputs_data_keys = [];
    let new_inputs_data_values = [];
    new_input_elements = document.querySelectorAll("[class='new_input']");
    if (new_input_elements && new_input_elements.length > 0) {
        //let new_inputs_arr = Array.from(new_input_elements);
        new_input_elements.forEach((new_input_element) => {
            new_inputs_data_keys.push(`${new_input_element.name}`);
            new_inputs_data_values.push(`${new_input_element.value}`);
        });
        /* new_inputs_arr.every((element, index, new_inputs_arr) => {
            new_inputs_data.push(element.value);
        }); */
    }
    let new_inputs_data_obj = Object.fromEntries(new_inputs_data_keys.map((key, index) => [key, new_inputs_data_values[index]]));
    //let new_inputs_json = JSON.stringify(new_inputs_data);
    postCreateNew(new_inputs_data_obj);
}

let new_dialog = document.querySelector("dialog[id='new_dialog']");
if (new_dialog) {

}

let new_save_button = document.querySelector("button[id='new_save_button']");
let new_contact_form = document.querySelector("form[id='new_dialog_form']");
if (new_contact_form) {
    new_contact_form.addEventListener('submit', (event) => {event.preventDefault();}, false);
}
if (new_save_button) {
    new_save_button.addEventListener('click', (event) => {
        if (validate()) {
            event.preventDefault();
            createNewContact();
            new_dialog.close();
            refreshTable();
            new_contact_form.reset();
        }        
    });
}

let new_cancel_button = document.querySelector("button[id='new_cancel_button']");
if (new_cancel_button) {
    new_cancel_button.addEventListener('click', () => {
        new_dialog.close();
    });
}

let add_button = document.querySelector("button[id='new_contact_button']");
if (add_button) {
    add_button.addEventListener('click', () => {
        new_dialog.showModal();
    });
}

function validate() {
        if( document.new_dialog_form.name.value == "" ) {
            alert( "Please provide your Name!" );
            document.new_dialog_form.name.focus();
            return false;
         }
         if( document.new_dialog_form.phone.value == "" ) {
            alert( "Please provide your Phone!" );
            document.new_dialog_form.phone.focus();
            return false;
         }
         if( document.new_dialog_form.email.value == "" ) {
            alert( "Please provide your Email!" );
            document.new_dialog_form.email.focus();
            return false;
         }
         if( document.new_dialog_form.region.value == "" ) {
            alert( "Please provide your Region!" );
            document.new_dialog_form.region.focus();
            return false;
         }
    return true;
}


