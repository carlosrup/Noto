
//guarda el texto de la nota

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
let saveNotoTags = () => {
    if (document.getElementById("tags_nota").value.trim() != ''){
        const tags = document.getElementById("tags_nota").value;
        return tags
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
    const tags = saveNotoTags();

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
    divTags.className = 'Tags';
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

    divTitText.appendChild(divDelete);
    divTitText.appendChild(divTitulo);
    divTitText.appendChild(divTexto);
    /* divTitText.appendChild(divTags); */

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
    document.getElementById('titulo_nota').value = '';
    document.getElementById('ppal_nota').value = '';
    document.getElementById('tags_nota').value = '';
}
function disable_textarea (state) {
    document.getElementById('titulo_nota').disabled = state;
    document.getElementById('ppal_nota').disabled = state;
    document.getElementById('tags_nota').disabled = state;
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
                        

                        divTitText = document.createElement('div');
                        divTitulo = document.createElement('div');
                        divTexto = document.createElement('div');
                        divDelete = document.createElement('div');
                        
                        divTitulo.className = 'lista_titulo';
                        divTexto.className = 'lista_texto';
                        divTitText.className = 'titulo_y_texto'
                        divTitText.id = id
                        divDelete.className = 'delete'

                        nodoTitulo = document.createTextNode(titulo)
                        nodoTexto = document.createTextNode(texto)

                        divDelete.innerHTML = 
                            `<span class="material-icons-outlined">close</span>
                            <span id="delete_note" class="tooltip_delete">Delete</span>`
                            
                        divTitulo.appendChild(nodoTitulo)
                        divTexto.appendChild(nodoTexto)

                        divTitText.appendChild(divDelete)
                        divTitText.appendChild(divTitulo)
                        divTitText.appendChild(divTexto)
                        
                        lista_notas.appendChild(divTitText)
                    }
                    else {
                        titulo = data_cursor.value.titulo
                        texto = data_cursor.value.texto
                        id = data_cursor.value.idDb
                        

                        divTitText = document.createElement('div');
                        divTitulo = document.createElement('div');
                        divTexto = document.createElement('div');
                        divDelete = document.createElement('div');
                        /* divRestore = document.createElement('div'); */

                        divTitulo.className = 'lista_titulo';
                        divTexto.className = 'lista_texto';
                        divTitText.className = 'titulo_y_texto'
                        divTitText.id = id
                        divDelete.className = 'delete'
                        /* divRestore.className = 'restore' */

                        nodoTitulo = document.createTextNode(titulo)
                        nodoTexto = document.createTextNode(texto)

                        divDelete.innerHTML = 
                            `<span id="delete_note" class="material-icons-outlined">close</span>
                            <span class="tooltip_delete">Delete</span>`
                        
                        /* divRestore.innerHTML = 
                            `<input type='radio' name='delete_restore' value='selected'>` */
                            
                        divTitulo.appendChild(nodoTitulo)
                        divTexto.appendChild(nodoTexto)

                        /* divTitText.appendChild(divRestore) */
                        divTitText.appendChild(divDelete)
                        divTitText.appendChild(divTitulo)
                        divTitText.appendChild(divTexto)
                        
                        trash_list.appendChild(divTitText)
                        
                    }
                data_cursor.continue();
            }
        }
    }  
}
retrieve_notas()

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
// autosave se ejecuta cada 5 segundos
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
            var data = e.target.result
            data.trash = 'false'; 
            
            [index, titulo, texto, tags] = [data.idDb, data.titulo, data.texto, data.tags]
            
            store.put(data)  
            add_note_to_DOM(index, titulo, texto, tags, 'lista_notas');
        }
    }
   
}
