Levanta un servidor http con express. Tienes dos rutas:
- "/lectura": Tipo GET para obtener todos los valores de las variables del proceso
- "/escritura": Tipo POST para enviar al PLC los valores del proceso como en el ejemplo:
[
    {
        "name":"Marcha",
        "value": 0
    },
    {
        "name":"Paro",
        "value": 0
    },
    {
        "name":"SP1",
        "value": 50
    },
    {
        "name":"SP2",
        "value": 20.5
    }
]

Como controlador, tiene un archivo que actua como cliente OPC UA para lectura o escritura de los items.
No tiene conexiones a base de datos.