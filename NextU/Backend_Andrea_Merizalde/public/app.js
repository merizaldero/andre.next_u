//Inicializador del elemento Slider
$("#rangoPrecio").ionRangeSlider({
  type: "double",
  grid: false,
  min: 0,
  max: 100000,
  from: 1000,
  to: 20000,
  prefix: "$"
})

function setSearch() {
  let busqueda = $('#checkPersonalizada')
  busqueda.on('change', (e) => {
    if (this.customSearch == false) {
      this.customSearch = true
    } else {
      this.customSearch = false
    }
    $('#personalizada').toggleClass('invisible')
  })
}

setSearch()

$(document).ready(function(){
	var selCiudad = $('#ciudad');
	var selTipo = $('#tipo');
	
	$.get('api/ciudades',function(data, status){
		if(status == 'success'){
			var plantillaCiudad = '<option value=":Ciudad:">:Ciudad:</option>';
			data.forEach( function(ciudad){
				selCiudad.append(plantillaCiudad.replace(/:Ciudad:/g,ciudad.Ciudad));
			});
			selCiudad.material_select();
		}else{
			alert("Error al obtener Ciudades " + status);
		}
	});
	
	$.get('api/tiposConstruccion',function(data, status){
		if(status == 'success'){
			var plantillaCiudad = '<option value=":Tipo:">:Tipo:</option>';
			data.forEach( function(tipo){
				selTipo.append(plantillaCiudad.replace(/:Tipo:/g,tipo.Tipo));
			});
			selTipo.material_select();
		}else{
			alert("Error al obtener Tipos " + status);
		}
	});
	
	$('#buscar').on('click',function(){
		$('.lista').html('');
		var miCallback = function(data, status){
			if(status == 'success'){
				
				data.forEach(function(vivienda){
					$('.lista').append(
							'<div class="card horizontal">' +
							'	<div class="card-image">' +
							'		<img src="img/home.jpg">' +
							'	</div>' +
							'	<div class="card-stacked">' +
							'		<div class="card-content">' +
							'			<div>' +
			                `				<b>Direccion: </b><span>${vivienda.Direccion}</span>` +
			                '			</div>' +
			                '			<div>' +
			                `				<b>Ciudad: </b><span>${vivienda.Ciudad}</span>` +
			                '			</div>' +
			                '			<div>' +
			                `				<b>Telefono: </b><span>${vivienda.Telefono}</span>` +
			                '			</div>' +
			                '			<div>' +
			                `				<b>Código postal: </b><span>${vivienda.Codigo_Postal}</span>` +
			                '			</div>' +
			                '			<div>' +
			                `				<b>Precio: </b><span>${vivienda.Precio}</span>` +
			                '			</div>' +
			                '			<div>' +
			                `				<b>Tipo: </b><span>${vivienda.Tipo}</span>` +
			                '			</div>' +
			                '		</div>' +
			                '		<div class="card-action right-align">' +
			                '			<a href="#">Ver más</a>' +
			                '		</div>' +
			                '	</div>'	+
			                '</div>'
							);
				});
				
			}else{
				alert("Error al realizar busqueda");
			}
				
			
		};
		
		if( $('#personalizada').hasClass('invisible') ){
			$.post('api/viviendas',{}, miCallback);
		} else {
			var rango = $("#rangoPrecio").val().split(';');
			$.post('api/viviendas',{ Ciudad: selCiudad.val(), Tipo: selTipo.val(), minPrecio: rango[0], maxPrecio: rango[1] }, miCallback);
		}
		
	});

	
});