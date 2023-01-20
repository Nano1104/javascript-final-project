
// --- VALIDACIÓN DEL FORMULARIO --- //
const form = document.getElementById("formulario");
form.addEventListener("submit", validar);

function validar(e) {
    validarNombre(e);
    validarEdad(e);
    validarUbicacion(e);
    validarCelular(e);
    if (validarNombre(e) && validarEdad(e) && validarUbicacion(e) && validarCelular(e)) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1500
          });
    }
}

// --- OCULTAR LOS ALERT DE ERROR DE CADA CAMPO --- //
$("#formulario__p-validation-nombre").hide();
$("#formulario__p-validation-edad").hide();
$("#formulario__p-validation-edad2").hide();
$("#formulario__p-validation-ubicacion").hide();
$("#formulario__p-validation-phone").hide();
$("#formulario__p-validation-phone2").hide();

// --- VALIDACIÓN DEL CAMPO NOMBRE --- //
function validarNombre(e) {
    //verificar si esta lleno el campo
    if (nombre.value == "") {
        //agregandole height al form en caso de que salten las alertas
        $("#formulario").css({ height: "95vh" });
        $("#formulario__p-validation-nombre").show();
        $("#nombre").focus(function () {
            $("#formulario__p-validation-nombre").hide();
        });
        e.preventDefault();
        return false;
    }
    //enviar datos al storage
    else {
        sessionStorage.setItem("Nombre", nombre.value);
        return true;
    }
}

// --- VALIDACIÓN DEL CAMPO EDAD --- //
function validarEdad(e) {
    //verificar el caracter de la edad
    if (isNaN(edad.value)) {
        //agregandole height al form en caso de que salten las alertas
        $("#formulario").css({ height: "95vh" });
        $("#formulario__p-validation-edad").show();
        $("#edad").focus(function () {
            $("#formulario__p-validation-edad").hide();
        });
        e.preventDefault();
    }
    //verificar si esta lleno el campo
    else if (edad.value == "") {
        //agregandole height al form en caso de que salten las alertas
        $("#formulario").css({ height: "95vh" });
        $("#formulario__p-validation-edad2").show();
        $("#edad").focus(function () {
            $("#formulario__p-validation-edad2").hide();
        });
        e.preventDefault();
    }
    //enviar datos al storage
    else {
        sessionStorage.setItem("Edad", edad.value);
        return true;
    }
}

// --- VALIDACIÓN DEL CAMPO UBICACIÓN --- //
function validarUbicacion(e) {
    //verificar si esta lleno el campo
    if (ubicacion.value == "") {
        //agregandole height al form en caso de que salten las alertas
        $("#formulario").css({ height: "95vh" });
        $("#formulario__p-validation-ubicacion").show();
        $("#ubicacion").focus(function () {
            $("#formulario__p-validation-ubicacion").hide();
        });
        e.preventDefault();
    }
    //enviar datos al storage
    else {
        sessionStorage.setItem("Ubicacion", ubicacion.value);
        return true;
    }
}

// --- VALIDACIÓN DEL CAMPO MAIL --- //

function validarCelular(e) {
    //verificar el caracter del celular
    if (isNaN(phone.value)) {
        //agregandole height al form en caso de que salten las alertas
        $("#formulario").css({ height: "95vh" });
        $("#formulario__p-validation-phone").show();
        $("#phone").focus(function () {
            $("#formulario__p-validation-phone").hide();
        });
        e.preventDefault();
    }
    //verificar si esta lleno el campo
    else if (phone.value == "") {
        //agregandole height al form en caso de que salten las alertas
        $("#formulario").css({ height: "95vh" });
        $("#formulario__p-validation-phone2").show();
        $("#phone").focus(function () {
            $("#formulario__p-validation-phone2").hide();
        });
        e.preventDefault();
    }
    //enviar datos al storage
    else {
        sessionStorage.setItem("Celular", phone.value);
        return true;
    }
}





