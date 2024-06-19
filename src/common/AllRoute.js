import { Route, Routes } from 'react-router-dom'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/Signup'
import Home from '../components/home/Home'
import AddProduct from '../components/addproduct/AddProduct'
import EditProduct from '../components/addproduct/EditProduct'
import ProductDetails from '../components/productdetails/ProductDetails'
import AddAddress from '../components/addAddress/AddAddress'

const AllRoute = () => {
    return (
        <div>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/signup' element={<Signup />} />
                <Route path='/products' element={<Home />} />
                <Route path='/products/:name' element={<Home />} />
                <Route path='/addproduct' element={<AddProduct />} />
                <Route path='/editproduct/:id' element={<EditProduct />} />
                <Route path='/product/:id' element={<ProductDetails />} />
                <Route path='/addaddress/:id/:qty' element={<AddAddress />} />
            </Routes>
        </div>
    )
}

export default AllRoute