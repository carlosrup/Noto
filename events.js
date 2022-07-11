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
var index_to_restore = 0; // lo mismo que displayed note id
var text_area_is_disabled = false
// funcion create tag
var tag_text = '';
// funcion predict tag
// guarda las letras tecleadas para las tags
var chars = '';
// function list sugested 
// guarda la lista de tags sugerida
var filtered_list = [];
// guarda si el tag esta expandido
var expanded_div = undefined;


// click event
const mainDiv = document.getElementById('container');
const clickId = (event)=>{
    element = event.target;
    elementId = element.id;
    elementClass = element.className;

    if (elementId == 'menu'){
        if(noto_was_displayed == false) {
            menu_click_show(elementId)
            text_area_is_disabled = false;
            button_show_hide('hide', 'save_note')
            button_show_hide('hide', 'new_note')
            button_show_hide('hide', 'restore')
        }
        else if(noto_was_displayed){
            menu_click_show(elementId)
            button_show_hide('hide', 'save_note')
            button_show_hide('show', 'new_note')
            button_show_hide('hide', 'restore')
        }
        if(noto_was_displayed && note_is_trash){
            clear_textareas() 
            disable_textarea(false);
        }
        if(disable_textarea){
            disable_textarea(false);    
        }
    }
    if(elementId == 'trash'){
        menu_click_show(elementId)
        /* clear_textareas(); */
        disable_textarea(true);
        text_area_is_disabled = true;
        button_show_hide('hide', 'save_note')
        button_show_hide('hide', 'new_note')
        button_show_hide('hide', 'restore')
        
        if(note_is_trash){
            disable_textarea(false);
            text_area_is_disabled = false;
        }
    }
    if(elementId == 'tags_icon'){
        menu_click_show(elementId)
        create_tag_menu()
    }
    if (element.parentNode.className == 'titulo_y_texto'){
        let elementParent = element.parentNode;
        const note_id = elementParent.id;
        display_noto(note_id);
    }
    if (element.parentNode.className == 'delete'){
        event_erase_nota(element);
        clear_textareas(true);
        if(note_is_trash){
            disable_textarea(false);
            text_area_is_disabled = false;
            button_show_hide('hide', 'restore')
        };
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
        noto_was_displayed){
        note_is_trash = true;
        index_to_restore = element.parentNode.id;
        button_show_hide('show', 'restore')
        
    }
    if (element.parentNode.id == 'restore'){
        const note_to_be_restored = restore_trashed(index_to_restore);
        document.getElementById('trash').click();

    }
    if(elementId == 'tags_nota'){
        if(element.childElementCount == 0){
            element.innerText = '';
            create_tag_span(element);
            
            
        }
        else {
            create_tag_span(element);
            document.getElementById('tagId').focus();
        }
    }
    if(elementId == 'delete_tag'){
        delete_tag(element)
    }
    if(elementClass == 'sugested_tag_element'){
        select_predicted_tags(event, true)
    }console.log(document.getElementById('container_note'))
    
    if(document.getElementById('container_note')){
        if(element.id != 'tag'){
            const div_tag =document.getElementById('container_note').parentNode
            document.getElementById('container_note').remove()
            div_tag.style.cssText = `background-color: rgb(230, 227, 227);
                color: rgb(90, 88, 88);
                transition: 0.5s`;
            expanded_div = undefined;
        }
    }
    if(elementId == 'tag'){

        let div_tag = element;
        console.log(expanded_div)
        
        if(document.getElementById('container_note') &&
            expanded_div == div_tag){
            
            document.getElementById('container_note').remove()
            div_tag.style.cssText = `background-color: rgb(230, 227, 227);
                color: rgb(90, 88, 88);
                transition: 0.5s`;
            expanded_div = undefined;
        }
        
        else if (!document.getElementById('container_note') &&
            expanded_div == undefined) {

            expand_note_tag_list(div_tag)
            div_tag.style.cssText = `background-color: rgb(144, 140, 140);
                color: rgb(233, 231, 231)`
            expanded_div = div_tag;
        }
        else if (document.getElementById('container_note') &&
            expanded_div != div_tag){

            document.getElementById('container_note').remove()
            expanded_div.style.cssText = `background-color: rgb(230, 227, 227);
                color: rgb(90, 88, 88);
                transition: 0.5s`;
            
            expand_note_tag_list(div_tag)
            div_tag.style.cssText = `background-color: rgb(144, 140, 140);
                color: rgb(233, 231, 231)`;
            expanded_div = div_tag;
            }
            
    }
    
    
}
mainDiv.addEventListener('click', clickId);

const keyupId = (event)=>{
    element = event.target;
    elementId = element.id;
    elementClass = element.className;

    if (element.parentNode.id == 'main_area' || 
        element.parentNode.id == 'tags_nota' &&
        document.getElementById('titulo_nota').value != ''){
        button_show_hide('show', 'save_note');
        button_show_hide('hide', 'new_note');
        button_show_hide('hide', 'restore');
       
        if(noto_was_displayed){
            save_edited_note(displayed_note_id);
            button_show_hide('hide', 'save_note');
            button_show_hide('show', 'new_note');
            button_show_hide('hide', 'restore');
        }
    };
    
}
mainDiv.addEventListener('keyup', keyupId);

const keyDownId = (event)=>{
    element = event.target;
    elementId = element.id;
    elementClass = element.className;
    
    if (element.classList[0] == 'new_tag'){
        let key = event.code
        if (key == 'Space' || key == 'Enter'){
            console.log(element)
            element.blur();
            element.contentEditable = false;
            /* element.parentNode.click(); */ // click en tags nota
        };
    }    
    if (elementId == 'tagId'){
        const first_span = document.getElementById('tagId');
        create_tag_text(first_span, event)
        list_sugested_tag(first_span, event)
        jumpt_to_sugested_tags(event)
    }
    if(elementClass == 'sugested_tag_element'){
        select_predicted_tags(event, false)
    }
};
mainDiv.addEventListener('keydown', keyDownId);

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
    /* document.getElementById("predicted_tag").style.left = "22%"; */
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
    /* document.getElementById("predicted_tag").style.left = "6%"; */
    show = false
}

function menu_click_show(elementId) {
     
    switch(elementId){
        case 'menu' : lista = 'lista_notas';
        break;
        case 'trash' : lista = 'trash_list';
        break;
        case 'tags_icon' : lista = 'tags_list'
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
function display_noto(note_id) {
    
    displayed_note_id =note_id;
    new_note_clicked = false;
    noto_was_displayed = true

    get_property_from_Db(note_id).then((result)=>{
        const is_trash = result.trash
        
        if (is_trash == true){
            note_is_trash = true
            disable_textarea(true)
            text_area_is_disabled = true
            button_show_hide('hide', 'new_note');
            button_show_hide('hide', 'save_note');
            button_show_hide('show', 'restore');
        }
        else if(is_trash == false){
            note_is_trash = false;
            console.log('note is trash false')
            button_show_hide('hide','save_note');
            button_show_hide('hide','restore');
            button_show_hide('show','new_note');
        }
    });
    get_property_from_Db(note_id).then(function(result){
        document.getElementById('titulo_nota').value = result.titulo;
    });
    get_property_from_Db(note_id).then(function(result){
        document.getElementById('ppal_nota').value = result.texto;
    });
    get_property_from_Db(note_id).then(function(result){
        document.getElementById('tags_nota'). innerText= '';
        const div_tags = document.getElementById('tags_nota');
        if (result.tags != '' && result.tags != undefined){
            let words = result.tags.split(' ');
            words.forEach(word => {
                if (word != ''){
                    _span = create_tag_span(div_tags);
                    _span.innerText = word;
                    _span.className = 'new_tag' + ' ' + displayed_note_id;
                    _span.id = word
                    create_delete_tag_span(_span);
                    _span.contentEditable = false;
                    document.getElementById('ppal_nota').focus()
                }
            }); 
        }
        else{
            div_tags.innerText = 'Tags'
        }
    });
   
    // esconde boton save y muestra new note
    
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
    const tags = get_tags_displayed(id);
    
    autosave(id, titulo, texto, tags);
    add_note_to_DOM(id, titulo, texto, tags, 'lista_notas');
}
//guarda la nota cuando se da click en el botton save
function save_note () {
    new_note_clicked = false;
    const save_note_values = saveNotoToDb();
    console.log(save_note_values.tags)
    let [id, titulo, texto, tags]= [Number(save_note_values.id),
        save_note_values.titulo || '',
        save_note_values.texto || '', 
        save_note_values.tags || ''];
    if (titulo == ''){
        titulo = 'Untitled Noto'
    }
    else {
        titulo = save_note_values.titulo;
    }
    add_note_to_DOM(id, titulo, texto, tags, 'lista_notas')
    noto_was_displayed = false
}

// limpia text area cuando se clickea el boton new note
function new_note() {
    new_note_clicked = true;
    document.getElementById('ppal_nota').value = "";
    document.getElementById('titulo_nota').value = "";
    document.getElementById('tags_nota').innerHTML = "Tags";
    button_show_hide('hide', 'new_note');
    noto_was_displayed = false;
}

function create_tag_text (_span, event){
    key_code =  event.keyCode
    if ((key_code >= 48 && key_code <= 57) || 
        (key_code >= 65 && key_code <= 90) ||
        (key_code == 192)) 
        {
            tag_text += event.key
        };
    
    if (key_code == 8){
        tag_text = tag_text.slice(0,-1);
    };
    
    
    if((event.code == 'Space' || key_code == 13) && tag_text != ''){
        const new_tag = _span;
        new_tag.blur();
        new_tag.innerText = tag_text.trim();
        new_tag.id = tag_text;
        
        if(noto_was_displayed){
            new_tag.className = 'new_tag' + ' ' + displayed_note_id;
        }
        else {
            new_tag.className = 'new_tag' + ' ' + 0;
        };
        tag_text = '';   
        create_delete_tag_span(new_tag);
        element.contentEditable = true;
        document.getElementById('tags_nota').click();
        new_tag.contentEditable = false;
        create_tag_menu()
        
        if(noto_was_displayed){
            save_edited_note(displayed_note_id);
            button_show_hide('show', 'new_note')
            create_tag_menu();
        }
    }
}
function create_delete_tag_span (_span){
    const del = document.createElement('span');
    del.id = 'delete_tag';
    del.contentEditable = false
    del.className = 'material-icons-outlined';
    del.innerText = 'close'
    _span.appendChild(del);
}
function delete_tag(element){
    const _span = element.parentNode;
    const id = _span.classList[1];
    _span.remove();
    const word_to_delete = _span.id;
   
    
    get_property_from_Db(id).then((result)=>{
        let [titulo, texto, tags] = 
            [result.titulo, result.texto, result.tags];
        
        tags = tags.replace(word_to_delete, '');

        edit_note_property ('tags', tags, id)

            
        add_note_to_DOM(id, titulo, texto, tags, 'lista_notas');
         
    });
}

function get_tags_displayed (id){
   let tags_nodes;
   let tags = '';
    if(document.querySelectorAll('.' + CSS.escape(id)).length >0){
         tags_nodes = document.querySelectorAll('span' + '.'+CSS.escape(id));
    }
    else {
         tags_nodes =document.querySelectorAll('.'+CSS.escape(0));
    }
    
    tags_nodes.forEach(element=>{
        console.log(tags_nodes)
        let word = element.innerText;
            word = word.slice(0, word.length -5);
            word = word.replace(/^\s+|\s+$/gm,'');// quita espacios en blanco
            word = word.replace(/(\r\n|\r|\n)/g, '');// quita line break
            tags += word + ' ';
    });
    return tags
} 
async function predict_tag(span, event){
    const container = document.getElementById('predicted_tag');
    var used_tags_list = [];
    async function filtering (span, event){
        used_tags_list =  await create_tag_list()
        
        let character = event.key;
        
        if ((event.keyCode >= 48 && event.keyCode <= 57) || 
        (event.keyCode >= 65 && event.keyCode <= 90) ||
        (event.keyCode == 192)){
            chars += character;
            filtered_list = used_tags_list.filter
            (tag=> tag.slice(0, chars.length) == chars);
            return filtered_list
        }
        else if (event.keyCode == 8){            //backspace
            chars = chars.slice(0, chars.length - 1)
            if(chars == ''){
                container.style.display = 'none'
                console.log('backspace vacio', container)
                return filtered_list = [];
            }
            else {filtered_list = used_tags_list.filter
            (tag=> tag.slice(0, chars.length) == chars);
                
            return filtered_list
            }
        }
        else if (event.keyCode == 32 || event.keyCode == 13){   // space and enter
            chars = ''; 
            container.style.display = 'none'
            return filtered_list = [];
        }
        if(event && chars == ''){
            console.log('esta vacio chars')   
            container.style.display = 'none'
            return filtered_list = [];
        }
        span.addEventListener('click', (e)=>{  // clear chars if span is clicked again
            chars = ''
        });
    }
    return await filtering(span, event);
}
function list_sugested_tag(span, event){
    const container = document.getElementById('predicted_tag');
    const list = document.getElementById("list_sugested_tag");
    
    predict_tag(span, event).then(res=>{ 
        filtered_list = res;
        
        if(filtered_list.length > 0){
            list.innerHTML = '';
            filtered_list.forEach((tag, index)=>{
                const list_element = document.createElement('li')
                list_element.className = 'sugested_tag_element';
                list_element.tabIndex = index;
                list_element.innerText = tag;
                list.appendChild(list_element);
                container.style.display = 'flex'
            })
        }
        else {
            list.innerHTML = ''
            container.style.display = 'none'
        }
        const parent_width = container.parentElement.offsetWidth
        const list_heigth = container.offsetHeight;
        let new_left = '';
        let [left, top] = element_position(span)
        let left_correction = Number(screen.width)-(screen.width * 1.008) 
        
        top = String(Number(top) - Number(list_heigth) - 6)
        new_left = String(Number(left) + left_correction)
        
        container.style.left = new_left +'px'
        container.style.top = top + 'px'
    });
}
function element_position(element) {
    return [element.offsetLeft, element.offsetTop]
}
function jumpt_to_sugested_tags(event){
    const key = event.keyCode;
    const container = document.getElementById('predicted_tag');
    const ul = container.childNodes[1]
    const li_elements = ul.childNodes

    if(key == 38 && container.hasChildNodes){
            
            li_elements[li_elements.length - 1].focus() // focus on last element of ul
    }
}    
function select_predicted_tags(event, click){   
    const key = event.keyCode; 
    const container = document.getElementById('predicted_tag');
    const ul = container.childNodes[1]
    const li_elements = ul.childNodes
    const is_clicked = click;                                                                                                                                                                                   ;

    if(key == 38){
        const focused_li = document.activeElement;
        let actual_index = focused_li.tabIndex;
        
        if(actual_index > 0){
            li_elements[actual_index-1].focus()
        }
    }
    if(key == 40){
        const focused_li = document.activeElement;
        let actual_index = focused_li.tabIndex;
        
        if(actual_index < li_elements.length-1){
            li_elements[actual_index+1].focus()
        }
        if(actual_index == li_elements.length-1){
            document.getElementById('tagId').focus();
        }
    }
    if(key == 13 || key == 32 || is_clicked){
        tag_text = '';
        tag_text = document.activeElement.innerText;
        const new_tag = document.getElementById('tagId');
        new_tag.blur();
        new_tag.innerText = ''; 
        new_tag.innerText = tag_text.trim();
        new_tag.id = tag_text;
        
        if(noto_was_displayed){
            new_tag.className = 'new_tag' + ' ' + displayed_note_id;
        }
        else {
            new_tag.className = 'new_tag' + ' ' + 0;
        };
        tag_text = '';   
        create_delete_tag_span(new_tag);
        element.contentEditable = true;
        document.getElementById('tags_nota').click();
        new_tag.contentEditable = false;
        create_tag_menu();
        
        if(noto_was_displayed){
            save_edited_note(displayed_note_id);
            button_show_hide('show', 'new_note')
            create_tag_menu();
        }
        container.style.display = 'none'
        chars = '';
        if(chars == ''){
        document.getElementById('tagId').innerHTML = ''
        }
    }
}
