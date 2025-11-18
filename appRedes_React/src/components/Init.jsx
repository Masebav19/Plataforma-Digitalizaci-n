import "./Init.css"
export default function Init({SetDeviceItems}){
    async function InitProcess(formData){
        const items = [
            [formData.get("Start"),"Start"],
            [formData.get("Stop"),"Stop"],
            [formData.get("StorageLevel"),"StorageLevel"],
            [formData.get("DistributionLevel"),"DistributionLevel"],
            [formData.get("SpStorageTank"),"SpStorageTank"],
            [formData.get("SpDistributionTank"),"SpDistributionTank"],
            [formData.get("StatePump3"),"StatePump3"],
            [formData.get("StatePump2"),"StatePump2"],
            [formData.get("StatePump1"),"StatePump1"],

        ]
        const obj = Object.fromEntries(items)
        SetDeviceItems({
            Device_items:{
                ...obj
            },
            ip_address: formData.get("ip_address")
        })
    }
    return(
        <div id="fill">
            <div id="initConatiner">
                <h5>Ingrese las direcciones de las variables</h5>
                <form action={InitProcess}>
                    <label htmlFor="Start">Marcha</label>
                    <input type="text" id="Start" name="Start" required defaultValue={"B3:0/0"}/>
                    <label htmlFor="Stop">Paro</label>
                    <input type="text" id="Stop" name="Stop" required defaultValue={"B3:0/1"}/>
                    <label htmlFor="StorageLevel">Nivel del tanque de reserva</label>
                    <input type="text" id="StorageLevel"  name="StorageLevel" required defaultValue={"N7:1"}/>
                    <label htmlFor="DistributionLevel">Nivel del tanque de distribución</label>
                    <input type="text" id="DistributionLevel" name="DistributionLevel" required defaultValue={"N7:0"}/>
                    <label htmlFor="SpStorageTank">Set Point de nivel del tanque de reserva</label>
                    <input type="text" id="SpStorageTank" name="SpStorageTank" required defaultValue={"N7:9"}/>
                    <label htmlFor="SpDistributionTank">Set Point de nivel del tanque de distribución</label>
                    <input type="text" id="SpDistributionTank" name="SpDistributionTank" required defaultValue={"N7:8"}/>
                    <label htmlFor="StatePump3">Estado de la bomba 3</label>
                    <input type="text" id="StatePump3" name="StatePump3" required defaultValue={"B3:1/2"}/>
                    <label htmlFor="StatePump2">Estado de la bomba 2</label>
                    <input type="text" id="StatePump2" name="StatePump2" required defaultValue={"B3:1/1"}/>
                    <label htmlFor="StatePump1">Estado de la bomba 1</label>
                    <input type="text" id="StatePump1" name="StatePump1" required defaultValue={"B3:1/0"}/>
                    <label htmlFor="ip_address">Dirección IP del PLC</label>
                    <input type="text" id="ip_address" name="ip_address" required defaultValue={"192.168.10.21"}/>
                    <button>Iniciar</button>
                </form>        
            </div>
        </div>
    )
}