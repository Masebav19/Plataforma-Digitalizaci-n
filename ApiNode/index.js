import express from "express"
import {OPCUA_Client} from "./controllers/OPCUAClient.js"

const app = express()
app.use(express.json())


app.get('/',(req,res)=>{
    res.send("Hola Mateo en que te puedo ayudar?")
})

app.get('/lectura',async(req,res)=>{//Obtención de los niveles de los dos tanques
    const client = new OPCUA_Client()
    await client.connect()
    const value = await client.ReadItems()
    await client.disconnect()
    res.json({value:value})
})

app.post('/escritura',async(req,res)=>{
    const ItemsValues = req.body
    const client = new OPCUA_Client()
    await client.connect()
    const status = await client.WriteItems(ItemsValues)
    await client.disconnect()
    res.json(status)
})

app.listen(process.env.PORT||1234,()=>{
    console.log(`[SERVER] Servidor escuchando en el puerto ${process.env.PORT||1234}`)
})