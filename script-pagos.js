// Cargar datos de pagos desde LocalStorage al cargar la página
$(document).ready(function() {
    cargarDatosPagosDesdeLocalStorage();
});

// Manejar el clic en el botón "Eliminar" de la tabla de pagos
$('#tablaPagos').on('click', '.btnBorrar', function() {
    const id = $(this).data('id');
    $(`#pago-${id}`).remove();
    guardarDatosPagosEnLocalStorage();
});

$('#formularioPago').submit(function(event) {
    event.preventDefault();

// Obtener los valores del formulario
const nombre = $('#nombre').val();
const apellido = $('#apellido').val();
const fecha = $('#fecha').val();
const pagado = parseFloat($('input[name="pagado"]').val()); // Obtener por nombre
const debe = parseFloat($('input[name="debe"]').val()); // Obtener por nombre


    // Verificar si los valores son numéricos y no son NaN
    if (!isNaN(pagado) && !isNaN(debe)) {
        // Agregar el pago a la tabla
        const id = Math.floor(Math.random() * 1000);
        agregarPagoATabla(id, nombre, apellido, fecha, pagado, debe);
        guardarDatosPagosEnLocalStorage();

        // Enviar solicitud POST al servidor para registrar el pago
        const formData = {
            nombre: nombre,
            apellido: apellido,
            fecha: fecha,
            pagado: pagado,
            debe: debe
        };
        registrarPago(formData);
        limpiarCamposFormularioPago();
    } else {
        // Mostrar mensaje de error si los valores no son numéricos
        alert('Por favor, ingrese valores numéricos válidos para el pago y el debe.');
    }
});


// Función para cargar los datos de la tabla de pagos desde LocalStorage
function cargarDatosPagosDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem('datosPagos');
    if (datosGuardados) {
        const datosPagos = JSON.parse(datosGuardados);
        datosPagos.forEach(pago => {
            agregarPagoATabla(pago.id, pago.nombre, pago.apellido, pago.fecha, pago.pagado, pago.debe);
        });
    }
}
// Función para guardar los datos de la tabla de pagos en LocalStorage
function guardarDatosPagosEnLocalStorage() {
    const datosPagos = [];
    $('#tablaPagos tbody tr').each(function() {
        const id = $(this).find('td:eq(0)').text();
        const nombre = $(this).find('td:eq(1)').text();
        const apellido = $(this).find('td:eq(2)').text();
        const fecha = $(this).find('td:eq(3)').text();
        const pagado = $(this).find('td:eq(4)').text();
        const debe = $(this).find('td:eq(5)').text();
        datosPagos.push({ id, nombre, apellido, fecha, pagado, debe });
    });
    localStorage.setItem('datosPagos', JSON.stringify(datosPagos));

    console.log('Datos de pagos guardados en LocalStorage:', datosPagos);
}

// Función para agregar un pago a la tabla de pagos
function agregarPagoATabla(id, nombre, apellido, fecha, pagado, debe) {
    const row = `
        <tr id="pago-${id}">
            <td>${id}</td>
            <td>${nombre}</td>
            <td>${apellido}</td>
            <td>${fecha}</td>
            <td>${pagado}</td>
            <td>${debe}</td>
            <td><button class="btn btn-danger btnBorrar" data-id="${id}">Eliminar</button></td>
        </tr>
    `;
    $('#tablaPagos tbody').append(row);
}

// Función para limpiar los campos del formulario de pagos
function limpiarCamposFormularioPago() {
    $('#nombre').val('');
    $('#apellido').val('');
    $('#fecha').val('');
    $('#pagado').val('');
    $('#debe').val('');
}

// Función para enviar la solicitud POST al servidor para registrar el pago
function registrarPago(formData) {
    fetch('/pago', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al registrar el pago');
        }
        return response.text();
    })
    .then(data => {
        console.log(data); // Manejar la respuesta del servidor si es necesario
        alert('Pago registrado correctamente');
    })
    .catch(error => {
        console.error('Error al registrar el pago:', error);
        alert('Error al registrar el pago');
    });
}
