const errorMessageValidation = {}

errorMessageValidation.crearMensaje = (error) => {
    const allErrors = error.message.substring(error.message.indexOf(':')+1).trim();
    const errors = allErrors.split(',').map(err => err.trim())
    return errors
}

module.exports = errorMessageValidation;