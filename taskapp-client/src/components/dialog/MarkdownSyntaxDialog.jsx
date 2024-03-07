import React from "react";

function MarkdownSyntaxDialog({ setOpenDialog }) {
  const closeDialog = () => {
    setOpenDialog(false)
  }

  return (
    <div className="dialog-1">
      <div onClick={closeDialog} className='mt-[20px] text-red-400 font-bold w-[95%] text-[20px] flex justify-end'>X</div>
      <div className="mt-[20px] ml-[20px]">
        <div>
          <div className='h1'># Header 1</div>
          <div className='h2'>## Header 2</div>
        </div>
        <ul>
          <li>Để xuống dòng, ấn cách 2 lần rồi enter</li>
          <li>Để dòng trống ở giữa để tạo đoạn văn mới</li>
          <li>
            In đậm: <strong>**chữ đậm**</strong>
          </li>
          <li>
            In nghiêng: <i>*chữ nghiêng*</i>
          </li>
          <li>
            In nghiêng + đậm:{" "}
            <strong>
              <i>***chữ***</i>
            </strong>
          </li>
        </ul>
        <div>
          <h2>Ảnh</h2>
          <div>![mô tả ảnh](đường dẫn ảnh)</div>
        </div>
        <div>
          <h2>Links</h2>
          <div>[hiển thị đường dẫn](đường dẫn)</div>
        </div>
      </div>
    </div>
  );
}

export default MarkdownSyntaxDialog;
