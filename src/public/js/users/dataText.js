const texto = `
    <div class="col-md-12 text-center" id="insertar">
        <table class="table" id="filas">
            <thead class="thead-dark">
                <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Email</th>
                <th scope="col">Telefono</th>
                <th scope="col">Rol</th>
                <th scope="col">Estado</th>
                <th scope="col">Accion</th>
                </tr>
            </thead>
            <tbody  id="insertar-filas">
            </tbody>
        </table>
    </div>
`;

const formIngreso =`
    <div class="row justify-content-md-center" id="insertar-filas">
        <form class="card-body col-md-4" id="formulario">
            <div class="card-header" id="formulario-titulo">
                <h4 id="titulo-form"></h4>
            </div>
            <div class="form-group mt-4">
                <input type="text" id="nombre" placeholder="Nombre" class="form-control">
                <span id="nombreError" class="text-danger"></span>
            </div>
            <div class="form-group">
                <input type="text" id="apellido" placeholder="Apellido" class="form-control">
                <span id="apellidoError" class="text-danger"></span>
            </div>
            <div class="form-group">
                <input type="text" id="email" placeholder="Email" class="form-control">
                <span id="emailError" class="text-danger"></span>
            </div>
            <div class="form-group">
                <input type="text" id="telefono" placeholder="Telefono" class="form-control">
                <span id="telefonoError" class="text-danger"></span>
            </div>
            <div class="form-group">
                <select name="rol" id="rol" class="form-control">
                    <option id="rolActual">rol</option>
                </select>
                <span id="rolError" class="text-danger"></span>
            </div>
            <button type="button" class="btn btn-primary btn-block" id="btn-insertar"></button>
            <button type="button" class="btn btn-light btn-sm btn-block mt-2" id="btn-cancelar">
                Cancelar
            </button>
        </form>
    </div>
`;

export { texto, formIngreso }