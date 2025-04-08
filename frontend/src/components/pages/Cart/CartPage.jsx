import React, { useEffect, useState } from "react";
import axios from 'axios'; 
import './CartPage.css';

const CartPage = () => {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [message, setMessage] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const totalAmount = cartItems
    .filter(item => selectedItems.includes(item._id))
    .reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:5000/api/cart/${userId}`)
      .then(response => {
        console.log("Dữ liệu giỏ hàng nhận được:", response.data);
        if (response.data && response.data.items && Array.isArray(response.data.items)) {
          setCartItems(response.data.items);
          setSelectedItems(response.data.items.map(item => item._id));  
        } else {
          setMessage("Giỏ hàng trống");
        }
      })
      .catch(error => {
        setMessage("❌ Lỗi khi lấy giỏ hàng: " + error.message);
      });
  }, [userId]);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));  
  };

  const handleQuantityChange = (id, delta) => {
    const updated = cartItems.map(item =>
      item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateCart(updated);  
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item._id !== id);
    updateCart(updated);  
    setSelectedItems(prev => prev.filter(i => i !== id)); 
  };

  const handleCheckout = async () => {
    if (!userId) return alert("Bạn cần đăng nhập để thanh toán");
    if (!fullName || !email || !phone || !address) return setMessage("Vui lòng điền đủ thông tin khách hàng");

    const itemsToCheckout = cartItems.filter(i => selectedItems.includes(i._id));

    const orderData = {
      items: itemsToCheckout.map(i => ({
        productId: i.productId._id,  
        quantity: i.quantity,
        price: i.productId.price
      })),
      fullName, email, phone, address, note
    };

    try {
      await axios.post('http://localhost:5000/api/orders/with-details', orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMessage("✅ Đặt hàng thành công!");

      const newCart = cartItems.filter(item => !selectedItems.includes(item._id));
      updateCart(newCart);
      setSelectedItems([]);  
    } catch (e) {
      setMessage("❌ Lỗi khi đặt hàng: " + (e.message || "Không xác định"));
    }
  };

  if (!userId) return <div className="container mt-5 alert alert-warning">⚠ Bạn cần đăng nhập để sử dụng giỏ hàng.</div>;

  return (
    <div className="container cart-container">
      <h2 className="cart-title">🛒 Giỏ hàng</h2>
      {message && <div className="alert alert-info">{message}</div>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">Giỏ hàng trống</div>
      ) : (
        cartItems.map(item => (
          <div className="cart-item" key={item._id}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedItems.includes(item._id)}
              onChange={() =>
                setSelectedItems(prev =>
                  prev.includes(item._id)
                    ? prev.filter(i => i !== item._id)
                    : [...prev, item._id]
                )
              }
            />
            <img
              src={`http://localhost:5000${item.productId.imageUrl[0]}`}
              alt={item.productId.name}
            />
            <div className="cart-item-content">
              <div className="product-info">
                <div className="product-name-price">
                  <p className="product-name">{item.productId.name}</p>
                  <p className="product-price">{item.productId.price.toLocaleString("vi-VN")} VND</p>
                </div>
              </div>
              <div className="cart-item-actions">
                <button className="qty-btn" onClick={() => handleQuantityChange(item._id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button className="qty-btn" onClick={() => handleQuantityChange(item._id, 1)}>+</button>
                <button className="remove-btn" onClick={() => removeItem(item._id)}>🗑 Xóa</button>
              </div>
            </div>
          </div>
        ))
      )}

      {selectedItems.length > 0 && (
        <div className="customer-info">
          <h3>📋 Thông tin khách hàng</h3>
          <input placeholder="Họ tên" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="SĐT" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input placeholder="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} />
          <textarea placeholder="Ghi chú" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
          <p className="order-total">💰 Tổng tiền: {totalAmount.toLocaleString("vi-VN")} VND</p>
    
          <button onClick={handleCheckout}>Thanh toán ({selectedItems.length} sản phẩm)</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
