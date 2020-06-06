class message {
    static showMessage(message, cssClass, redirect) {
        const div = document.createElement('div');
        div.className = `alert alert-${cssClass} mt-3`;
        div.appendChild(document.createTextNode(message));
        //mostrando en el DOM
        const container = document.getElementById('contenedor');
        const app = document.querySelector('#App');
        container.insertBefore(div, app);
        setTimeout( () => {
            document.querySelector('.alert').remove();
        }, 1000)
    }

    static errorMessage(errors) {
        document.querySelectorAll('.text-danger').forEach(span => span.innerHTML = '');
        errors.forEach(error => {
            const [key, value] = error.split(':').map(err => err.trim())
            document.getElementById(`${key}Error`).innerHTML = value
        })
    }
}

class Modal {
    constructor(titulo, texto) {
        this.titulo = titulo || 'Confirmar Edicion'
        this.texto = texto || '¿Estas seguro de esto?'
        this._modal();
    }

    _modal() {
        let mascara = document.getElementById('lamascara');
        mascara.style.display = "block";
        document.getElementById('titulo-modal').innerHTML = this.titulo;
        document.querySelector('#panelResultados').innerHTML = this.texto;
    }

    confirm() {
        return new Promise((resolve, reject) => {
            const btnCerrar = document.getElementById('cerrarModal');
            btnCerrar.addEventListener("click", () => {
                document.getElementById('lamascara').style.display = "none";
                resolve(false);
            });
            const btnAceptar = document.getElementById('aceptarModal');
            btnAceptar.addEventListener("click", () => {
                document.getElementById('lamascara').style.display = "none";
                resolve(true);
            });
        });
    }
}

export { message, Modal };