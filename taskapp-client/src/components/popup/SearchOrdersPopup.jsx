import React, { useEffect, useState } from 'react'
import { ServiceApi } from '../../api/serviceApi'
import axios from 'axios'
import { OrderApi } from '../../api/orderApi'
import { queryUrlServer } from '../../utils/stringFunc'
import { Spinner } from 'zmp-ui'

const provinces_api_url = 'https://provinces.open-api.vn/api'

function SearchOrdersPopup({loadOrders, setHasMore, searchObj, setSearchObj, setOpenSearch}) {
  const {getServicesApi} = ServiceApi()
  const {getOrdersApi} = OrderApi()
  const [services, setServices] = useState([])
  const [provinces, setProvinces] = useState([])
  const [isFinding, setIsFinding] = useState(false)

  useEffect(() => {
    getServicesApi()
    .then(data => {
      setServices(data?.services)
    })
    .catch(e => {
      throw new Error(e)
    })
    axios.get(provinces_api_url+ '/p/')
    .then(data => {
      setProvinces(data?.data)
    }).catch(e => { 
      throw new Error(e)
    })
  }, [])

  const handleChange = (e) => {
    const {name, value} = e?.target

    setSearchObj({...searchObj, [name]: value})
  }
  console.log(searchObj);
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setHasMore(true)
    loadOrders(1, true)
  }

  return (
    <div className='box-1 w-[100%] relative'>
      <div className='absolute top-[10px] right-[20px] text-blue-500' onClick={()=>setOpenSearch(false)}>Close</div>
      <form className='w-[90%]' onSubmit={handleSubmit}>
        <input type="text" placeholder='Tên khách hàng' name='userName' value={searchObj?.userName} onChange={handleChange} className='text-input-1 mt-[25px]' />
        <input type="number" placeholder='Sđt' name='phoneNumber' value={searchObj?.phoneNumber} onChange={handleChange} className='text-input-1 mt-[20px]' />
        <input type="text" name='date' onChange={handleChange} value={searchObj?.date} placeholder="Thời gian" class="text-input-1 mt-[20px]" onFocus={(e)=>e.target.type = 'date'} onBlur={(e)=>e.target.type = 'text'}  />
        <select className='text-input-1 mt-[20px]' value={searchObj?.service} name='service' onChange={handleChange}>
          <option selected value=''>Dịch vụ</option>
          {services?.map(service => {
            return <option value={service?._id}>{service?.name}</option>
          })}
        </select>
        <select className='text-input-1 mt-[20px]' value={searchObj?.location} name='location' onChange={handleChange}>
          <option selected value=''>Vị trí</option>
          {provinces?.map(province => {
            return <option value={province?.name}>{province?.name}</option>
          })}
        </select>
        {
          isFinding 
          ? <Spinner />
          : <button type='submit' className='btn-2 mt-[20px] bg-blue-500'>Tìm kiếm</button>
        }
      </form>
    </div>
  )
}

export default SearchOrdersPopup