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
        }, 1500)
    }

    static errorMessage(errors) {
        document.querySelectorAll('.mensaje-error').forEach(span => span.innerText = '');
        errors.forEach(error => {
            const [key, value] = error.split(':').map(err => err.trim())
            document.getElementById(`${key}Error`).innerText = value
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
        document.querySelector('body').style.overflowY = 'hidden';
        document.getElementById('titulo-modal').innerText = this.titulo;
        document.querySelector('#panelResultados').innerText = this.texto;
    }

    confirm() {
        return new Promise((resolve, reject) => {
            const btnCerrar = document.getElementById('cerrarModal');
            btnCerrar.addEventListener("click", () => {
                document.getElementById('lamascara').style.display = "none";
                document.querySelector('body').style.overflowY = 'visible';
                resolve(false);
            });
            const btnAceptar = document.getElementById('aceptarModal');
            btnAceptar.addEventListener("click", () => {
                document.getElementById('lamascara').style.display = "none";
                document.querySelector('body').style.overflowY = 'visible';
                resolve(true);
            });
        });
    }
}

export { message, Modal };