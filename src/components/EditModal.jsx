import PropTypes from 'prop-types';

function EditModal({ editModalRef, tempProduct, closeModal, handleProductInfo, handleImage, addImage, deleteImage, editProduct }) {
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
                      <div className="col-12 mb-2">
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="is_enabled" name="is_enabled" checked={tempProduct.is_enabled} onChange={handleProductInfo} />
                          <label className="form-check-label" htmlFor="is_enabled">
                            是否啟用
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
                          <label htmlFor="imageUrl" className="form-label mb-1">商品主圖</label>
                          <input type="text" className="form-control" id="imageUrl" name="imageUrl" value={tempProduct.imageUrl} onChange={handleProductInfo} />
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
    handleProductInfo: PropTypes.func,
    handleImage: PropTypes.func,
    addImage: PropTypes.func,
    deleteImage: PropTypes.func,
    editProduct: PropTypes.func
};
