const Validator = require('validator');
const isEmpty = require('./isEmpty');

const validateToDoInput = data => {
    let errors = {};


    //verifica campo do conteudo

    if(isEmpty(data.content)) {
        errors.content = " O campo de Link nâo pode ser vazio";
    } else if(!Validator.isLength(data.content, {min:1, max:600})) {
        errors.content = 'O campo deve  ter entre 1 e 600 characteres ';
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}


module.exports = validateToDoInput;