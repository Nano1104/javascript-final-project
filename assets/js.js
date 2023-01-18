

//CANTIDAD DEL NUMERO DEL CARRITO
$(document).ready(()=>{
    mostrarProductos();
    $('#seleccion').on("change", ordenarProductos);
    $('#carrito').click(() => {
        if(carrito.length == 0) {
            Swal.fire(`<i class="fas fa-shopping-cart"></i>
                        Tu carrito se encuentra vacío`)
        }
    })
});

class Producto{
    constructor(objProducto){
        this.id = objProducto.id
        this.producto = objProducto.producto;
        this.precio = objProducto.precio;
        this.material = objProducto.material;
        this.cantidad = 1;
    }
}

//array para la funcion agregar al carro
let carrito = verficarCarrito();
//array donde se almacen los productos del JSON
let productosJSON = [];

//VERIFICAMOS SI HAY ALGO O NO EN EL STORAGE
function verficarCarrito(){
    let contenidoDeLc = JSON.parse(localStorage.getItem('carritoEnStorage'));
    if(contenidoDeLc){
        let array = [];
        for(let i; i < contenidoDeLc; i++){
            array.push(new Producto(contenidoDeLc[i]));
        }
        return array;
    }
    else{
        return [];
    }
}

//MUETRA LA TABLA DEL CARRITO DEL COMPRAS SI ES QUE NO ESTA VACIO
const showCart = () => {
    return carrito.length > 0 ? $('#div-tabla').show() : $('#div-tabla').hide()
}

//FUNCION PARA EL BOTÓN QUE NOS MUESTRA LOS PRODUCTOS
function mostrarProductos(){
    $('#seleccion').hide();
    $('#div-tabla').hide();
    let btn=$('#btn-traer');
    btn.click(()=>{
        btn.hide();
        showCart()
        obtenerJson();
        $('#seleccion').fadeIn();
    });
}

//OBTENEMOS EL JSON
function obtenerJson(){
    const miJSON="json.json"
    $.getJSON(miJSON, (respuesta, estado) => {
        if(estado == "success"){
            productosJSON = respuesta.productos;
            renderizarProductos(productosJSON);
        }
    });
}

//RENDERIZAMOS LOS PRODUCTOS LUEGO DE HABERLOS TRAIDO DEL JSON
function renderizarProductos(products){
    for(const prod of products){
        $('#almacen').append(`
            <div class="card text-center animate__animated" style="width: 18rem;" id="card${prod.id}">
            <img src="${prod.imagen}" alt="" class="img-card">
            <div class="card-body">
            <h5 class="card-title"><strong>${prod.producto}</strong></h5>
            <p class="card-text">$ ${prod.precio}</p>
            <a href="#div-tabla" class="btn btn-primary" id="btn-${prod.id}">AGREGAR AL CARRO</a>
            </div>
        </div>`);
      //Le agregamos a cada boton la funcion para que lo agregue al carro
      $(`#btn-${prod.id}`).on("click", function enviar(){
        agregarAlCarrito(prod);
      });
    }
    //se muestra la tabla del carrito cuando se renderizan los productos.
}

//FUNCION AGREGAR LOS PRODUCTOS AL CARRITO
function agregarAlCarrito(prodACarro){
    //buscamos al elemento que disparo el evento
    let encontrado = carrito.find(p => p.id == prodACarro.id);
    console.log(encontrado);
    //si el elemento no esta en el carrito va a tirar undefined
    if(encontrado == undefined){
        carrito.push(new Producto(prodACarro))
        console.log(carrito);
        //alerta de que se agrego nuevo carrito al carro
        Swal.fire(`¡Nuevo producto agregado al carro!\n<strong>${prodACarro.producto}</strong>`);
        
        $('#tbody').append(`<tr id="fila-${prodACarro.id}" class='trCart'>
                                <th scope="row">${prodACarro.id}</th>
                                <td>${prodACarro.producto}</td>
                                <td id="cantidad-${prodACarro.id}">${prodACarro.cantidad}</td>
                                <td id="price-${prodACarro.id}">${prodACarro.precio}</td>
                                <td><p id="eliminar${prodACarro.id}">🗑️</button></p>
                            </tr>`);
        $(`#eliminar${prodACarro.id}`).css({cursor: 'pointer'});
        

        //FUNCION PARA ELIMINAR Y REDUCIR LOS PRODUCTOS
        $(`#eliminar${prodACarro.id}`).click(function(){
            let prodAEliminar = carrito.findIndex(element => element.id == prodACarro.id);
            //si la cantidad del producto del carro es igual o mayor a 2
            if(carrito[prodAEliminar].cantidad >= 2){
                //se resta el precio y cantidad del prod en el carrito
                let cantidadReduce = carrito[prodAEliminar].cantidad -= 1;
                $(`#cantidad-${prodACarro.id}`).text(cantidadReduce);
                $(`#price-${prodACarro.id}`).text(prodACarro.precio * cantidadReduce)
                //calcula nuevamente el precio y lo modifica en el DOM
                $('#cantidad p').text(`Total: $${calcularTotal()}`);
            } 
            else{//si la cantidad del producto del carro es igual a  1 se elimina del carro
                carrito.splice(prodAEliminar, 1);
                $(`#fila-${prodACarro.id}`).remove();
                //calcula nuevamente el precio y lo modifica en el DOM
                $('#cantidad p').text(`Total: $${calcularTotal()}`);
                //alert para cuando se elimina o reduce un producto
                Swal.fire(`¡Producto eliminado del carro!\n<strong>${prodACarro.producto}</strong>`);
                //en caso de que se eliminen todos los prods de la tabla, esta desaparece
                showCart()
            }
        });
    }
    else{
        //Si el producto ya existe en el carro, buscamos el indice de ese producto
        let posicion = carrito.findIndex(p => p.id == prodACarro.id);
        //al indice encontrado le vamos sumando 1 a la cantidad
        let cantidadProducto = carrito[posicion].cantidad += 1;
        //alert de que se agrego un producto repetido 
        Swal.fire(`¡Nuevo producto agregado al carro!
        <strong>${prodACarro.producto}</strong> x${cantidadProducto}`);
        //le modificamos el num a la celda de cantidad
        $(`#cantidad-${prodACarro.id}`).html(cantidadProducto);
        $(`#price-${prodACarro.id}`).text(prodACarro.precio * cantidadProducto)
    }
    $('#cantidad p').text(`Total: $${calcularTotal()}`);
    //luego de agregar un producto hace que aparezca la tabla del carrito 
    showCart()
    //Enviamos el carro al Storage
    enviarAlStorage("carrioEnStorage", carrito);
}

//CALCULAMOS Y ACTUALIZAMOS EL PRECIO
function calcularTotal(){
    let suma = 0;
    for(const elemento of carrito){
        suma += (elemento.precio * elemento.cantidad);
    }
    return suma;
}

//FUNCION QUE ORDENA DE MENOR A MAYOR O VICEVERSA 
function ordenarProductos(){
    let seleccion = $('#seleccion').val();
    if(seleccion == "menor"){
        productosJSON.sort((a, b) => {
            return a.precio - b.precio;
        }); 
    }
    else if(seleccion == "mayor"){
        productosJSON.sort((a, b) => {
            return b.precio - a.precio;
        });
    }
    //borramos las cards anteriores y volvemos a renderizarlas ordenadas
    $('.card').remove();
    renderizarProductos(productosJSON);
}

//ENVIAMOS LOS PRODUCTOS AL STORAGE
function enviarAlStorage(clave, valor){
    localStorage.setItem(clave, JSON.stringify(valor));
}

//FINALIZAR COMPRA
function finalizarCompra(){
    Swal.fire({
        title: 'Quieres finalizar tu compra?',
        icon: 'question',
        text: `Tu total a pagar es de: $${calcularTotal()}`,
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
          //se vacia el carro una vez hecha la compra y desaparece con la funcion showCart()
          for(const prod of carrito) {
            $(`#fila-${prod.id}`).remove()
          }
          carrito = []
          showCart()
        }
      })
}


