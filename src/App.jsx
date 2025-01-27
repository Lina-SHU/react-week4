import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRef } from "react";
import { Modal } from "bootstrap";

function App() {
  const {VITE_BASE_URL, VITE_API_PATH} = import.meta.env;
  const [account, setAccount] = useState({ username: '', password: '' });
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [tempProduct, setTempProduct] = useState({});

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
    setTempProduct(prd);
    editModal.current.show();
  };

  const closeModal = () => {
    editModal.current.hide();
  };

  // 刪除商品
  const deleteProduct = async (prdId) => {
    try {
      const res = await axios.delete(`${VITE_BASE_URL}/api/${VITE_API_PATH}/admin/product/${prdId}`);
      alert(res.data.message);
      getProducts();
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
              <button type="button" className="btn btn-primary btn-sm me-1">新增商品</button>
              <button type="button" className="btn btn-outline-primary btn-sm">登出</button>
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
                          <button type="button" className="btn btn-primary btn-sm me-1" onClick={(prd) => openEditModal(prd)}>編輯</button>
                          <button type="button" className="btn btn-outline-danger btn-sm" onClick={(prd) => deleteProduct(prd.id)}>刪除</button>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
          
          {/* 新增/編輯 Modal */}
          <div className="modal fade" ref={editModalRef} id="editModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">商品</h1>
                    <button type="button" className="btn-close"onClick={closeModal}></button>
                  </div>
                  <div className="modal-body">
                    ...
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary btn-sm me-1" onClick={closeModal}>取消</button>
                    <button type="button" className="btn btn-primary btn-sm">儲存</button>
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
