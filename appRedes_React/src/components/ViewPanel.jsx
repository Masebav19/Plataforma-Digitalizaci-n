import "./ViewPanel.css"
import SistemaSVG from "../assets/sistemas.svg?react"
import { useEffect, useRef } from "react"

export default function ViewPanel({Device_items,ProcessValues}){
    const sistemRef = useRef(null)
    useEffect(()=>{
        if (!ProcessValues) return
        const [StorageTank, DistributionTank] = sistemRef.current.getElementsByClassName('cls-24')
        const [BaseStorageTank,BaseDistributionTank] = sistemRef.current.getElementsByClassName('cls-25')
        const BaseHeight = BaseStorageTank.height.baseVal.value
        const StorageLevel = ProcessValues.find(el => el[0] === "StorageLevel")[1]
        StorageTank.setAttribute('height', Math.max(StorageLevel,0)*BaseHeight/100)
        StorageTank.setAttribute('y',BaseStorageTank.y.baseVal.value+(100-Math.max(StorageLevel,0))*BaseHeight/100)

        const BaseHeight2 = BaseDistributionTank.height.baseVal.value
        const DistributionLevel = ProcessValues.find(el => el[0] === "DistributionLevel")[1]
        DistributionTank.setAttribute('height', Math.max(DistributionLevel,0)*BaseHeight2/100)
        DistributionTank.setAttribute('y',BaseDistributionTank.y.baseVal.value+(100-Math.max(DistributionLevel,0))*BaseHeight2/100)

        const Bombas = sistemRef.current.getElementsByClassName('cls-26')
        for(let i = 0; i< Bombas.length;i++){
            if(i === 0){//Bomba1
                const Bomba1State = ProcessValues.find(el => el[0] === "StatePump1")[1]
                Bombas.item(i).style.fill = Boolean(Bomba1State)?"Red":"Green"
                Bombas.item(i+1).style.fill = Boolean(Bomba1State)?"Red":"Green"
            }else if(i===2){
                const Bomba3State = ProcessValues.find(el => el[0] === "StatePump3")[1]
                Bombas.item(i).style.fill = Boolean(Bomba3State)?"Red":"Green"
            }
        }
    },[ProcessValues])
    
    return(
        <div id="ViewPanelContainer">
            <SistemaSVG height="78vh" ref={sistemRef}/>  
        </div>
    )
}