import { useEffect, useState } from 'react'
import { error_toast, success_toast } from '../../common/services';
import { logData, post_login } from '../../common/fetch';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    "name": "",
    "category": "",
    "price": 0,
    "description": "",
    "manufacturer": "",
    "availableItems": "",
    "imageUrl": ""
  })

  const addProduct = async () => {
    if(data.name.trim().length===0 || data.category.trim().length===0 || 
    Number(data.price)===0 || data.description.trim().length===0 || 
    data.manufacturer.trim().length===0 || 
    data.availableItems.trim().length===0 ||
    data.imageUrl.trim().length===0
    ){
      error_toast('Fill all the details');
      return;
    }
    await post_login('/products',data)
    .then((res)=>{
        success_toast('Product added successfully')
        navigate('/products')
    }).catch((e)=>{
      error_toast('something went wrong')
    })

  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value })
  }
  useEffect(()=>{
    if (!logData()) {
      navigate('/login')
    } else {}
  })
  return (
    <div>
      <form className='registerForm'>
        <h3 style={{ marginTop: '5px' }}>Add Product</h3>
        <TextField  name='name' label="Name" variant="outlined" onChange={(e) => { handleChange(e) }} />
        <TextField  name='category' variant='outlined' label='Category' onChange={(e) => { handleChange(e) }} />
        <TextField  name='manufacturer' variant='outlined' label='manufacturer' onChange={(e) => { handleChange(e) }} />
        <TextField  name='price' type='number' variant='outlined' label='Price' onChange={(e) => { handleChange(e) }} />
        <TextField  name='availableItems' variant='outlined' label='availableItems' onChange={(e) => { handleChange(e) }} />
        <TextField  name='imageUrl' variant='outlined' label='Image Url' onChange={(e) => { handleChange(e) }} />
        <TextField  name='description' variant='outlined'  label='description' onChange={(e) => { handleChange(e) }} />
        <button type='button' onClick={addProduct} className='loginBtn'>Save Product</button>
      </form>
    </div>
  )
}

export default AddProduct