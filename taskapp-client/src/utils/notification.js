
export const partnerEditInforTitle = (partnerName) => {
  return  `Đơn vị ${partnerName} thay đổi thông tin`
}
export const partnerEditInforBody = (partnerName, partnerId, editedField, oldValue) => {
  return `[Đơn vị ${partnerName}](/partner_detail/${partnerId}) chỉnh sửa thông tin **${editedField}**. Giá trị cũ: **${oldValue}**`
}
export const userOrderTitle = () => {
  return `Bạn có đơn hàng mới`
}
// service name
export const userOrderBody = (userName, service) => {
  return `Khách hàng ${userName} muốn sử dụng dịch vụ ${service}`
}

export const userChangeOrderStatusTitle = (orderId, userName, newStatus) => {
  return `Người dùng ${userName} chuyển đơn hàng mã ${orderId} sang trạng thái '${newStatus}'`
}

export const userChangeOrderStatusBody = (orderId, userName, newStatus) => {
  return `Người dùng ${userName} chuyển đơn hàng mã ${orderId} sang trạng thái '${newStatus}'`
}

export const partnerChangeOrderStatusTitle = (orderId ,partnerName, newStatus) => {
  return `Đơn vị ${partnerName} chuyển đơn hàng mã ${orderId} sang trạng thái '${newStatus}'`
}

export const partnerChangeOrderStatusBody = (orderId ,partnerName, newStatus) => {
  return `Đơn vị ${partnerName} chuyển đơn hàng mã ${orderId} sang trạng thái '${newStatus}'`
}

