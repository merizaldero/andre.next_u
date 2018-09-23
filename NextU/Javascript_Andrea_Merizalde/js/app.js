var Calculadora = {
		numeroEspacios: 8,
		
		ultimaCantidadIgual : null,
		ultimoTotalIgual : null,
		ultimaCantidad : null,
		ultimaOperacion : null,
		ultimoComando : null,

		valorDisplay: "0",
		
		displayChangedListeners : [],
		
		digitos : ["0","1","2","3","4","5","6","7","8","9"],

		operacionesDuales : {
			"mas": function(a , b){ return a + b ; },
			"menos": function(a , b){ return a - b ; },
			"por": function(a , b){ return a * b ; },
			"dividido": function(a , b){ return a / b ; }
		},
		
		operacionesIndividuales : {
			"sign": function(a ){ return - a ; }
		},

		digitosDesplegados: function(){
			var tamano = this.valorDisplay.length;
			if( this.valorDisplay.indexOf(".") >= 0 ){
				tamano--;
			}
			return tamano;
		},
		
		// Convierte un numero a cadena controlando maximo de digitos
		numeroAString : function(numero){
			var cadena = numero.toString();
			var posicion = cadena.indexOf(".");
			if(posicion >= this.numeroEspacios){
				
				// Si la parte entera tiene mas cifras que el maximo
				cadena = cadena.substring( 0, this.numeroEspacios );
				
			}else if(posicion >= 0){
				
				// Si hay parte decimal, determinar cuantas no sobrepasan limite
				var numeroDecimalesPermitidos = this.numeroEspacios - posicion ;
				var numeroDecimalesExistentes = cadena.length - posicion - 1 ;
				if(numeroDecimalesPermitidos < numeroDecimalesExistentes ){
					cadena = numero.toFixed( numeroDecimalesPermitidos );
					//remover ceros de mas
					while(cadena.endsWith("0")){
						cadena = cadena.substring(0 , cadena.length -1);
					}
					if(cadena.endsWith(".")){
						cadena = cadena.substring(0 , cadena.length -1);
					}
				}
				
			}else if(cadena.length > this.numeroEspacios){
				
				// si no hay parte decimal y son mas digitos que el maximo 
				cadena = cadena.substring( 0, this.numeroEspacios );
				
			}
			return cadena;
		},
		
		ingresarComando : function( comando ){
			if(comando == "on"){
				
				// Si se presiona el boton de reset
				this.valorDisplay = "0";
				this.ultimaCantidad = this.ultimoComando = this.ultimaOperacion = null;
				
			} else if( comando in this.digitos ){
				
				//Si es uno de los digitos
				if(this.ultimoComando == "igual"){
					this.valorDisplay = "0";
				}
				this.ultimoComando = null;
				
				if(this.digitosDesplegados() >= this.numeroEspacios){
					return;
				}
				if( this.valorDisplay == "0" || this.valorDisplay == "" ){
					if(comando != "0"){
						this.valorDisplay = comando;	
					}
					
				} else {
					this.valorDisplay += comando;
				}
				
			} else if(comando == "punto" && this.valorDisplay.indexOf(".") < 0 ){ 
				
				this.ultimoComando = null;
				
				// Agrega punto decimal
				this.valorDisplay += ".";
				
			} else if( comando in this.operacionesIndividuales ){
				
				this.ultimoComando = null;
				var valor = this.operacionesIndividuales[comando]( this.valorDisplay );
				this.valorDisplay = this.numeroAString(valor);

			} else if( comando in this.operacionesDuales ){
				
				this.ultimoComando = null;
				
				// operacion basica prepara para recibir segundo operando
				this.ultimaCantidad = parseFloat(this.valorDisplay);
				this.ultimaOperacion = comando;
				this.valorDisplay = "";
				
			} else if( comando == "igual" ){
				
				if(this.ultimaOperacion != null){
					var resultado = (this.valorDisplay == "") ? 0 : parseFloat(this.valorDisplay);
					var operando1 = resultado;
					if(this.ultimoComando == "igual"){						
						resultado = this.operacionesDuales[this.ultimaOperacion]( resultado, this.ultimoTotalIgual );
					} else {
						resultado = this.operacionesDuales[this.ultimaOperacion](this.ultimaCantidad, resultado );
						this.ultimoTotalIgual = operando1 ;
					}
					this.valorDisplay = this.numeroAString(resultado);
					this.ultimoComando = "igual";
				}
				
			}
			this.displayChanged();
		},
		
		addDisplayChangedListener: function(listener){
			this.displayChangedListeners[this.displayChangedListeners.length] = listener;
		},
		
		displayChanged: function(){
			var listener;
			for(listener in this.displayChangedListeners){
				try{
					this.displayChangedListeners[listener](this.valorDisplay);	
				}catch(ex){
					
				}
			}
		},
		
		init : function(){
			var teclas = document.getElementsByClassName("tecla");
			var tecla;
			var instancia = this;
			var display = document.getElementById("display");
			if(display != null){
				this.addDisplayChangedListener(function(valorDisplay){
					display.innerText = valorDisplay;
				});
			}
			var indice;
			var tecla;
			var teclaPresionada = function( evento ){
				evento.target.style.transform = "scale(0.9 , 0.9)";
			};
			var teclaLiberada = function( evento ){
				evento.target.style.transform = "";
			};
			for(indice = 0; indice< teclas.length; indice++){
				tecla = teclas[indice];
				tecla.style.cursor = "pointer";
				tecla.addEventListener("click",function(evento){
					instancia.ingresarComando( evento.target.id );
				});
				tecla.addEventListener("mousedown", teclaPresionada );
				tecla.addEventListener("mouseup", teclaLiberada );
				tecla.addEventListener("mouseout", teclaLiberada );
				tecla.addEventListener("touchstart", teclaPresionada );
				tecla.addEventListener("touchend", teclaLiberada );
			}
			// Primer reset
			this.ingresarComando("on");
		},
};

Calculadora.init();