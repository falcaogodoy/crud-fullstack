const Validator = require("validator");
const isEmpty = require("./isEmpty");

const validateRegisterInput = (data) => {
    let errors = {};



    // checar campo do e-mail

    if(isEmpty(data.email)) {
        errors.email = "Campo de e-mail vazio";
        
    } else if(!Validator.isEmail(data.email)){
        errors.email = " E-mail Invalido"
    }

    //checar senha
    if(isEmpty(data.password)){
        errors.password = "Digite a senha"
    } else if(!Validator.isLength(data.password, {min: 6, max:150})) {
        errors.password = " A senha deve contar no minimo 6 caracteres";

    }
    //checar nome
    if(isEmpty(data.name)){
        errors.name = "Campo do Nome vazio"; 
    } else if(!Validator.isLength(data.name, {min: 2, max:150})) {
        errors.name = " O nome deve contar no minimo 6 caracteres";

    }

    //campo de senha
    if(isEmpty(data.confirmPassword)){
        errors.confirmPassword = " campo de confirmação vazio";
    } else if (!Validator.equals(data.password, data.confirmPassword)){
        errors.confirmPassword = " AS senhanhas devem ser iguais";
    }
 
    return {
        errors,
        isValid: isEmpty(errors),

    }
};


module.exports = validateRegisterInput;