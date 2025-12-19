# Taller Práctico: Depuración Web con Chrome DevTools


**Objetivo:** Diagnosticar y corregir errores de interfaz (UI), lógica (JS) y comunicación (Network) utilizando las herramientas de desarrollo del navegador.

---

## 1. Configuración del Entorno 

Antes de comenzar a depurar, necesitamos preparar el "paciente": una pequeña página web con errores intencionales.

**Instrucciones:**

1.  Crea una nueva carpeta en tu computadora llamada `taller-devtools`.
2.  Dentro de esa carpeta, crea un archivo llamado `index.html`.
3.  Copia y pega el siguiente código dentro de `index.html` y guarda el archivo:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tienda Buggy - Práctica DevTools</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f0f2f5; }
        .card { max-width: 500px; margin: 40px auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; text-align: center; }
        .product-info { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
        .price-tag { color: #27ae60; font-size: 1.5em; font-weight: bold; }
        .input-group { margin: 15px 0; display: flex; align-items: center; gap: 10px; }
        input { padding: 5px; width: 60px; font-size: 1em; }
        
        /* ERROR 1: Estilo CSS impide ver el botón */
        #btn-pagar {
            display: none; 
            width: 100%; padding: 12px; background-color: #3498db; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; transition: background 0.3s;
        }
        #btn-pagar:hover { background-color: #2980b9; }
        
        #resultado { margin-top: 25px; text-align: center; font-size: 1.2em; font-weight: bold; color: #34495e; }
        #api-status { text-align: center; font-size: 0.9em; margin-top: 10px; color: #7f8c8d; }
    </style>
</head>
<body>

<div class="card">
    <h1>🛒 Carrito de Compras</h1>
    
    <div class="product-info">
        <h3>Auriculares Noise-Cancel</h3>
        <p>Precio Unitario: <span class="price-tag">$<span id="precio-base">150</span></span></p>
        <div class="input-group">
            <label for="cantidad">Cantidad:</label>
            <input type="number" id="cantidad" value="1" min="1">
        </div>
    </div>

    <button id="btn-pagar" onclick="procesarCompra()">Pagar Ahora</button>
    
    <div id="resultado">Total a pagar: $0</div>
    <div id="api-status">Esperando transacción...</div>
</div>

<script>
    console.log("Sistema de ventas v1.0 cargado correctamente.");

    function procesarCompra() {
        console.log("Iniciando proceso de compra...");
        
        const precioTexto = document.getElementById('precio-base').innerText;
        const precio = parseInt(precioTexto);
        const cantidad = parseInt(document.getElementById('cantidad').value);

        // ERROR 2: Lógica matemática incorrecta
        // debugger; // Descomentar esta línea si quieres forzar el breakpoint desde código
        let total = calcularTotal(precio, cantidad);

        if (total < 0) {
            console.error("Error Crítico: El total no puede ser negativo.");
            return;
        }

        document.getElementById('resultado').innerText = "Total a pagar: $" + total;
        console.log(`Cálculo finalizado. Precio: ${precio}, Cantidad: ${cantidad}, Total: ${total}`);

        // Llamada al servidor
        verificarStock();
    }

    function calcularTotal(p, c) {
        // ERROR DE LÓGICA AQUÍ
        // Debería ser multiplicación (*), pero hay una resta (-)
        return p - c; 
    }

    function verificarStock() {
        // ERROR 3: Endpoint incorrecto (404)
        const urlAPI = '[https://jsonplaceholder.typicode.com/posts/verificar-stock-inexistente](https://jsonplaceholder.typicode.com/posts/verificar-stock-inexistente)';
        
        console.log(`Consultando API: ${urlAPI}`);
        document.getElementById('api-status').innerText = "Conectando con inventario...";

        fetch(urlAPI)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Estado HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                document.getElementById('api-status').innerText = "Stock confirmado ✔️";
                document.getElementById('api-status').style.color = "green";
            })
            .catch(error => {
                console.error("Fallo en la petición de red:", error);
                document.getElementById('api-status').innerText = "Error de conexión con inventario ❌";
                document.getElementById('api-status').style.color = "red";
            });
    }
</script>

</body>
</html>
```
4. Abre el archivo index.html haciendo doble clic en él (se abrirá en tu navegador Chrome).


## 2. Pestaña ELEMENTS: Recuperando el botón perdido
Síntoma: La página muestra el producto y la cantidad, pero no hay forma de finalizar la compra. Falta el botón.

Misión:

1) Haz clic derecho sobre el título "Carrito de Compras" y selecciona Inspeccionar.

2) Asegúrate de estar en la pestaña Elements.

3) Expande las etiquetas del HTML (<body>, <div class="card">) hasta encontrar <button id="btn-pagar">.

4) Al seleccionarlo, mira el panel de Styles (Estilos) en la parte inferior o lateral derecha.

5) Encuentra la regla CSS #btn-pagar que tiene la propiedad display: none.

6) Solución: Desmarca la casilla del display: none o cambia el valor none por block.

7) El botón "Pagar Ahora" debería aparecer mágicamente.


## 3. Pestaña CONSOLE: Primeros indicios de problemas
Síntoma: Ahora que ves el botón, haz clic en "Pagar Ahora". Verás que el total calculado es extraño (probablemente 149 en lugar de 150) y aparece un mensaje de error sobre el inventario.

Misión:

1) Ve a la pestaña Console.

2) Lee los registros (logs). Deberías ver:

* "Iniciando proceso de compra..."

* Un mensaje con los valores del cálculo.

* Un mensaje de error en rojo.

3) Análisis:

* Observa el cálculo: Si Precio es 150 y Cantidad es 1, el total muestra 149. ¿Por qué?

* Observa el error rojo: Fallo en la petición de red: Error: Estado HTTP: 404.

4) Mantén la consola abierta para monitorear los siguientes pasos.

## 4. Pestaña SOURCES: Depuración paso a paso 
Síntoma: La matemática no cuadra. Necesitamos ver cómo el código calcula el total exactamente en el momento en que ocurre.

Misión:

1) Ve a la pestaña Sources.

2) En el panel de archivos (izquierda), selecciona index.html.

3) Busca la función calcularTotal(p, c) (aproximadamente línea 80).

4) Poner un Breakpoint: Haz clic en el número de línea donde dice return p - c;. Debería aparecer una marca azul sobre el número.

5) Vuelve a la página web y haz clic en el botón "Pagar Ahora".

6) La pantalla se congelará: Chrome ha pausado la ejecución en tu línea.

7) Pasa el mouse sobre la variable p y la variable c para confirmar sus valores (150 y 1).

8) Observa el operador matemático. ¡Es una resta (-) en lugar de una multiplicación (*)!

9) Solución:

* Aunque puedes editar temporalmente en Sources, lo ideal es ir a tu archivo index.html en tu editor de texto.

* Cambia return p - c; por return p * c;.

* Guarda el archivo y recarga la página (F5) en Chrome.

* Prueba de nuevo (tendrás que volver a arreglar el botón en Elements o borrar el display: none en tu código fuente permanentemente).


## 5. Pestaña NETWORK: ¿Por qué falla el inventario?
Síntoma: El mensaje "Esperando transacción..." cambia a "Error de conexión".

Misión:

1) Ve a la pestaña Network.

2) Limpia el registro de red (icono de prohibido o papelera 🚫).

3) Haz clic en "Pagar Ahora".

4) Verás aparecer una solicitud en rojo con el nombre verificar-stock-inexistente.

5) Haz clic sobre esa solicitud.

6) Revisa:

* Headers > General: Status Code 404 Not Found. Esto confirma que la URL está mal escrita o no existe.

* Payload/Response: En este caso no hay respuesta útil porque la ruta no existe.

7) Conclusión: El problema no es tu internet, es que el fetch apunta a una dirección equivocada en el servidor.

## 6. Desafío Final
Si has corregido todo:

1) Modifica el HTML para quitar el display: none del CSS permanentemente.

2) Modifica la función JS para usar multiplicación *.

3) Cambia la URL del fetch a 'https://jsonplaceholder.typicode.com/posts/1' (una URL real que sí funciona) para ver cómo luce una petición exitosa (Status 200) en la pestaña Network.