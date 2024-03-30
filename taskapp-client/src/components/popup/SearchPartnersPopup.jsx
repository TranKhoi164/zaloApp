import React, { useEffect, useState } from 'react'
import { ServiceApi } from '../../api/serviceApi'
import axios from 'axios'
import { OrderApi } from '../../api/orderApi'
import { queryUrlServer } from '../../utils/stringFunc'
import { Spinner } from 'zmp-ui'

const provinces_api_url = 'https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json'

function SearchPartnersPopup({loadPartners, isFinding, setCurrentPage, setHasMore, setOpenSearch, searchObj, setSearchObj}) {
  const {getServicesApi} = ServiceApi()
  const {getOrdersApi} = OrderApi() 
  const [services, setServices] = useState([])
  const [provinces, setProvinces] = useState([])

  useEffect(() => {
    getServicesApi()
    .then(data => {
      setServices(data?.services)
    })
    .catch(e => {
      throw new Error(e)
    })
    axios.get(provinces_api_url)
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
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    loadPartners(1, true)
    setHasMore(true)
    setCurrentPage(1) 
  }


  return (
    <div className='box-1 w-[100%] relative'>
      <div className='absolute top-[10px] right-[8%] text-[#1f96ff]' onClick={()=>setOpenSearch(false)}>Close</div>
      <form className='w-[85%]' onSubmit={handleSubmit}>
        <input type="text" placeholder='Tên đơn vị' name='partnerName' value={searchObj?.partnerName} onChange={handleChange} className='text-input-1 mt-[20px]' />
        <input type="number" placeholder='Sđt' name='phoneNumber' value={searchObj?.phoneNumber} onChange={handleChange} className='text-input-1 mt-[20px]' />
        <select className='text-input-1 mt-[20px]' value={searchObj?.services} name='services' onChange={handleChange}>
          <option selected value=''>Dịch vụ</option>
          {services?.map(service => {
            return <option value={service?._id}>{service?.name} </option>
          })}
        </select>
        <select className='text-input-1 mt-[20px]' value={searchObj?.location} name='location' onChange={handleChange}>
          <option selected value=''>Vị trí</option>
          {provinces?.map(province => {
            return <option value={province?.Name}>{province?.Name}</option>
          })}
        </select>
        {
          isFinding 
          ? <div className='mt-[10px]'><Spinner /></div>
          : <button type='submit' className='btn-2 mt-[20px] bg-[#1f96ff]'>Tìm kiếm</button>
        }
      </form>
    </div>
  )
}

export default SearchPartnersPopup