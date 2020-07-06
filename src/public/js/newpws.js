import { message, Modal } from './message.js'

window. onload = () => {
    const btnPass = document.getElementById('btn-pass')
    btnPass.addEventListener('click', async (e) => {
        const modal = new Modal('CAMBIAR PASSWORD', '¿Seguro desea cambiar se password?')
        const acept = await modal.confirm();
        if (acept) {
            newPass(e.target.getAttribute('data-id'))
        }
    })
}

const newPass = async (id) => {
    const passwordActual = document.getElementById('passwordActual').value
    const nuevaPass = document.getElementById('nuevaPass').value
    const repNuevaPass = document.getElementById('repNuevaPass').value
    const pass = await fetch("/users/newpass/" + id, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}, 
        body: JSON.stringify({ passwordActual, nuevaPass, repNuevaPass})
    });
    const res = JSON.parse(await pass.text());
    message.showMessage(res.message, res.css);
    if(res.type) setTimeout( () => { location.reload() }, 1000)
}