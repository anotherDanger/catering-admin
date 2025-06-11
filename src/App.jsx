import { Routes, Route } from "react-router-dom";
import Layout from "./components/home/Layout";
import Dashboard from "./components/home/Dashboard";
import Orders from "./components/home/Orders";
import Products from "./components/home/Products";

function App(){
  return(
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path="orders" element={<Orders />}/>
          <Route path="products" element={<Products />}/>
        </Route>
      </Routes>
  )
}

export default App;