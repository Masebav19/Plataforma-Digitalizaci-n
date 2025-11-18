import { useEffect, useRef, useState } from "react"
import "./ControlPanel.css"
export default function ControlPanel({Device_items, ProcessValues}){
    const START = useRef(null)
    const STOP = useRef(null)
    const StorageLevelValue = useRef(null)
    const DistributionLevelValue = useRef(null)
    const SpStorageLevelValue = useRef(null)
    const SpDistributionLevelValue = useRef(null)
    const SpStorageLevelValueState = useRef(null)
    const SpDistributionLevelValueState = useRef(null)

    useEffect(()=>{
        START.current.addEventListener('pointerdown', (e)=> {
            e.preventDefault()
            StartButton.classList.add('pressed')
            if(!Device_items?.ip_address)return
            const BODY = {
            ip_address: Device_items.ip_address,
            Device_items: Device_items.Device_items,
            data: Object.entries(Device_items.Device_items).map(el => {
                if(el[1]==="Start")return {Address: el[0], Value: 1}
                else return {Address: el[0]}
            })          
            }
            Request({BODY})

        })
        START.current.addEventListener("pointerup", (e) => {
            e.preventDefault()
            StartButton.classList.remove('pressed')
            if(!Device_items?.ip_address)return
            const BODY = {    
            ip_address: Device_items.ip_address,
            Device_items: Device_items.Device_items,
            data: Object.entries(Device_items.Device_items).map(el => {
                if(el[1]==="Start")return {Address: el[0], Value: 0}
                else return {Address: el[0]}
            })            
            }
            Request({BODY})
        })

        STOP.current.addEventListener('pointerdown', (e)=> {
            e.preventDefault()
            StopButton.classList.add('pressed')
            if(!Device_items?.ip_address)return
            const BODY = {
            ip_address: Device_items.ip_address,
            Device_items: Device_items.Device_items,
            data: Object.entries(Device_items.Device_items).map(el => {
                if(el[1]==="Stop")return {Address: el[0], Value: 1}
                else return {Address: el[0]}
            }),           
            }
            Request({BODY})
        })
        STOP.current.addEventListener("pointerup", (e) => {
            e.preventDefault()
            StopButton.classList.remove('pressed')
            if(!Device_items?.ip_address)return
            const BODY = {
            ip_address: Device_items.ip_address,
            Device_items: Device_items.Device_items,
            data: Object.entries(Device_items.Device_items).map(el => {
                if(el[1]==="Stop")return {Address: el[0], Value: 0}
                else return {Address: el[0]}
            })
            }
            Request({BODY})
        })
    },[Device_items])

    useEffect(()=>{
        if (!ProcessValues) return
        StorageLevelValue.current.textContent = `${ProcessValues.find(el => el[0] === "StorageLevel")[1]} %`
        DistributionLevelValue.current.textContent = `${ProcessValues.find(el => el[0] === "DistributionLevel")[1]} %`
        // SpStorageLevelValue.current.value =  ProcessValues.find(el => el[0] === "SpStorageTank")[1]
        // SpDistributionLevelValue.current.value = ProcessValues.find(el => el[0] === "SpDistributionTank")[1]
    },[ProcessValues])
    async function Request({BODY}){
        const result = await fetch('http://localhost:8000/write',{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(BODY)
        })
        return await result.json()
    }

    async function SetSpStorage(e){
        e.preventDefault()
        if(!Device_items?.ip_address)return
        const BODY = {
        ip_address: Device_items.ip_address,
        Device_items: Device_items.Device_items,
        data: Object.entries(Device_items.Device_items).map(el => {
            if(el[1]==="SpStorageTank")return {Address: el[0], Value: Number(SpStorageLevelValue.current.value)}
            else return {Address: el[0]}
        })
        }
        SpStorageLevelValue.current.classList.add('invisible')
        SpStorageLevelValueState.current.classList.remove('invisible')
        Request({BODY})
    }

    async function SetSpDistribution(e){
        e.preventDefault()
        if(!Device_items?.ip_address)return
        const BODY = {
        ip_address: Device_items.ip_address,
        Device_items: Device_items.Device_items,
        data: Object.entries(Device_items.Device_items).map(el => {
            if(el[1]==="SpDistributionTank")return {Address: el[0], Value: Number(SpDistributionLevelValue.current.value)}
            else return {Address: el[0]}
        })
        }
        SpDistributionLevelValueState.current.classList.remove('invisible')
        SpDistributionLevelValue.current.classList.add('invisible')
        Request({BODY})
    }
    return(
        <div id="ControlPanelContaienr">
            <div className="buttonConatiner">
                    <div className="start" ref={START}>
                        <img src="./src/assets/START.svg" alt="START" id="StartButton" className="ControlButton"/>
                        <p>Marcha</p>
                    </div>
                    <div className="stop" ref={STOP}>
                        <img src="./src/assets/STOP.svg" alt="STOP" id="StopButton" className="ControlButton"/>
                        <p>Paro</p>
                    </div>
            </div>
            <div className="SepPointConatiner">
                    <small>SP Tanque de Reserva</small>
                    <div className="spcontainer">
                        <input type="number" id="SpReserva" className="invisible" onKeyDown={(e)=> {if(e.key === "Enter")SetSpStorage(e)}} ref={SpStorageLevelValue}/>
                        <p onClick={(e)=>{
                            SpStorageLevelValueState.current.classList.add('invisible')
                            SpStorageLevelValue.current.classList.remove('invisible')
                            }} ref={SpStorageLevelValueState}>{SpStorageLevelValue.current?.value}</p>
                    </div>
                    <small>SP Tanque de Distribución</small>
                    <div className="spcontainer">
                        <input type="number" id="SpDistrib" className="invisible" onKeyDown={(e)=> {if(e.key === "Enter")SetSpDistribution(e)}} ref={SpDistributionLevelValue}/> 
                        <p onClick={(e)=>{
                            SpDistributionLevelValue.current.classList.remove('invisible')
                            SpDistributionLevelValueState.current.classList.add('invisible')
                            }} ref={SpDistributionLevelValueState}>{SpDistributionLevelValue.current?.value}</p>
                    </div>
                    
                    
            </div>
            <h3>Niveles de los tanques</h3>
            <div className="EstatesConatiner">
                    <small>Tanque de Reserva</small>
                    <p ref={StorageLevelValue}></p>
                    <small>Tanque de Distribución</small>
                    <p ref={DistributionLevelValue}></p>
            </div>
        </div>
    )
}