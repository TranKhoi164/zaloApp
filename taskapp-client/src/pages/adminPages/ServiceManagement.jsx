import React, {useState, useEffect} from 'react'
import { Icon, Spinner, useSnackbar } from 'zmp-ui'
import { ServiceApi } from '../../api/serviceApi'

function ServiceManagement() {
  const {getServicesApi, createServiceApi, deleteServiceApi , deleteServicesApi} = ServiceApi()
  const {openSnackbar} = useSnackbar()
  const [createServiceLoading, setCreateServiceLoading] = useState(false)
  const [services, setServices] = useState([])
  const [serviceName, setServiceName] = useState('')
  const [checkedService, setCheckedService] = useState([])

  console.log(checkedService);
  
  useEffect(() => {
    getServicesApi()
    .then(data => {
      setServices(data?.services)
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message,
      })
    })
  }, [])
  

  const addService = () => {
    if (!serviceName) {
      openSnackbar({
        text: 'Chưa nhập thông tin',
        type: 'warning',
      });
      return
    }
    setCreateServiceLoading(true)
    createServiceApi({name: serviceName})
    .then(data => {
      setCreateServiceLoading(false)
      openSnackbar({
        type: 'success',
        text: data?.message,
      })
      setServices([...services, data?.service])
    }).catch(e => {
      setCreateServiceLoading(false)
      openSnackbar({
        type: 'error',
        text: e?.message,
      })
    }) 
    setServiceName('') 
  }

  const deleteService = (serviceId) => {
    deleteServiceApi({serviceId: serviceId})
    .then(data => {
      openSnackbar({
        type: 'success',
        text: data?.message
      })
      let newServicesArr = services?.filter(service => service?._id != serviceId)
      setServices(newServicesArr)
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }

  const deleteServices = () => {
    deleteServicesApi({servicesId: checkedService})
    .then(data => {
      openSnackbar({
        type: 'success',
        text: data?.message
      })
      let newServicesArr = services?.filter(service => !checkedService?.includes(service?._id))
      setServices(newServicesArr)
      setCheckedService([])
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }


  const handleCheckboxChange = (e) => {
    const {value, checked} = e.target
    //setChecked(true)
    console.log('thisChek', checked);
    setCheckedService([...checkedService, value])
    if (!checked) {
      let newCheckedService = checkedService?.filter(service => service != value)
      setCheckedService(newCheckedService)
    }
  }

  const handleCheckAll = (e) => {
    const {checked} = e.target
    const serviceIds = services?.map(service => {return service?._id})
    if (checked) {
      setCheckedService([...serviceIds])
    } else {
      setCheckedService([])
    }
  }

  return (
    <div className='container-1'>
      <div className='box-1 mt-[20px]'>
        <div className='w-[85%]'>
          <div>Thêm dịch vụ</div>
          <input value={serviceName} type="text" className='text-input-1 mt-[10px]' placeholder='Nhập tên dịch vụ' onChange={(e)=>setServiceName(e.target.value)}  />
          {createServiceLoading
          ? <div className='mt-[10px] flex justify-center'><Spinner /></div>
          : <button className='btn-1 mt-[20px]' onClick={addService}>Thêm</button>}
        </div>
      </div>
      <div className='box-1 mt-[20px] pb-[100px] relative'>
        {checkedService?.length>0&&<div className='absolute top-[5px] right-[5px] text-red-500'><Icon icon='zi-delete' onClick={deleteServices} /></div>}
        <div className='h1'>Danh sách dịch vụ</div>
        
        <div className='list-item-1'>
            <div>
              <input type="checkbox" className='ml-[5px]' name="services" value='checkall' id='checkall' onChange={handleCheckAll}/>
              <label className='ml-[5px]' htmlFor='checkall'>Chọn tất cả</label>
            </div>
          </div>
        {services?.map(service => {
          return <div className='list-item-1' key={service?._id}>
            <div>
              <input type="checkbox" checked={checkedService?.includes(service?._id)} className='ml-[5px]' name="services" value={service?._id} id={service?._id} onChange={handleCheckboxChange}/>
              <label className='ml-[5px]' htmlFor={service?._id}>{service?.name}</label>
            </div>
            <div className='text-red-500 font-bold mr-[5px]' onClick={()=>deleteService(service?._id)}>X</div>
          </div>
        })}
      </div>
    </div>
  )
}

export default ServiceManagement