const ingresarText = `
    <div class="row justify-content-md-center align-items-center" id="insertar-filas">
        <div class="col-md-6">
            <h4 id="titulo-motos"></h4>
            <form class="card-body" id="formulario">
                <div class="form-group">
                    <input type="text" id="patente" placeholder="Patente" class="form-control">
                    <span id="patenteError" class="text-danger"></span>
                </div>
                <div class="form-group">
                    <input type="number" id="precio" placeholder="Precio" class="form-control">
                    <span id="precioError" class="text-danger"></span>
                </div>
                <div class="form-group">
                    <input type="text" id="descripcion" placeholder="Descripcion" class="form-control">
                    <span id="descripcionError" class="text-danger"></span>
                </div>
                <div class="form-group">
                    <input type="text" id="modelo" placeholder="Modelo" class="form-control">
                    <span id="modeloError" class="text-danger"></span>
                </div>
                <div class="form-group">
                    <input type="file" id="imagen" class="form-control-file">
                </div>
                <div class="form-group">
                    <select id="marca" class="form-control">
                        <option>marca</option>
                        <option>honda</option>
                        <option>yamaha</option>
                        <option>zanella</option>
                        <option>beta</option>
                    </select>
                    <span id="marcaError" class="text-danger"></span>
                </div>
                <button type="button" class="btn btn-primary btn-block" id="btn-insertar"></button>
                <button type="button" class="btn btn-light btn-sm btn-block mt-2" id="btn-cancelar">
                    Cancelar
                </button>
            </form>
        </div>
        <div class="col-md-4" id="preview">
            <img src="img/sinimagen.png" class="img-fluid" alt=""/>
        </div>
    </div>
`

const textoFilas = `
    <div class="col-md-12 text-center" id="insertar">
        <table class="table" id="insertar-filas">
            <thead class="thead-dark">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">Patente</th>
                <th scope="col">Precio</th>
                <th scope="col">Marca</th>
                <th scope="col">Modelo</th>
                <th scope="col">Estado</th>
                <th scope="col">Accion</th>
            </tr>
            </thead>
            <tbody id="filas">
            </tbody>
        </table>
    </div>
`;

export { ingresarText, textoFilas }