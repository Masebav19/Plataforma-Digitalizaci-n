
import { useEffect, useRef, useState } from 'react'
import './App.css'
import ControlPanel from './components/ControlPanel'
import ViewPanel from './components/ViewPanel'
import Init from './components/init'

function App() {
  const [Device_items, SetDeviceItems] = useState(undefined)
  const [ProcessValues, SetProcessValues] = useState(undefined)
  const socket = useRef(null)
  useEffect(()=>{
    if (socket.current){
      window.addEventListener('beforeunload',(e)=>{
        e.preventDefault()
        socket.current.close();
      })
    }
    if(!Device_items) return
    socket.current = new WebSocket("ws://localhost:8000/ws");

    socket.current.onopen = () => {
      console.log('Conexión correcta')
      socket.current.send(
        JSON.stringify({
          ip_address: Device_items.ip_address,
          Device_items: Device_items.Device_items,
          data: Object.entries(Device_items.Device_items).map(el => {return {Address: el[0]}})
        })
      );
    };

    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      SetProcessValues(Object.entries(data));
    };

    socket.current.onclose = () => console.log("Conexión WebSocket cerrada");

    //return () => socket.current.close();
  },[Device_items])
  
  return (
    <>
      <main>
        {!Device_items &&
          <Init
          SetDeviceItems = {SetDeviceItems}
          />
        }
        <ControlPanel
        Device_items={Device_items}
        ProcessValues={ProcessValues}
        />
        <ViewPanel
        Device_items={Device_items}
        ProcessValues={ProcessValues}
        />
      </main>
      <footer>
        <div>
          <small><strong>Departamento de automatización y control</strong></small>
          <small>Dr. Ing. Danilo Chávez - Jefe de Departamento</small>
        </div>
        <div>
          <small>(+593) 2 2976 300 - Extensión 2215</small>
        <small><a href="mailto://departamento.automatizacion@epn.edu.ec">departamento.automatizacion@epn.edu.ec</a></small>
        </div>   
      </footer>
    </>
  )
}

export default App
