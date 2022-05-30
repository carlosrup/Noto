// var globales

// funcion menu_click_show
var show = false; 
var opened_list= ''; 
var lista = '';
// funcion display_note
var noto_was_displayed = false
var note_is_trash = false
var displayed_note_id = 0;
// funcion new note
var new_note_clicked = false
// funcion restore
var index_to_restore = 0;
var text_area_is_disabled = false

// click event
const mainDiv = document.getElementById('container');
const clickId = (event)=>{
    element = event.target;
    elementId = element.id;
    elementClass = element.className;

    if (elementId == 'menu' || elementId == 'trash'){
        menu_click_show(elementId)
        disable_textarea(false)
        button_show_hide('hide', 'save_note')
        button_show_hide('hide', 'new_note')
        button_show_hide('hide', 'restore')
        clear_textareas()
    }
    if (element.parentNode.className == 'titulo_y_texto'){
        let elementParent = element.parentNode;
        const parentId = elementParent.parentNode.id;
        display_noto(elementParent, parentId);
    }
    if (element.parentNode.className == 'delete'){
        event_erase_nota(element);
    }
    if(element.parentNode.id == 'save_note'){
        save_note();
        button_show_hide('hide', 'save_note')
        button_show_hide('show', 'new_note')
    }
    if(element.parentNode.id == 'new_note'){
        new_note();
    }
    if (element.parentNode.parentNode.id == 'trash_list' &&
        noto_was_displayed &&
        note_is_trash){
        index_to_restore = element.parentNode.id;
        button_show_hide('show', 'restore');
    }
    if (element.parentNode.id == 'restore'){
        console.log(restore_trashed(index_to_restore))
        button_show_hide('hide', 'restore');
        clear_textareas()
    }
    
}
mainDiv.addEventListener('click', clickId);

const keyupId = (event)=>{
    element = event.target;
    elementId = element.id;
    elementClass = element.className;

    if (element.parentNode.id == 'main_area'){
        button_show_hide('show', 'save_note');
        
        if (noto_was_displayed && 
            new_note_clicked == false){
            save_edited_note(displayed_note_id);
        }
    }
}
mainDiv.addEventListener('keyup', keyupId);

// muestra y esconde la lista de notas o la lista trash
//recibe como argumento lista_notas o trash_list

function show_list (lista){
    document.getElementById("main_area").style.transition = "0.3s";
    document.getElementById(lista).style.transition = "0.5s";
    document.getElementById("titulo_nota").style.transition = "0.3s";
    document.getElementById("ppal_nota").style.transition = "0.3s";
    document.getElementById("tags_nota").style.transition = "0.3s";
    document.getElementById("underlying_div").style.transition = "0.3s";

    document.getElementById(lista).style.top = "2vh";
    document.getElementById("titulo_nota").style.width = "78%";
    document.getElementById("ppal_nota").style.width = "78%";
    document.getElementById("tags_nota").style.width = "78%";
    document.getElementById("main_area").style.left = "20%";
    document.getElementById("underlying_div").style.left = "-27vw";
    show = true
}
function hide_list(lista) {
    document.getElementById("main_area").style.transition = "0.3s";
    document.getElementById(lista).style.transition = "0.5s";
    document.getElementById("main_area").style.transition = "all 0.3s 0.3s"; 
    document.getElementById("titulo_nota").style.transition = "all 0.3s 0.3s";
    document.getElementById("ppal_nota").style.transition = "all 0.3s 0.3s";
    document.getElementById("tags_nota").style.transition = "all 0.3s 0.3s";
    document.getElementById("underlying_div").style.transition = "all 0.3s 0.3s";
    
    document.getElementById(lista).style.top = "-100vh";
    document.getElementById("titulo_nota").style.width = "100%";
    document.getElementById("ppal_nota").style.width = "100%";
    document.getElementById("tags_nota").style.width = "100%";
    document.getElementById("main_area").style.left = "0%";
    document.getElementById("underlying_div").style.left = "-7vw";
    show = false
}

function menu_click_show(elementId) {
     
    switch(elementId){
        case 'menu' : lista = 'lista_notas';
        break;
        case 'trash' : lista = 'trash_list';
        break;
        default: lista = null;
    }
    if (lista){
        if (show == true && lista != opened_list){
            hide_list(opened_list);
            show_list(lista);
            opened_list = lista;
            show = true;
        }
        else if (show == true && lista == opened_list){
            hide_list(lista);
            opened_list;
            show = false
        }
        else if (show == false) {
            show_list(lista);
            opened_list = lista;
            show = true;
        }
    }
}
function button_show_hide(state, button){
    if (state == 'show'){
        document.getElementById(button).style.visibility = 'visible';
        document.getElementById(button).style.opacity = '1';
    }
    else {
        document.getElementById(button).style.visibility = 'hidden';
        document.getElementById(button).style.opacity = '0';
    }
}
// abre la nota de la lista en el area principal
function display_noto(elementParent, parentId) {
    
    displayed_note_id =elementParent.id;
    new_note_clicked = false;
    noto_was_displayed = true

    const length_array = elementParent.children.length;
    let titulo = elementParent.children[length_array -2].innerText;
    let texto = elementParent.children[length_array -1].innerHTML;
        
    document.getElementById('titulo_nota').value = titulo;
    document.getElementById('ppal_nota').value = texto;
            // esconde boton save y muestra new note
    button_show_hide('hide','save_note')
    button_show_hide('show','new_note')

    if (parentId == 'trash_list'){
        note_is_trash = true
        disable_textarea(true)
    }
}

// borra la nota seleccionada
function event_erase_nota (element){
      
        let elementParent = element.parentNode;
        id = elementParent.parentNode.id;
                       
        console.log("This nota is going to be deleted " + Number(id)) 
        erase_nota(Number(id)) // convierte ei index trash en true
        
        
}

// guarda la nota que se edita
function save_edited_note(id){
    
    const titulo = document.getElementById('titulo_nota').value;
    const texto = document.getElementById('ppal_nota').value;
    const tags = document.getElementById('tags_nota').value;
    
    autosave(id, titulo, texto, tags);
    add_note_to_DOM(id, titulo, texto, tags, 'lista_notas');
}
//guarda la nota cuando se da click en el botton save
function save_note () {
    new_note_clicked = false;
    let [id, titulo, texto, tags]= [Number(saveNotoToDb().id),
        saveNotoToDb().titulo || '',
        saveNotoToDb().texto || '', 
        saveNotoToDb().tags || ''];
        
    add_note_to_DOM(id, titulo, texto, tags, 'lista_notas')
    noto_was_displayed = false
}

// limpia text area cuando se clickea el boton new note
function new_note() {
    new_note_clicked = true;
    document.getElementById('ppal_nota').value = "";
    document.getElementById('titulo_nota').value = "";
    button_show_hide('hide', 'new_note')
}