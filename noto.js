
// var globales
// guarda el resultado de onsucces en get note property
var property_value = 0;
// funcion create_tag_list
var tag_list = [];
let saveNotoText = () => {
    if (document.getElementById("ppal_nota").value.trim() != ''){
        
        const texto = document.getElementById("ppal_nota").value;
        return texto
    } 
}    

// guarda el titulo de la nota
let saveNotoTitle = () => {
    if (document.getElementById("titulo_nota").value.trim() != ''){
        const titulo = document.getElementById("titulo_nota").value;
        return titulo
    } 
}
 
// guarda el tag de la nota
let saveNotoTags = (id) => {
   
    if (document.getElementById("tags_nota").innerHTML != 'Tags'){
        let tags = get_tags_displayed(id)
        console.log(document.getElementById("tags_nota"))
        return tags;
    } 
}
//********************aca empieza indexedDB*************************

//segun el browser que se tenga se usan diferentes Api que soporten indexedDb
window.indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!window.indexedDB) {
    alert(" El browser no soporta indexedDB");
}

// Inicializa la DB 

const request = indexedDB.open("noto", 1);

request.onerror = function (event) {
    console.error(`Ha ocurrido un error con la base de datos ${event.target.error}`);
};

request.onupgradeneeded = function (event) {
    
    let db = event.target.result;
    let store = db.createObjectStore('nota', {keyPath: "idDb"});
    store.createIndex("idDb", "idDb", {unique : true});
    store.createIndex("titulo", "titulo", {unique : false}); 
    store.createIndex("texto", "texto", {unique : false});
    store.createIndex("tags", "tags", {unique : false});
    store.createIndex("trash", "trash", {unique : false});
    
};

request.onsuccess = (event) => {
    const db = event.target.result;
    console.log("Se creo la base de datos satisfactoriamente")
}


//  guarda la nota en la db
function saveNotoToDb() {
    let note_id;
    const db = request.result;

    const txn = db.transaction("nota", "readwrite");
    const store = txn.objectStore("nota");
    
    note_id = Date.now();
    const titulo = saveNotoTitle();
    const texto = saveNotoText();
    const tags = saveNotoTags(note_id);
    if (tags == undefined){
        const tags = ''
    }
    
    console.log(tags)
    let query = store.add({idDb: note_id, titulo: titulo, texto: texto, tags: tags, trash:'false' });

    query.onSuccess = function(event) {
        console.log(event);
    }
    query.onerror = function(event) {
        console.log("Hay un error añadiendo la nota" + event.target.errorCode);
    }  
    txn.oncomplete = function () {
    console.log("La transaccion se completo exitosamente");
    
    /* add_note_to_DOM(note_id,titulo,texto,tags, 'lista_notas') */
    }
    return {id: note_id, titulo: titulo, texto: texto, tags: tags}
};

// leer datos de la base, Todos los Datos a la vez, carga la Lista Notas al DOM

function add_note_to_DOM (id, titulo, texto, tags, list) {
    
    
    const note_to_be_saved = document.getElementById(`${id}`)
   
    if (note_to_be_saved != null){
        
        note_to_be_saved.remove();
    }
    
    divTitText = document.createElement('div');
    divTitulo = document.createElement('div');
    divTexto = document.createElement('div');
    divTags = document.createElement('div');
    divDelete = document.createElement('div');
    
    divTitulo.className = 'lista_titulo';
    divTexto.className = 'lista_texto';
    divTags.className = 'tags';
    divTitText.className = 'titulo_y_texto'
    divTitText.id = id
    divDelete.className = 'delete'

    nodoTitulo = document.createTextNode(titulo);
    nodoTexto = document.createTextNode(texto);
    nodoTags = document.createTextNode(tags);

    divDelete.innerHTML = 
        `<span class="material-icons-outlined">close</span>
        <span id="delete_note" class="tooltip_delete">Delete</span>`
        
    divTitulo.appendChild(nodoTitulo);
    divTexto.appendChild(nodoTexto);
    divTags.appendChild(nodoTags);

    divTags.style.display = 'none'

    divTitText.appendChild(divDelete);
    divTitText.appendChild(divTitulo);
    divTitText.appendChild(divTexto);
    divTitText.appendChild(divTags);
    
    const lista = document.getElementById(list)
    lista.insertBefore(divTitText, lista.children[1])
}

function delete_note_DOM (id) {
    const note_to_be_deleted = document.getElementById(`${id}`)

    if (note_to_be_deleted != null){
        note_to_be_deleted.remove();
    }
}
function clear_textareas (){
    noto_was_displayed = false;
    document.getElementById('titulo_nota').value = '';
    document.getElementById('ppal_nota').value = '';
    document.getElementById('tags_nota').innerHTML = 'Tags';
}
function disable_textarea (state) {
    document.getElementById('titulo_nota').disabled = state;
    document.getElementById('ppal_nota').disabled = state;
    if (state){
        text_area_is_disabled = true;
        document.getElementById('tags_nota').style.pointerEvents = 'none'; 
        document.getElementById('tags_nota').style.color = '#808182';
        document.getElementById('tags_nota').style.backgroundColor = '#efefef';
    }
    else {
        text_area_is_disabled = false;
        document.getElementById('tags_nota').style.pointerEvents =  'auto';
        document.getElementById('tags_nota').style.color = '#6b6868';
        document.getElementById('tags_nota').style.backgroundColor = 'white'
    }
    
}

function retrieve_notas () {
    
    const request = indexedDB.open("noto", 1);
    
    request.onsuccess = (event) => {
        var db = event.target.result;
        
        data = db.transaction("nota")
            .objectStore("nota")
            .index("idDb")
            .openCursor(null, 'prev');

        data.onsuccess = (ev) => {
            
            data_cursor = ev.target.result;
            let titulo, texto, divTitText, divTitulo, divTexto, nodoTitulo, id
            
            // crea la estructura que muestra la informacion de la db
            
            if (data_cursor){
                    if (data_cursor.value.trash == 'false'){    
                       
                        titulo = data_cursor.value.titulo
                        texto = data_cursor.value.texto
                        id = data_cursor.value.idDb
                        tags = data_cursor.value.tags

                        divTitText = document.createElement('div');
                        divTitulo = document.createElement('div');
                        divTexto = document.createElement('div');
                        divDelete = document.createElement('div');
                        divTags = document.createElement('tags');
                        
                        divTitulo.className = 'lista_titulo';
                        divTexto.className = 'lista_texto';
                        divTitText.className = 'titulo_y_texto'
                        divTitText.id = id
                        divDelete.className = 'delete'
                        divTags.className = 'tags';

                        nodoTitulo = document.createTextNode(titulo)
                        nodoTexto = document.createTextNode(texto)
                        nodoTags = document.createTextNode(tags)

                        divDelete.innerHTML = 
                            `<span class="material-icons-outlined">close</span>
                            <span id="delete_note" class="tooltip_delete">Delete</span>`
                            
                        divTitulo.appendChild(nodoTitulo);
                        divTexto.appendChild(nodoTexto);
                        divTags.appendChild(nodoTags);
                        divTags.style.display = 'none';

                        divTitText.appendChild(divDelete);
                        divTitText.appendChild(divTitulo);
                        divTitText.appendChild(divTexto);
                        divTitText.appendChild(divTags);
                        
                        lista_notas.appendChild(divTitText);
                    }
                    else {
                        titulo = data_cursor.value.titulo
                        texto = data_cursor.value.texto
                        id = data_cursor.value.idDb
                        tags = data_cursor.value.tags

                        divTitText = document.createElement('div');
                        divTitulo = document.createElement('div');
                        divTexto = document.createElement('div');
                        divDelete = document.createElement('div');
                        divTags = document.createElement('tags');

                        divTitulo.className = 'lista_titulo';
                        divTexto.className = 'lista_texto';
                        divTitText.className = 'titulo_y_texto'
                        divTitText.id = id
                        divDelete.className = 'delete'
                        divTags.className = 'tags';

                        nodoTitulo = document.createTextNode(titulo)
                        nodoTexto = document.createTextNode(texto)
                        nodoTags = document.createTextNode(tags)

                        divDelete.innerHTML = 
                            `<span id="delete_note" class="material-icons-outlined">close</span>
                            <span class="tooltip_delete">Delete</span>`
                        
                        /* divRestore.innerHTML = 
                            `<input type='radio' name='delete_restore' value='selected'>` */
                            
                        divTitulo.appendChild(nodoTitulo)
                        divTexto.appendChild(nodoTexto)
                        divTags.appendChild(nodoTags);
                        divTags.style.display = 'none';

                        /* divTitText.appendChild(divRestore) */
                        divTitText.appendChild(divDelete)
                        divTitText.appendChild(divTitulo)
                        divTitText.appendChild(divTexto)
                        divTags.appendChild(nodoTags);

                        trash_list.appendChild(divTitText)
                        
                    }
                data_cursor.continue();
            }
        }
    }  
}
retrieve_notas()

async function list_all_tags (){
    
    return new Promise ((resolve)=>{  
            
        const request = indexedDB.open("noto", 1);
        
        request.onsuccess = (event) => {
            var db = event.target.result;
            
            data = db.transaction("nota")
                .objectStore("nota")
                .index("idDb")
                .openCursor(null, 'prev');

            let dict_of_tags_id = [];    
        
            data.onsuccess = (ev) => {
                
                data_cursor = ev.target.result;
              
                if (data_cursor && data_cursor.value.trash == 'false'){
                    
                    id = data_cursor.value.idDb
                    tags = data_cursor.value.tags
                    
                    if (tags != undefined){
                        tag = tags.split(' ')
                        
                        tag.forEach((tag, index)=>{
                            if(tag != ''){
                                
                                if(!dict_of_tags_id[tag]){
                                    dict_of_tags_id[tag] = []
                                }
                                dict_of_tags_id[tag].push(id);
                            }   
                        })
                    }
                data_cursor.continue();
                }
                else {
                    return resolve(dict_of_tags_id)
                }
            } 
        }
    });
}


function create_tag_menu (){
    let tags_object;
    
    list_all_tags().then(result=>{
        tags_object = result
        let alpha_order, ordered;
        const to_array = Object.entries(tags_object);
        alpha_order = to_array.sort((a, b)=>{
            if(a[0] < b[0]){
                return -1}
            if(a[0] > b[0]){
                return 1}
            if(a[0] == b[0]){
                    return 0}
        });
        ordered = alpha_order.sort((a, b)=>{
           return  b[1].length - a[1].length
        });
    
        // erase nodes in tags_list
        document.getElementById('tags_list')
            .innerHTML = `<div class="all_notes titulo_y_texto unique_tags_list">Tags</div>`
        
        
        // creates new nodes
        ordered.forEach((element)=>{    // element[0] is the tag value element[1] are the ids
            divTags = document.createElement('div');
            divTags.classList.add('tag_listed');
            
            element[1].forEach((element)=>{
                divTags.classList.add(element);
            });

            divTags.id = 'tag';
            tagNode = document.createTextNode(element[0]);
            divTags.appendChild(tagNode);
            tags_list.appendChild(divTags);
        });
    });
}
create_tag_menu()

function expand_note_tag_list (tag_listed){
    const list = tag_listed.classList;
    const expansion_div = document.createElement('div');

    list.forEach((id)=>{
        if(id != 'tag_listed'){
            get_property_from_Db(id).then(result => {
                const data = result;
                const titulo = data.titulo;
                const texto = data.texto;
                
                divTituloyTexto = document.createElement('div');
                divTitulo = document.createElement('div');
                divTexto = document.createElement('div');
                
                divTituloNode = document.createTextNode(titulo);
                divTextNode = document.createTextNode(texto);
                
                divTitulo.appendChild(divTituloNode);
                divTexto.appendChild(divTextNode);
                
                divTituloyTexto.appendChild(divTitulo);
                divTituloyTexto.appendChild(divTexto);

                expansion_div.appendChild(divTituloyTexto);
                
                expansion_div.id = 'container_note'
                divTituloyTexto.id = id;
                divTituloyTexto.className = 'titulo_y_texto'
                divTitulo.className = 'lista_titulo';
                divTexto.className = 'lista_texto';

                
                tag_listed.appendChild(expansion_div)
                
            });
        }
    });

}
function erase_nota (id) {
    const request = indexedDB.open("noto", 1);
    
    request.onsuccess = (event) => {
        var db = event.target.result;
        
        data = db.transaction("nota", 'readwrite')
            .objectStore("nota")
            .index("idDb")
            .openCursor(null, 'prev');
            
        data.onsuccess = (e) => {
            
            data_cursor = e.target.result;
            
            if (data_cursor) {
                if (data_cursor.value.idDb == id 
                    && data_cursor.value.trash == 'false'){
                    
                    update_data = data_cursor.value;
                    update_data.trash = "true";
                    
                    const request = data_cursor.update(update_data);
                    add_note_to_DOM(id, 
                        update_data.titulo || '', 
                        update_data.texto || '',
                        update_data.tags || '',
                        'trash_list')
                    }
                else if (data_cursor.value.idDb == id 
                    && data_cursor.value.trash == 'true'){
                    const request = data_cursor.delete(id)
                    delete_note_DOM(id)
                    }
            data_cursor.continue();
            }
        }

    }
}
// autosave se ejecuta cada keyup
function autosave (id,titulo, texto, tags){
    
    const request = indexedDB.open("noto", 1);
    
    request.onsuccess = (event) => {
        var db = event.target.result;
        
        var store = db.transaction("nota", 'readwrite')
            .objectStore("nota")
        
        var request = store.get(Number(id));
        request.onerror = (e)=>{
            console.log('Error en autosave' + e)
        }
        request.onsuccess = (e)=>{
            var data = e.target.result
            data.titulo = titulo;
            data.texto = texto;
            data.tags = tags; 
           
            store.put(data)  
        }
    }
  
}
// restaura la nota que esta en la Trash

function restore_trashed (id) {
    const request = indexedDB.open("noto", 1);
    var index, titulo, texto, tags =''
    request.onsuccess = (event) => {
        var db = event.target.result;
        
        var store = db.transaction("nota", 'readwrite')
            .objectStore("nota")
        
        var request = store.get(Number(id));
        
        request.onerror = (e)=>{
            console.log('Error en restore trashed' + e)
        }
        request.onsuccess = (e)=>{
            var data = e.target.result;
            console.log(id)
            data.trash = 'false'; 
            
            [index, titulo, texto, tags] = [data.idDb, data.titulo, data.texto, data.tags]
            
            store.put(data)  
            add_note_to_DOM(index, titulo, texto, tags, 'lista_notas');
        }
    }
    return (index, titulo, texto, tags)
}
function create_tag_span(parent_of_span){
    
    const _span = document.createElement("span");
        
    _span.contentEditable = true;
    _span.id = 'tagId';
    _span.className = 'empty_span';
    
       
    
    const existing_span = parent_of_span.childNodes;
    const last_span = existing_span[existing_span.length -1]
    
    if(existing_span.length > 0){
        if(last_span.id == 'tagId'){
            
            last_span.innerHTML = ''
            
        }
        else {
                       
            parent_of_span.appendChild(_span);
            document.getElementById('tagId').focus(); 
            
        }
    }
    else {
        parent_of_span.appendChild(_span);
        document.getElementById('tagId').focus();
    }
    return _span
}

function edit_note_property (property, value, id){
    const request = indexedDB.open("noto", 1);
    request.onsuccess = (event) => {
        var db = event.target.result;
        
        var store = db.transaction("nota", 'readwrite')
            .objectStore("nota")
        
        var request = store.get(Number(id));
        
        request.onerror = (e)=>{
            console.log('Error en edit_note_property' + e)
        }
        request.onsuccess = (e)=>{
            console.log('entro en la fun edit note poprerty')
            var data = e.target.result;
            console.log(data[property])
            data[property] = value;; // es tag, titulo o nota
            store.put(data)  
            
        }
    }
};
function get_property_from_Db (id){
    return new Promise (function(resolve){
        const request = indexedDB.open("noto", 1);
        request.onsuccess = (event) => {
            var db = event.target.result;
            var store = db.transaction("nota", 'readwrite')
                .objectStore("nota")
            var request = store.get(Number(id));
            
            request.onerror = (e)=>{
                console.log('Error en restore trashed' + e)
            }
            request.onsuccess = (e)=>{
                var data = e.target.result;
                let properties = {};
                [properties['titulo'], properties['texto'], 
                properties['tags'], properties['trash']] =
                [data.titulo, data.texto, data.tags, data.trash]
                return resolve(properties);
            };
        }
    });
}


function create_tag_list(){
    return new Promise (function(resolve){  
    let unique_tags = [];
    const request = indexedDB.open("noto", 1);
        request.onsuccess = (event) => {
            
            var db = event.target.result;
            data = db.transaction("nota", 'readwrite')
                .objectStore("nota")
                .index("tags")
               .getAll();
                
            data.onsuccess = (e) => {
                    
                resultado = e.target.result
                resultado.forEach(res=>{
                    tag_list.push(res.tags)
                });
                tag_list.forEach(tags =>{
                    if(tags != ''){
                        tags.split(' ').forEach(word=>{
                            if(word != ''){
                            unique_tags.push(word)
                            }
                        });
                    }
                })
                unique_tags = [...new Set(unique_tags)]
                return  resolve(unique_tags)
                    
            }
        }
    });
}
