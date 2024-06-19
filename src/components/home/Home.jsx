import { useCallback, useEffect, useState } from 'react';
import { delete_login, get_login } from '../../common/fetch';
import { useLocation, useNavigate } from 'react-router-dom';
import { error_toast, success_toast, confirm_toast } from '../../common/services';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import './home.css';
import { MenuItem, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products1, setProducts1] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['ALL']);
  const [alignment, setAlignment] = useState('ALL');

  const logData = useCallback(() => localStorage.getItem('token'), []);

  const handleChange = (event, newAlignment) => {
    if (newAlignment === 'ALL') {
      getProducts();
    } else {
      let a = [...products1];
      a = a.filter((e) => e.category === newAlignment);
      setProducts(a);
    }
    setAlignment(newAlignment);
  };

  const getProducts = useCallback(async () => {
    try {
      const res = await get_login('/products');
      setProducts1(res.data);
      setProducts(res.data);
    } catch (e) {
      error_toast(e.response.data.message);
    }
  }, []);

  const handleSort = (e) => {
    let a = [...products];
    if (e.target.value === 'asc') {
      a.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (e.target.value === 'desc') {
      a.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (e.target.value === 'new') {
      a.reverse();
    }
    setProducts(a);
  };

  const getCategories = useCallback(async () => {
    try {
      const res = await get_login('/products/categories');
      let a = categories.concat(res.data);
      setCategories(a);
    } catch (e) {
      error_toast(e.response.data.message);
    }
  }, [categories]);

  const deleteSwal = (id) => {
    confirm_toast(async (result) => {
      if (result.isConfirmed) {
        await deleteProduct(id);
      }
    });
  };

  const deleteProduct = async (id) => {
    try {
      await delete_login('/products/' + id);
      getProducts();
      success_toast('Product deleted Successfully');
    } catch (e) {
      error_toast('Something went wrong');
    }
  };

  useEffect(() => {
    if (!logData()) {
      navigate('/login');
    } else {
      getProducts();
      getCategories();
    }
  }, [logData, navigate, getCategories, getProducts]);

  useEffect(() => {
    let a = [...products];
    if (location.pathname.split('/').length > 2) {
      a = a.filter((e) => e.name.toLowerCase().includes(location.pathname.split('/')[2].toLowerCase()));
    } else {
      getProducts();
    }
    setProducts(a);
  }, [location, getProducts, products]);

  return (
    <div>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        style={{ marginTop: '30px', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {categories.map((e, i) =>
          <ToggleButton key={i} value={e}>{e}</ToggleButton>
        )}
      </ToggleButtonGroup>
      <div style={{ marginLeft: '50px' }}>
        <p style={{ marginBottom: '20px' }}>Sort by:</p>
        <TextField
          id="outlined-select-currency"
          select
          label="Select"
          defaultValue="def"
          onChange={handleSort}
          style={{ width: '200px', textAlign: 'start' }}
        >
          <MenuItem value="def">Default</MenuItem>
          <MenuItem value="asc">Price: Low to High</MenuItem>
          <MenuItem value="desc">Price: High to Low</MenuItem>
          <MenuItem value="new">Newest</MenuItem>
        </TextField>
      </div>
      <div className='card-parent'>
        {products.map((item) =>
          <Card key={item.id} sx={{ maxWidth: 345, padding: '10px' }}>
            <CardMedia
              component="img"
              alt={item.name}
              height="250"
              image={item.imageUrl}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.name}</span>
                <span>₹ {item.price}</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description.length > 100 ? item.description.slice(1, 100) + '...' : item.description}
              </Typography>
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button style={{ backgroundColor: "#3f51b5" }} size="small" variant='contained' onClick={() => { navigate('/product/' + item.id); }}>Buy</Button>
              {logData()?.role === 'ADMIN' && <div>
                <Button style={{ backgroundColor: "#3f51b5" }} size="small" onClick={() => { navigate('/editproduct/' + item.id); }}><EditIcon /></Button>
                <Button style={{ backgroundColor: "#3f51b5" }} size="small" onClick={() => { deleteSwal(item.id); }}><DeleteIcon /></Button>
              </div>}
            </CardActions>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Home;
