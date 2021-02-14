const botones = document.querySelector('#botones')
const nombreusuario = document.querySelector('#nombreusuario')
const ContenidoProtejido = document.querySelector('#ContenidoProtejido')
const formulario = document.querySelector("#formulario")
const inputChat = document.querySelector("#inputChat")

firebase.auth().onAuthStateChanged(user => {
    if(user){
        console.log(user)
        botones.innerHTML = /*html*/`
        <button class="bnt btn-outline-danger" id= 'btnCerrarSesion'>Cerrar Sesion</button>
        `
        nombreusuario.innerHTML = user.displayName
        cerrarSesion()
       
         formulario.classList= "input-group py-3 fixed-bottom container"
         contenidoChat(user)
    }else{
        console.log('no existe user')
        botones.innerHTML = /*html*/`
            <button class="bnt btn-outline-success mr-2" id= 'btnAcceder'>Acceder</button>
         `
         iniciarsesion()
         nombreusuario.innerHTML = 'Chat'
         ContenidoProtejido.innerHTML =/*html*/ `
         <p class="text-center lead mt-5">Debes iniciar sesion</p>
         `
         formulario.classList= "input-group py-3 fixed-bottom container d-none"
    }
})

const contenidoChat = (user) => {
    
    formulario.addEventListener("submit", (e) => {
        e.preventDefault()
        console.log(inputChat.value)

        if(!inputChat.value.trim()){
            console.log("input vacio")
            return
        }

        firebase.firestore().collection('chat').add({
          texto: inputChat.value,
          uid: user.uid,
          fecha: Date.now()  
        })
            .then(res => {console.log("mensaje guardado")})
            .catch(e => console.log(e))

        inputChat.value = ""   
    })

    firebase.firestore().collection("chat").orderBy('fecha')
    .onSnapshot(query =>{
        // console.log(query)
        ContenidoProtejido.innerHTML = ''
        query.forEach(doc => {
            console.log(doc.data())
            if(doc.data().uid === user.uid){
                ContenidoProtejido.innerHTML +=/*html*/ `
                <div class="d-flex justify-content-end">
                     <span class="badge rounded-pill bg-primary">${doc.data().texto}</span>
                </div>
                `
            }else{
                ContenidoProtejido.innerHTML +=/*html*/ `
                <div class="d-flex justify-content-start">
                    <span class="badge rounded-pill bg-secondary">${doc.data().texto}</span>
                 </div>
                `
            }
            ContenidoProtejido.scrollTop = ContenidoProtejido.scrollHeight
        })
    })

}

const cerrarSesion = () => {
    const btnCerrarSesion = document.querySelector('#btnCerrarSesion')
    btnCerrarSesion.addEventListener('click', () => {
        firebase.auth().signOut()   
    })
}

const iniciarsesion = () => {
    const btnAcceder = document.querySelector('#btnAcceder')
    btnAcceder.addEventListener('click', async() => {
        // console.log('me diste click  en acceder')
        try{
           const provider = new firebase.auth.GoogleAuthProvider() 
           await firebase.auth().signInWithPopup(provider)
        } catch (error){
            console.log(error)
        } 
    })
}