const validateNameBook = (name) => {
  if (!name) return "Không được bỏ trống tên sách";
  return "";
};

const validateAuthor = (name) => {
  if (!name) return "Không được bỏ trống tên sách";
  return "";
};

const validatePublisher = (Publisher) => {
  if (!Publisher) return "Chọn nhà xuất bản";
  return "";
};

const validateCategories = (categories) => {
  if (!categories) return "Chọn categories";
  return "";
};

const validatePrice = (price) => {
  if (price == 0) return "Nhập đơn giá";
  return "";
};

const validateQuantities = (quantities) => {
  if (quantities == 0) return "Nhập số lượng sách";
  return "";
};

const validateYear = (year) => {
  if (!year) return "Điền năm xuất bản";
  return "";
};

const validateIntroduceBook = (introduce) => {
  if (!introduce) return "Không được bỏ trống giới thiệu sách";
  return "";
};

const validateContent = (content) => {
  if (!content) return "Không được nội dung";
  return "";
};

const validateEuphorbia = (Euphorbia) => {
  if (!Euphorbia) return "Không được bỏ tróng thông điệp";
  return "";
};

const validateUrl = (url) => {
  if (!url) return "Nhập đường dẫn";
  return "";
};

const check_book = {
  validateAuthor,
  validateContent,
  validateEuphorbia,
  validateIntroduceBook,
  validateNameBook,
  validatePrice,
  validateQuantities,
  validateUrl,
  validateYear,
  validatePublisher,
  validateCategories,
};

export default check_book;
