import { OPCUAClient, AttributeIds, DataType } from "node-opcua-client";
import dotenv from "dotenv";
dotenv.config();

const endpointUrl = process.env.ENDPOINT_URL;

export class OPCUA_Client {
    constructor() {
        this.client = OPCUAClient.create({ 
            endpointMustExist: false,
            connectionStrategy: {
                maxRetry: 10,
                initialDelay: 2000,
                maxDelay: 10000
            }
        });
        this.session = null;
    }

    // Se ejecuta una sola vez al arrancar Express
    async connect() {
        try {
            console.log(`[OPC UA] Client trying to connecto to: ${endpointUrl}...`);
            await this.client.connect(endpointUrl);
            this.session = await this.client.createSession();
            console.log("[OPC UA] Connection established");
        } catch (error) {
            console.error("[OPC UA] Error:", error);
            throw error;
        }
    }

    // Método ultra-rápido para Express
    async ReadItems() {
        if (!this.session) {
            throw new Error("[OPC UA] The OPC Session is not stablished");
        }

        const readItems = [process.env.NIVEL1_ITEM, process.env.NIVEL2_ITEM, process.env.STB1_ITEM, process.env.STB2_ITEM,
         process.env.SPTK1_ITEM, process.env.SPTK2_ITEM, process.env.MARCHA_ITEM, process.env.PARO_ITEM   
        ];
        try{
            const dataValues = await this.session.readVariableValue(readItems);
            return dataValues.map(dv => dv.value ? dv.value.value : null);      
        }catch(Error){
            console.error("[OPC UA] Error: ", Error)
            return {"Error": Error}
        }
    }

    async WriteItems(ItemsValues=[]){

        if (!this.session) {
            throw new Error("[OPC UA] The OPC Session is not stablished");
        }
        
        const itemsValues = [
            {
                nodeId: process.env.MARCHA_ITEM,
                attributeId: AttributeIds.Value,
                value:{ 
                    value:{
                        value: Boolean(ItemsValues.find(item =>{
                            return item.name === "Marcha"
                        })?.value||0),
                        dataType: DataType.Boolean
                    }
                }
            },
            {
                nodeId: process.env.PARO_ITEM,
                attributeId: AttributeIds.Value,
                value: {
                    value:{
                        value: Boolean(ItemsValues.find(item =>{
                            return item.name === "Paro"
                        })?.value||0),
                        dataType: DataType.Boolean
                    }
                }
            },
            {
                nodeId: process.env.SPTK1_ITEM,
                attributeId: AttributeIds.Value,
                value:{ 
                    value:{
                        value: ItemsValues.find(item =>{
                            return item.name === "SP1"
                        })?.value||0.0,
                        dataType: DataType.Float
                    }
                }
            },
            {
                nodeId: process.env.SPTK2_ITEM,
                attributeId: AttributeIds.Value,
                value: {
                    value:{
                        value:ItemsValues.find(item =>{
                            return item.name === "SP2"
                        })?.value||0.0,
                        dataType:DataType.Float
                    }
                }
            }
        ]
        try{
            const status = await this.session.write(itemsValues)
            return {status: status.map(st=>{return st.description==="The operation succeeded."?true:false})}
        }catch(Error){
            console.error("[OPC UA] Error: ", Error)
            return {"Error": Error}
        }
        
    }
    // Se ejecuta si Express se apaga
    async disconnect() {
        if (this.session) await this.session.close();
        await this.client.disconnect();
        console.log("[OPC UA] Disconnected");
    }
}

// Exportamos una única instancia activa (Singleton)
export const opcuaClientInstance = new OPCUA_Client();
