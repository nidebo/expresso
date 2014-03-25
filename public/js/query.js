var clicked = false;

// a ver donde pongo estas...
var numCantidad = null;
var numTintas = null;
var parsedFamilia = null;
var parsedMaterial = null;

function buildTable(data) {
    var table = $('<table id="tabla-resultados" class="table result-table"></table>');
    var thead = $('<thead><tr><th>#</th> \
            <th>Proveedor</th><th>Familia</th><th>Elaboracion</th><th>Medidas</th><th>Unidades</th><th>Tintas</th> \
            <th>Material</th><th>Asa</th><th>Sistema</th><th>Precio</th></tr></thead>');
    var tbody = $('<tbody></tbody>');
    for(var i=0; i<data.length; i++) {
        var row = $('<tr></tr>');
        var numeroFila = $('<td>'+ (i+1) +'</td>');
        var provider = $('<td>'+ data[i].proveedor +'</td>');
        var familia = $('<td>'+ data[i].familia +'</td>');
        var elaboracion = $('<td>'+ data[i].elaboracion +'</td>');
        var medidas = $('<td>'+ data[i].ancho + ' x ' + data[i].fuelle + ' x ' + data[i].alto +'</td>');
        var unidades = $('<td>'+ data[i].unidades +'</td>');
        var tintas = $('<td>'+ data[i].tintas +'</td>');
        var material = $('<td>'+ data[i].material +'</td>');
        var asa = $('<td>'+ data[i].asa +'</td>');
        var sistema = $('<td>'+ data[i].sistema +'</td>')
        var precio = $('<td>'+ data[i].precio +'</td>');
        row.append(numeroFila).append(provider).append(familia).append(elaboracion)
        .append(medidas).append(unidades).append(tintas).append(material).append(asa).append(sistema).append(precio);
        tbody.append(row);
    }
    table.append(thead).append(tbody);
    var div = $('.result-div');
    div.append(table);
    div.animate({
        opacity: 1,
        left: "+=50",
        height: "toggle"
    }, 1000, function() {
        // Animation complete.
    });
}

function doQuery(url) {
    $.ajax({
        url: url,
        dataType: 'json',
        success: function(data) {
            if(data.length) {
                buildTable(data);
            }
            else {
                alert('nada');
                // buildEmptyResultMessage();
            }
        },
        error: function(jqXHR, status, error) {
                
        }
    });
}

$("#botin").click(function() {
    if(!clicked) {
        clicked = true;
        // 1- coger parametros del form
        var familia = $('#familia').val();
        parsedFamilia = familia.toLowerCase();
        var material = $('#material').val();
        parsedMaterial = material.toLowerCase();
        numCantidad = $('#cantidad').val();
        numTintas = $('#tintas').val();
        // 2- pasar url a la query
        var url = '/precio?familia=' + parsedFamilia + '&tintas=' + numTintas;
        if(material != "Todos") {
            url = url + '&material=' + parsedMaterial;
        }
        console.log('url: ' + url);
        doQuery(url);
    }
});