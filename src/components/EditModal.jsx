import PropTypes from 'prop-types';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useState } from 'react';

function EditModal({ editModalRef, tempProduct, closeModal, editProduct, setTempProduct }) {
    const {VITE_BASE_URL, VITE_API_PATH} = import.meta.env;
    const [imageSelected, setImageSelected] = useState(null);

    // 編輯商品
    const handleProductInfo = (e) => {
      const { name, value, type, checked } = e.target;

      setTempProduct({
        ...tempProduct,
        [name]: type === 'checkbox' ? checked : value
      })
    };

    const handleImage = (e, idx) => {
      const images = [...tempProduct.imagesUrl];
      images[idx] = e.target.value;
      setTempProduct({
        ...tempProduct,
        imagesUrl: images
      });
    };

    const addImage = () => {
      const images = [...tempProduct.imagesUrl];
      images.push('');
      setTempProduct({
        ...tempProduct,
        imagesUrl: images
      });
    };
  
    const deleteImage = () => {
      const images = [...tempProduct.imagesUrl];
      images.pop();
      setTempProduct({
        ...tempProduct,
        imagesUrl: images
      });
    };

    const chooseImage = (e) => {
      const fd = new FormData();
      fd.append('file', e.target.files[0]);
      setImageSelected(fd);
    };

    const uploadImage = async () => {
      try {
        const res = await axios.post(`${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/upload`, imageSelected);
        setTempProduct({
          ...tempProduct,
          imageUrl: res.data.imageUrl
        });
        Swal.fire({
          position: "center",
          icon: "success",
          title: '上傳成功！',
          showConfirmButton: false,
          timer: 1500
        });
      } catch (error) {
        alert(error.response.message?.message);
      }
    };

    return (
            <div className="modal fade" ref={editModalRef} id="editModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">{ tempProduct.id ? '編輯' : '新增' }商品</h1>
                    <button type="button" className="btn-close"onClick={closeModal}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-6 mb-2">
                        <label htmlFor="title" className="form-label mb-1">商品名稱</label>
                        <input type="text" className="form-control" id="title" name="title" placeholder="請輸入商品名稱" value={tempProduct.title} onChange={handleProductInfo} />
                      </div>
                      <div className="col-6 mb-2">
                        <label htmlFor="category" className="form-label mb-1">商品種類</label>
                        <input type="text" className="form-control" id="category" name="category" placeholder="請輸入商品種類" value={tempProduct.category} onChange={handleProductInfo} />
                      </div>
                      <div className="col-6 mb-2">
                        <label htmlFor="origin_price" className="form-label mb-1">原價</label>
                        <input type="number" min="0" className="form-control" id="origin_price" name="origin_price" placeholder="請輸入原價" value={tempProduct.origin_price} onChange={handleProductInfo} />
                      </div>
                      <div className="col-6 mb-2">
                        <label htmlFor="price" className="form-label mb-1">售價</label>
                        <input type="number" min="0" className="form-control" id="price" name="price" placeholder="請輸入售價" value={tempProduct.price} onChange={handleProductInfo} />
                      </div>
                      <div className="col-6 mb-2">
                        <label htmlFor="unit" className="form-label mb-1">單位</label>
                        <input type="text" className="form-control" id="unit" name="unit" placeholder="請輸入單位" value={tempProduct.unit} onChange={handleProductInfo} />
                      </div>
                      <div className="col-6 mb-2">
                        <label htmlFor="description" className="form-label mb-1">商品描述</label>
                        <input type="text" className="form-control" id="description" name="description" placeholder="請輸入商品描述" value={tempProduct.description} onChange={handleProductInfo} />
                      </div>
                      <div className="col-12 mb-2">
                        <label htmlFor="content" className="form-label mb-1">商品內容</label>
                        <textarea className="form-control" id="content" name="content" placeholder="請輸入商品內容" value={tempProduct.content} onChange={handleProductInfo} />
                      </div>
                      <div className="col-6 mb-2">
                        <label htmlFor="description" className="form-label mb-1">所屬地區</label>
                        <select className="form-select" name="location" value={tempProduct.location} onChange={handleProductInfo}>
                          <option value="" disabled>請選擇</option>
                          <option value="北部">北部</option>
                          <option value="中部">中部</option>
                          <option value="南部">南部</option>
                          <option value="東部">東部</option>
                        </select>
                      </div>
                      <div className="col-6 mb-2">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" checked={tempProduct.is_enabled} onChange={handleProductInfo} />
                          <label className="form-check-label" htmlFor="is_enabled">
                            是否啟用
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                          <label htmlFor="imageUrl" className="form-label mb-1">商品主圖</label>
                          <div className="input-group">
                            <input type="file" className="form-control" id="imageUrl" onChange={(e) => chooseImage(e)}/>
                            <button className="btn btn-outline-secondary" type="button" onClick={uploadImage}>上傳</button>
                          </div>
                          <img src={tempProduct.imageUrl} className="img-fluid" alt={tempProduct.title} />
                      </div>
                      <div className="col-8">
                          <label htmlFor="imageUrl" className="form-label mb-1">商品圖片</label>
                          <div className="row mb-2">
                            {
                              tempProduct.imagesUrl && tempProduct.imagesUrl.map((img, idx) => {
                                return (
                                  <div className="col-6" key={idx}>
                                    <input type="text" className="form-control" value={img} onChange={(e) => handleImage(e, idx)} />
                                    <img src={img} className="img-fluid" alt="商品圖片" />
                                  </div>
                                )
                              })
                            }
                          </div>
                          <div className="btn-group w-100">
                            {
                              tempProduct.imagesUrl.length < 5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] && (<button className="btn btn-outline-primary btn-sm w-100" onClick={addImage}>新增圖片</button>)
                            }
                            {
                              tempProduct.imagesUrl.length > 1 && (
                                <button className="btn btn-outline-danger btn-sm w-100" onClick={deleteImage}>取消圖片</button>
                              )
                            }
                            
                          </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary btn-sm me-1" onClick={closeModal}>取消</button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={editProduct}>儲存</button>
                  </div>
                </div>
              </div>
          </div>
    )
};

export default EditModal;

EditModal.propTypes = {
    editModalRef: PropTypes.object,
    tempProduct: PropTypes.object,
    closeModal: PropTypes.func,
    editProduct: PropTypes.func,
    setTempProduct: PropTypes.func
};
