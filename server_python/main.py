from fastapi import FastAPI, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from Models.mongodb import MongoClient
from Scripts.PLCcomm import ReadPLC_data, WritePLC_data 
import json

server = FastAPI()
server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # List of allowed origins
    allow_credentials=True,  # Allow cookies and authorization headers
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all HTTP headers
)

@server.websocket('/ws')
async def Lectura(websocket: WebSocket):
    await websocket.accept()
    init_msg = await websocket.receive_text()
    json_data = json.loads(init_msg)
    data = json_data['data']
    ip_address = json_data['ip_address']
    Device_items = json_data['Device_items']
    try:
        n=0
        while True:
            result = ReadPLC_data(data,ip_address,Device_items) ##leer datos del PLC
            mongoclient = MongoClient()
            #mongoclient.WriteData(data=result,Device_items=Device_items)
            await websocket.send_json(result)
            mongoclient.WriteData(data=result)
            await asyncio.sleep(0.1) #retardo de 100 ms por envío
    except Exception as e:
        print("Conexion cerrada: ",e)
        await websocket.close()

@server.post("/write")
async def write_data(request: Request):
    result = await request.json()
    data = result['data']
    ip_addres = result['ip_address']
    Device_items = result['Device_items']
    result = WritePLC_data(data=data,IP_PLC=ip_addres, Device_items=Device_items)
    mongoclient = MongoClient()
    result = mongoclient.WriteData(data=result)
    return {"Result": result.acknowledged}

@server.get('/readAll')
async def Read_All():
    mongoclient = MongoClient()
    data = mongoclient.readAllData()
    return data
@server.post('/GetPLCData')
async def GetPLC_data(request: Request):
    data, ip_addres,Device_items = (await request.json()).values()
    result = ReadPLC_data(data=data,IP_PLC=ip_addres, Device_items=Device_items)
    return result
    