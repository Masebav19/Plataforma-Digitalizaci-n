from pycomm3 import SLCDriver

def ReadPLC_data(data:list,IP_PLC:str,Device_items:dict)-> dict:
    PLCCon = SLCDriver(IP_PLC)
    PLCCon.open()
    result = {}
    for dir in data:
        Result = PLCCon.read(dir["Address"])
        result[Device_items[dir["Address"]]] = Result.value
    PLCCon.close
    return result

def WritePLC_data(data:list,IP_PLC:str,Device_items:dict) -> dict:
    PLCCon = SLCDriver(IP_PLC)
    PLCCon.open()
    result = {}
    for dir in data:
        try:
            Result = PLCCon.write((dir['Address'],dir['Value']))
            result[Device_items[dir["Address"]]] = dir['Value']
        except:
            Result = PLCCon.read(dir['Address'])
            result[Device_items[dir["Address"]]] = Result.value
    PLCCon.close()
    return result