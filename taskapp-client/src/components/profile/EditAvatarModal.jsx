import React, { useState } from "react";
import Modal from "react-modal";
import Avatar from 'react-avatar-edit'

const customStyles = {
  content: {
    width: '90%',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
};

function EditAvatarModal({ modalIsOpen, setModalIsOpen, preview, setPreview, src, setSrc }) {

  function closeModal() {
    setModalIsOpen(false);
  }

  const onClose = () => {
    setPreview(null)
  }
  
  const onCrop = (preview) => {
    setPreview(preview)
  } 

  // const onBeforeFileLoad = (elem) => {
  //   if(elem.target.files[0].size > 71680){
  //     alert("File is too big!");
  //     elem.target.value = "";
  //   };
  // }

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <Avatar
          width={300}
          height={300}
          onCrop={onCrop}
          onClose={onClose}
          // onBeforeFileLoad={onBeforeFileLoad}
          src={src}
        />
        <img src={src} alt="image" />
        <div className="mt-[20px]">
          <button className="btn-2" onClick={() => closeModal()}>LƯU</button>
          <button className="btn-2 ml-[20px]" onClick={() => closeModal()}>ĐÓNG</button>
        </div>
      </Modal>
    </div>
  );
}

export default EditAvatarModal;
