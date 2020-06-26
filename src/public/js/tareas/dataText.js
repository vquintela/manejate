const textoFilas = `
    <div class="col-md-12 text-center" id="insertar">
        <table class="table" id="insertar-filas">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Titulo</th>
                    <th scope="col">Descripcion</th>
                    <th scope="col">Avance</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Accion</th>
                    <th scope="col">Asignada</th>
                </tr>
            </thead>
            <tbody id="filas">
            </tbody>
        </table>
    </div>
`;

const textoTareas =`
    <div class="col-md-12 text-center" id="insertar-filas">
        <div class="row justify-content-md-center">
            <div class="col-md-4">
                <h4 id="tareas-title"></h4>
                <form class="card-body" id="formulario">
                    <div class="form-group">
                        <input type="text" id="titulo" placeholder="Titulo" class="form-control">
                        <span id="tituloError" class="text-danger"></span>
                    </div>
                    <div class="form-group">
                        <input type="text" id="descripcion" placeholder="Descripcion" class="form-control">
                        <span id="descripcionError" class="text-danger"></span>
                    </div>
                    <button type="button" class="btn btn-primary btn-block" id="ingresartarea"></button>
                    <button type="button" class="btn btn-light btn-sm btn-block mt-2" id="cancelar-tarea">
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    </div>
`;

const insertAvance = `
    <div class="row justify-comtent-md-center" id="insertar-filas">
        <div class="col-md-4">
            <div class="form-group">
                <input type="text" id="mensaje-tarea" placeholder="Agregar Avance" class="form-control" />
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-block" id="btn-agregar" type="button">Agregar Avance</button>
            </div>
            <button type="button" class="btn btn-light btn-sm btn-block mt-2" id="cancelar-avance">
                Cancelar
            </button>
        </div>
        <div class="col-md-8" id="msg-tareas">
        </div>
    </div>
`;

export { textoFilas, textoTareas, insertAvance }