import React, { useState } from "react";
import PartnerArticle from "./PartnerArticle";
import { AccountApi } from "../../api/accountApi";
import { useSnackbar } from "zmp-ui";
import PartnerPreviewArticle from "./PartnerPreviewArticle";

function UnverifiedPartnerArticle({partner, partners, setPartners}) {
  const [isLoading1, setIsLoading1] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const {verifyPartnerApi, deletePartnerApi} = AccountApi()
  const {openSnackbar} = useSnackbar()

  const verifyPartner = () => {
    setIsLoading1(true)
    verifyPartnerApi({partnerId: partner?._id, partnerEmail: partner?.email})
    .then(data => {
      setIsLoading1(false)
      const unverifiedPartnersArr = partners?.filter(el => el?._id != partner?._id)
      setPartners(unverifiedPartnersArr)
      openSnackbar({
        type: 'success',
        text: data?.message
      })
    }).catch(e => {
      setIsLoading1(false)
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }

  const deletePartner = () => {
    setIsLoading2(true)
    deletePartnerApi({partnerId: partner?._id, partnerEmail: partner?.email})
    .then(data => {
      setIsLoading2(false)
      const unverifiedPartnersArr = partners?.filter(el => el?._id != partner?._id)
      setPartners(unverifiedPartnersArr)
      openSnackbar({
        type: 'success',
        text: data?.message
      })
    }).catch(e => {
      setIsLoading2(false)
      openSnackbar({
        type: 'error',
        text: e?.message
      })
    })
  }

  return (
    <>
      <PartnerPreviewArticle partner={partner} />
      <div className="flex justify-between items-center w-[100%] mb-[20px]">
        {!isLoading1 ? (
          <button
            className="btn-1 rounded-none w-[50%] h-[40px]"
            onClick={verifyPartner}
          >
            Xác nhận
          </button>
        ) : (
          <button className="btn-1 w-[50%] rounded-none h-[40px]">Loading...</button>
        )}
        {!isLoading2 ? (
          <button
            className="btn-1 w-[50%] rounded-none bg-[#bababa] h-[40px]"
            onClick={deletePartner}
          >
            Hủy bỏ
          </button>
        ) : (
          <button className="btn-1 rounded-none w-[50%] bg-[#bababa] h-[40px]">
            Loading...
          </button>
        )}
      </div>
    </>
  );
}

export default UnverifiedPartnerArticle;
