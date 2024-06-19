import { useEffect, useState, useCallback } from 'react';
import { error_toast, success_toast } from '../../common/services';
import { get_login, logData, put_login } from '../../common/fetch';
import { TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
// Ensure you have appropriate styling

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    "name": "",
    "category": "",
    "price": 0,
    "description": "",
    "manufacturer": "",
    "availableItems": "",
    "imageUrl": ""
  });

  const editProduct = async () => {
    if (data.name.trim().length === 0 || data.category.trim().length === 0 ||
      Number(data.price) === 0 || data.description.trim().length === 0 ||
      data.manufacturer.trim().length === 0 || data.imageUrl.trim().length === 0
    ) {
      error_toast('Fill all the details');
      return;
    }
    try {
      await put_login('/products/' + id, data);
      success_toast('Updated successfully');
      navigate('/products');
    } catch (e) {
      console.log(e);
      error_toast('Something went wrong');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const getProductData = useCallback(async () => {
    try {
      const res = await get_login('/products/' + id);
      const a = res.data;
      setData({
        name: a.name,
        category: a.category,
        price: a.price,
        manufacturer: a.manufacturer,
        description: a.description,
        availableItems: a.availableItems,
        imageUrl: a.imageUrl
      });
    } catch (e) {
      error_toast(e.response.data.message);
    }
  }, [id]);

  useEffect(() => {
    getProductData();
  }, [id, getProductData]);

  useEffect(() => {
    if (!logData()) {
      navigate('/login');
    } else {
      getProductData();
    }
  }, [id, navigate, getProductData]);

  return (
    <div>
      <form className='registerForm'>
        <h3 style={{ marginTop: '5px' }}>Modify Product</h3>
        <TextField
          name='name'
          label="Name"
          variant="outlined"
          value={data.name}
          onChange={handleChange}
        />
        <TextField
          name='category'
          variant='outlined'
          label='Category'
          value={data.category}
          onChange={handleChange}
        />
        <TextField
          name='manufacturer'
          variant='outlined'
          label='Manufacturer'
          value={data.manufacturer}
          onChange={handleChange}
        />
        <TextField
          name='price'
          type='number'
          variant='outlined'
          label='Price'
          value={data.price}
          onChange={handleChange}
        />
        <TextField
          name='availableItems'
          variant='outlined'
          label='Available Items'
          value={data.availableItems}
          onChange={handleChange}
        />
        <TextField
          name='imageUrl'
          variant='outlined'
          label='Image URL'
          value={data.imageUrl}
          onChange={handleChange}
        />
        <TextField
          name='description'
          variant='outlined'
          label='Description'
          value={data.description}
          onChange={handleChange}
        />
        <button type='button' onClick={editProduct} className='loginBtn'>
          Modify Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
