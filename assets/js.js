

//CANTIDAD DEL NUMERO DEL CARRITO
$(document).ready(()=>{
    mostrarProductos();
    $('#seleccion').on("change", ordenarProductos);
    finalizarCompra()
});




/* $('#carrito-container').append(`<p id="cantidad">${almacenados.length}</p>`); */
class Producto{
    constructor(objProducto){
        this.id=objProducto.id
        this.producto=objProducto.producto;
        this.precio=objProducto.precio;
        this.material=objProducto.material;
        this.cantidad=1;
    }
}

//array para la funcion agregar al carro
let carrito=verficarCarrito();
//array donde se almacen los productos del JSON
let productosJSON=[];

//VERIFICAMOS SI HAY ALGO O NO EN EL STORAGE
function verficarCarrito(){
    let contenidoDeLc=JSON.parse(localStorage.getItem('carritoEnStorage'));
    if(contenidoDeLc){
        let array=[];
        for(let i; i<contenidoDeLc; i++){
            array.push(new Producto(contenidoDeLc[i]));
        }
        return array;
    }
    else{
        return [];
    }
}

//FUNCION PARA EL BOTÓN QUE NOS MUESTRA LOS PRODUCTOS
function mostrarProductos(){
    $('#seleccion').hide();
    $('#div-tabla').hide();
    let btn=$('#btn-traer');
    btn.click(()=>{
        let contador=0;
        if(contador==0){
            contador=1;
            if(contador==1){
                btn.hide();
                obtenerJson();
                $('#seleccion').fadeIn();
            }
        }
    });
}

//OBTENEMOS EL JSON
function obtenerJson(){
    const miJSON="json.json"
    $.getJSON(miJSON, (respuesta, estado)=>{
        if(estado=="success"){
            productosJSON=respuesta.productos;
            renderizarProductos();
        }
    });
}

//RENDERIZAMOS LOS PRODUCTOS LUEGO DE HABERLOS TRAIDO DEL JSON
function renderizarProductos(){
    for(const prod of productosJSON){
        $('#almacen').append(`
        <div class="card text-center animate__animated" style="width: 18rem;" id="card${prod.id}">
        <img src="${prod.imagen}" alt="" class="img-card">
        <div class="card-body">
          <h5 class="card-title"><strong>${prod.producto}</strong></h5>
          <p class="card-text">$ ${prod.precio}</p>
          <a href="#" class="btn btn-primary" id="btn-${prod.id}">AGREGAR AL CARRO</a>
        </div>
      </div>`);
      //Le agregamos a cada boton la funcion para que lo agregue al carro
      $(`#btn-${prod.id}`).on("click", function enviar(){
        agregarAlCarrito(prod);
      });
    }
    $('#div-tabla').show();
}

//FUNCION AGREGAR LOS PRODUCTOS AL CARRITO
function agregarAlCarrito(prodACarro){
    //buscamos al elemento que disparo el evento
    let encontrado=carrito.find(p=>p.id==prodACarro.id);
    console.log(encontrado);
    //si el elemento no esta en el carrito va a tirar undefined
    if(encontrado==undefined){
        carrito.push(new Producto(prodACarro))
        console.log(carrito);
        //alerta de que se agrego nuevo carrito al carro
        Swal.fire(`¡Nuevo producto agregado al carro!\n<strong>${prodACarro.producto}</strong>`);
        
        $('#tbody').append(`<tr id="fila-${prodACarro.id}">
            <th scope="row">${prodACarro.id}</th>
            <td>${prodACarro.producto}</td>
            <td id="cantidad-${prodACarro.id}">${prodACarro.cantidad}</td>
            <td>${prodACarro.precio}</td>
            <td><p id="eliminar${prodACarro.id}">🗑️</button></p>
        </tr>`);
        $(`#eliminar${prodACarro.id}`).css({cursor: 'pointer'});
        //se le agrega la cantidad de "1" al num pegado al carrito
        $('#cantidad-carrito').text(prodACarro.cantidad);

        //FUNCION PARA ELIMINAR Y REDUCIR LOS PRODUCTOS
        $(`#eliminar${prodACarro.id}`).click(function(){
            let prodEliminar=carrito.findIndex(element=>element.id==prodACarro.id);
            //si la cantidad del producto del carro es igual o mayor a 2
            if(carrito[prodEliminar].cantidad >= 2){
                let cantidadReduce=carrito[prodEliminar].cantidad += -1;
                $(`#cantidad-${prodACarro.id}`).text(cantidadReduce);
                //modificamos la cantidad del icono carrito restandole 1
                $('#cantidad-carrito').text(cantidadReduce);
                //llamamos a la funcion del precio para que lo calcule
                //luego lo volvemos a modificar en el DOM
                calcularTotal();
                $('#cantidad').html(`Total: $${calcularTotal()}`);
            } 
            else{//si la cantidad del producto del carro es igual a  1
                carrito.splice(prodEliminar, 1);
                $(`#fila-${prodACarro.id}`).remove();
                //modificamos la cantidad del icono carrito a 0
                $('#cantidad-carrito').text(0);
                //llamamos a la funcion del precio para que lo calcule
                //luego lo volvemos a modificar en el DOM
                calcularTotal();
                $('#cantidad').html(`Total: $${calcularTotal()}`);
                //alert para cuando se elimina o reduce un producto
                Swal.fire(`¡Producto eliminado del carro!\n<strong>${prodACarro.producto}</strong>`);
            }
        });
    }
    else{
        //Si el producto ya existe en el carro, buscamos el indice de ese producto
        let posicion=carrito.findIndex(p=>p.id==prodACarro.id);
        console.log(posicion);
        //al indice encontrado le vamos sumando 1 a la cantidad
        let cantidadProducto=carrito[posicion].cantidad += 1;
        //alert de que se agrego un producto repetido 
        Swal.fire(`¡Nuevo producto agregado al carro!
        <strong>${prodACarro.producto}</strong> x${cantidadProducto}`);
        //le modificamos el num a la celda de cantidad
        $(`#cantidad-${prodACarro.id}`).html(cantidadProducto);
        
    }
    $('#cantidad p').text(`Total: $${calcularTotal()}`);
    //Enviamos el carro al Storage
    enviarAlStorage("carrioEnStorage", carrito);
}

//CALCULAMOS Y ACTUALIZAMOS EL PRECIO
function calcularTotal(){
    let suma=0;
    for(const elemento of carrito){
        suma+=(elemento.precio * elemento.cantidad);
    }
    return suma;
}

//FUNCION QUE ORDENA DE MENOR A MAYOR O EN VICEVERSA 
function ordenarProductos(){
    let seleccion=$('#seleccion').val();
    if(seleccion=="menor"){
        productosJSON.sort((a, b)=>{
            return a.precio - b.precio;
        });
    }
    else if(seleccion=="mayor"){
        productosJSON.sort((a, b)=>{
            return b.precio - a.precio;
        });
    }
    /* else if(seleccion=="alfabetico"){
        productosJSON.sort(function(a, b){
            return a.nombre.localeCompare(b.nombre);
        });
    } */
    //borramos las cards anteriores y volvemos a renderizarlas ordenadas
    $('.card').remove();
    renderizarProductos();
}

//ENVIAMOS LOS PRODUCTOS AL STORAGE
function enviarAlStorage(clave, valor){
    localStorage.setItem(clave, JSON.stringify(valor));
}

//CARTEL FINALIZAR COMPRA
function finalizarCompra(){
    $('#btn-finalizar').click(()=>{
        Swal.fire({
            title: 'Quieres finalizar tu compra?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, comprar!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Genial!',
                'Tu compra se ha realizado con exito',
                'success'
              )
              //eleminamos la tabla con los productos una vez hecha la compra
              $('#table').remove();
              //modificamos la cantidad del total a 0
              //de esta manera se renicia el contador 
              $('#cantidad p').text(`Total: $ 0`);;
            }
          })
    });
}

