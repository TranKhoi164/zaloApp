import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AccountApi } from "../api/accountApi";
import MarkdownContent from "../components/MarkdownContent";
import { objectToString, watchMoreString } from "../utils/stringFunc";
import ImageListDialog from "../components/dialog/ImageListDialog";
import { Icon, Spinner, useSnackbar } from "zmp-ui";
import Chip from "../components/ChipComponent";
import OrderServiceDialog from "../components/dialog/OrderServiceDialog";
import { unLoggedInWarning } from "../utils/warning";
import { useRecoilState, useRecoilValue } from "recoil";
import { accountState } from "../State";

function PartnerDetail() {
  const { partner_id } = useParams();
  const [account, setAccount] = useRecoilState(accountState)  
  const [partner, setPartner] = useState({});
  const { getAccountInforApi, updateBasicApi } = AccountApi();
  const {openSnackbar} = useSnackbar()
  const [imageListDialog, setImageListDialog] = useState(false)
  const [imageList, setImageList] = useState([])
  const [orderDialog, setOrderDialog] = useState(false)
  const [favPartnerLoading, setFavPartnerLoading] = useState(false)


  useEffect(() => {
    getAccountInforApi({ accountId: partner_id })
      .then((data) => {
        setPartner(data?.account);
      })
      .catch((e) => {
        openSnackbar({
          type: 'error',
          text: e?.message
        })
      });
  }, []);
  

  const checkLoggedAccount = () => {
    return Object.keys(account).length!=0
  }


  const openImageListDialog = (arr) => {
    setImageList(arr)
    setImageListDialog(true)
  }

  const orderService = () => {
    // if (Object.values(account)?.length <= 0) {
    //   openSnackbar({
    //     type: 'warning',
    //     text: unLoggedInWarning
    //   })
    //   return
    // }
    // 
    if (!partner.verified) {
      openSnackbar({
        type: 'warning',
        text: 'Đơn vị chưa được xác nhận'
      })
      return
    }
    setOrderDialog(true)
  }

  const addToFavPartner = () => {
    if (!partner.verified) {
      openSnackbar({
        type: 'warning',
        text: 'Đơn vị chưa được xác nhận'
      })
      return
    }
    if (!checkLoggedAccount()) {
      openSnackbar({
        type: 'warning',
        text: unLoggedInWarning
      })
      return
    }
    setFavPartnerLoading(true)
    updateBasicApi({favouritePartners: [...account?.favouritePartners||[], partner?._id]})
    .then(data => {
      setFavPartnerLoading(false)
      openSnackbar({
        type: 'success',
        text: 'Đã thêm vào đơn vị yêu thích!'
      })
      setAccount({...account, favouritePartners: [...account?.favouritePartners||[], partner?._id]})
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }

  const removeFromFavPartner = () => {
    setFavPartnerLoading(true)
    const newFavPartnersArr = account?.favouritePartners?.filter(el => el != partner?._id)
    updateBasicApi({ favouritePartners: newFavPartnersArr })
    .then(data => {
      setFavPartnerLoading(false)
      openSnackbar({
        type: 'success',
        text: 'Đã xóa khỏi đơn vị yêu thích!'
      })
      setAccount({...account, favouritePartners: newFavPartnersArr})
    }).catch(e => {
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }

  return (
    <div className="container-1">
      {orderDialog && <OrderServiceDialog setDialog={setOrderDialog} services={partner?.services} partnerId={partner?._id}/>}
      {imageListDialog && <ImageListDialog imageList={imageList} setImageListDialog={setImageListDialog} />}
      <div className='w-[100%]'>
        {/* //todo: cover image */}
        {partner?.cover
        ?<img src={partner?.cover}  onClick={()=>openImageListDialog([partner?.cover])} alt="cover" className='cover-1' />
        :<div className="cover-1"></div>}
      </div>
      
      <div className="w-[100%] box-1 relative flex justify-center box-shadow-1">
        <div className="avatar-container">
          <img src={partner?.avatar} onClick={()=>openImageListDialog([partner?.avatar])} alt="avatar" className="avatar-2 h-[150px] w-[150px]" />
          <div className="h1 text-center leading-7">{watchMoreString(partner?.partnerName, 50)}</div>
        </div>
        {/* ..//todo:  order btn */}
        <div className="w-[100%] mt-[140px] border-t-[1px] border-[#a0a0a0]"></div>
        <div className="mt-[10x] w-[95%] pt-7 flex justify-around items-center">
          <button className="btn-4 w-[85%]" onClick={orderService}>Đặt dịch vụ</button>
          {favPartnerLoading 
          ? <Spinner className="w-[10%] h-[35px]" />
          : account?.favouritePartners?.includes(partner?._id)
            ? <button className="w-[10%] h-[35px] border-[1px] rounded border-[#1f96ff] text-[#1f96ff]" onClick={removeFromFavPartner}><Icon icon="zi-star-solid" /></button>
            : <button className="w-[10%] h-[35px] border-[1px] rounded border-[#1f96ff] text-[#1f96ff]" onClick={addToFavPartner}><Icon icon="zi-star" /></button>
          }
        </div>
        <div className="w-[95%] flex items-cente flex-wrap border-[#1f96ff] mt-[10px] text-[#1f96ff]">
          {partner?.services?.map(service => <Chip key={service?._id} el={service?.name} />)}
          {partner?.location?.map(el => <Chip key={el} el={el} />)}
        </div>
      </div>

      
      
      <div className="container-1 box-shadow-1 bg-white w-[100%] mt-[15px] pb-5">
        <div className="h1 w-[95%] mt-5 mb-5">Thông tin liên hệ</div>
        <div className="w-[95%] mt-[1px] pt-9 pb-3 text-[17px] font-[400] text-[#686868] border-t-[1px] border-[#a0a0a0] border-dashed">
          {/* //todo: email and phoneNumber */}
          <div className="mb-[20px]">
            <Icon icon='zi-call' /> {partner?.phoneNumber}
          </div>
          <div className="mb-[20px]">
            <Icon icon='zi-at' /> {partner?.email}
          </div>
          {/* //todo: address list */}
          <div>
            {partner?.addresses?.map(address => {
              return <div className="mb-[20px]" key={address?._id}>
                <Icon icon='zi-location' /> 
                {objectToString({a: address.address, b: address.ward, c: address.district, d: address.province})}
              </div>
            })}
          </div>
        </div>
      </div>

      {partner?.details?.length != 0 && 
      <div className="container-1 box-shadow-1 w-[100%] bg-white mt-[15px] pb-5">
        <div className="h1 mt-5 mb-5 w-[100%] ml-5">Chi tiết</div>
        {/* //todo: detail list */}
        <div className="w-[95%] pt-9 border-t-[1px] border-[#a0a0a0] border-dashed">
          {partner?.details?.map(detail => {
            return <div className="flex justify-between text-[#686868] mb-[20px]" key={detail?._id}>
              <div className="max-w-[49%] font-[500] text-[#686868]">{detail?.name}</div>
              <div className="max-w-[49%]">{detail?.value}</div>
            </div>
          })}
        </div>
      </div>}


      <div className="container-1 w-[100%] min-h-[100px] bg-white mt-[15px]">
        <div className="h1 mt-5 mb-5 w-[100%] ml-5">Giới thiệu</div>
        <div className="w-[95%] pt-9 border-t-[1px] border-[#a0a0a0] border-dashed pb-[100px]">
          <MarkdownContent title='' content={partner?.description} />
        </div>
      </div>
    </div>
  );
}

export default PartnerDetail;
