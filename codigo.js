
$(document).ready(function(){



    $("#btn-tester").click(function(){
        const btn= $(this);
        const valor1= btn.data('valor');
        const valor2= btn.data('valor2');

        const texto= `Este es el texto formado por ${valor1} y por ${valor2}`
        
        console.log(texto)
    })

});
