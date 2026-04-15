import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://zerodha-backend-mhhn.onrender.com/allOrders");
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="orders">
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Stock</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.name}</td>
                <td
                  style={{
                    color: order.mode === "BUY" ? "green" : "red",
                  }}
                >
                  {order.mode}
                </td>
                <td>{order.qty}</td>
                <td>{order.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
