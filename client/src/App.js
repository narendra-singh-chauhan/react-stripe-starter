import { useState } from "react";
import axios from "axios";

const buttonStyles = {
  padding: "10px 30px",
  background: "red",
  color: "white",
  outline: "none",
  border: "1px solid red",
  margin: "20px",
  borderRadius: "4px",
  cursor: "pointer",
};

const appStyles = {
  width: "100%",
  height: "500px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const App = () => {
  const [products, setProducts] = useState([
    {
      id: 4,
      name: "T-shirt",
      desc: "RodZen Men's Cotton Half Sleeve Regular Fit Striped T-Shirt",
      price: 5,
      image: "https://m.media-amazon.com/images/I/61gqx7hslmL._UX679_.jpg",
      quantity: 1,
    },
    {
      id: 5,
      name: "iPhone 13",
      desc: "Apple iPhone 13 (128GB) - Starlight",
      price: 200,
      image: "https://m.media-amazon.com/images/I/71GLMJ7TQiL._SL1500_.jpg",
      quantity: 3,
    },
    {
      id: 6,
      name: "Bullet",
      desc: "CENTY Plastic Royal Bullet Bike With Side Stand, Pack Of 1, Brown",
      price: 4000,
      image: "https://m.media-amazon.com/images/I/61Kmb8NL2NS._SL1096_.jpg",
      quantity: 1,
    },
  ]);

  const handleCheckout = async () => {
    try {
      const response = await axios.post("http://localhost:5000/checkout", { products });

      if (response?.data?.url) {
        window.location.assign(response?.data?.url);
      }
    } catch (error) {
      console.log('Error while processing payment: ',error);
    }
  }

  return (
    <div className='app' style={appStyles}>
      <button style={buttonStyles} onClick = {handleCheckout}>Buy Now</button>
    </div>
  );
};

export default App;

