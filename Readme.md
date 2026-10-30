**Poryecto de Digitaliazación de procesos industriales**

El proyecto consta de las siguientes partes:

1. Programa del PLC: Se utiliza como ejemplo el control de nivel de dos tanques, se utiliza un PLC Siemesn S71200, se encuentra en la carpeta PLC Programs
2. Se usa KeepServerEx como traductor principal del resto de partes. Este se conecta con el PLC, se encarga de integración de los datos del programa y levanta un servidor OPC UA para enviar la información al resto de partes.
3. Intouch AVEVA: Se implementa una interfaz de usuario en Intouch que intercambia información con el servidor OPC UA mediante un GATEWAY propio de System Platform Managment Console de AVEVA.
4. Node-Red: Este flujo tiene dos funciones actuando como cliente OPC UA, una es crear un pequeño dashboard y la segunda es funcionar como gateway, tomando los datos provenientes de OPC UA hacia la plataforma de Thingboard mediante https.
5. Thingsboard: Se crea un dashboard, donde los valores son receptados desde Node-Red mediante https.
6. N8N: Este servicio tiene como intermendiario un servidor http hecho con express de NodeJs, que al igual que Node-red actua como cliente OPC UA y escucha solicitudes http para enviar valores de lectura o escribir hacia el PLC, N8N tiene un agente de IA que tiene commo herramientas dos http request para leer o escribir lo que el cliente solicite mediante trigger de telegram. N8N usa gemini o ollama como modelo de chat.