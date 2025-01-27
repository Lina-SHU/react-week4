import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRef } from "react";
import { Modal } from "bootstrap";

const init_product = {
  title: '',
  category: '',
  origin_price: 0,
  price: 0,
  description: '',
  content: '',
  unit: '',
  is_enabled: false,
  imageUrl: '',
  imagesUrl: ['']
};

function App() {
  const {VITE_BASE_URL, VITE_API_PATH} = import.meta.env;
  const [account, setAccount] = useState({ username: '', password: '' });
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempProduct, setTempProduct] = useState(init_product);

  const editModalRef = useRef(null);
  const editModal = useRef(null);

  const handleAccount = (e) => {
    const { name, value } = e.target;
    setAccount({
      ...account,
      [name]: value
    });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${VITE_BASE_URL}/admin/signin`, account);
      
      document.cookie = `ctoken=${res.data.token}; expires=${new Date(res.data.expired)}; path=/`;
      axios.defaults.headers.common['Authorization'] = res.data.token;
      setIsAuth(true);
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 驗證是否登入
  useEffect(() => {
    (async () => {
      try {
        const ctoken = document.cookie.replace(
          /(?:(?:^|.*;\s*)ctoken\s*\=\s*([^;]*).*$)|^.*$/,
          "$1",
        );
        axios.defaults.headers.common['Authorization'] = ctoken;
        await axios.post(`${VITE_BASE_URL}/api/user/check`);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  // 取得商品列表
  const getProducts = async () => {
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/products`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (!isAuth) return;
    editModal.current = new Modal(editModalRef.current, { backdrop: 'static' });
  }, [isAuth]);

  // 開啟新增/編輯 Modal
  const openEditModal = (prd) => {
    const tempPrd = prd ? {...prd, is_enabled: prd.is_enabled === 1 ? true: false} : init_product;
    setTempProduct(tempPrd);
    editModal.current.show();
  };

  const closeModal = () => {
    editModal.current.hide();
  };

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

  // 新增/編輯商品
  const editProduct = async () => {
    try {
      let api_method = 'post';
      let api_url = `${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/product`;
      if (tempProduct.id) {
        api_method = 'put';
        api_url = `${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/product/${tempProduct.id}`;
      }
      const data = {...tempProduct, origin_price: parseInt(tempProduct.origin_price), price: parseInt(tempProduct.price)};
      const res = await axios[api_method](api_url, { data });
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      closeModal();
      getProducts();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 刪除商品
  const deleteProduct = async (prdId) => {
    try {
      const res = await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/product/${prdId}`);
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      getProducts();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // 登出
  const logout = async () => {
    try {
      const res = await axios.post(`${VITE_BASE_URL}/logout`);
      Swal.fire({
        position: "center",
        icon: "success",
        title: res.data.message,
        showConfirmButton: false,
        timer: 1500
      });
      setIsAuth(false);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      {
        isAuth ? (<>
          <div className="container mt-5">
            <h3 className="h5 mb-2 fw-bold">商品列表</h3>
            <div className="text-end mb-1">
              <button type="button" className="btn btn-primary btn-sm me-1" onClick={() => openEditModal(null)}>新增商品</button>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={logout}>登出</button>
            </div> 
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">商品名稱</th>
                  <th scope="col">商品種類</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">單位</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">操作</th>
                </tr>
              </thead>
              <tbody>
                {
                  products.map((prd) => {
                    return (
                      <tr key={prd.id}>
                        <td>{prd.title}</td>
                        <td>{prd.category}</td>
                        <td>{prd.origin_price}</td>
                        <td>{prd.price}</td>
                        <td>{prd.unit}</td>
                        <td>{ prd.is_enabled ? '啟用' : '停用' }</td>
                        <td>
                          <button type="button" className="btn btn-primary btn-sm me-1" onClick={() => openEditModal(prd)}>編輯</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => deleteProduct(prd.id)}>刪除</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                <li className="page-item"><a className="page-link" href="#">1</a></li>
                <li className="page-item"><a className="page-link" href="#">2</a></li>
                <li className="page-item"><a className="page-link" href="#">3</a></li>
                <li className="page-item"><a className="page-link" href="#">Next</a></li>
              </ul>
            </nav>
          </div>
          
          {/* 新增/編輯 Modal */}
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
                          <div className="row">
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
        </>) : (
          <div className="container mt-5">
            <div className="row justify-content-center">
              <div className="col-8">
                <h2 className="h3 mb-3 text-center fw-bold">請先登入</h2>
                <form onSubmit={login}>
                  <div className="form-floating mb-3">
                    <input type="email" className="form-control" name="username" value={account.username} id="username" placeholder="請輸入 Email" onChange={handleAccount} />
                    <label htmlFor="username">Email</label>
                  </div>
                  <div className="form-floating">
                    <input type="password" className="form-control" name="password" value={account.password} id="password" placeholder="請輸入密碼" onChange={handleAccount} autoComplete="on" />
                    <label htmlFor="password">密碼</label>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary px-4 mt-4">登入</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }
      
    </>
  )
}

export default App
