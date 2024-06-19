import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { error_toast, success_toast } from '../../common/services';
import { get_login, post_login } from '../../common/fetch';
import { Button, MenuItem, TextField } from '@mui/material';
import {jwtDecode } from 'jwt-decode';
import './addaddress.css';

const steps = [
    'Item',
    'Select address',
    'Confirm order',
];

const AddAddress = () => {
    const { id, qty } = useParams();
    const navigate = useNavigate();
    const [addressList, setAddressList] = useState([]);
    const [activeKey, setActiveKey] = useState(1);
    const [address, setAddress] = useState('');
    const [finalstep, setFinalStep] = useState(false);
    const [data, setData] = useState({
        name: "",
        contactNumber: "",
        street: "",
        city: "",
        state: "",
        landmark: "",
        zipcode: ""
    });

    const addAddress = async () => {
        if (Object.values(data).some(value => value.trim() === '')) {
            error_toast('Fill all the details');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token found');
            const decoded = jwtDecode(token);
            await post_login('/addresses', { ...data, user: decoded.sub });
            success_toast('Address added successfully');
            setData({
                name: '',
                contactNumber: '',
                city: '',
                state: '',
                street: '',
                landmark: '',
                zipcode: ''
            });
            await getAddresList();
        } catch (e) {
            error_toast('Something went wrong');
        }
    };

    const placeOrder = async () => {
        if (!address.id) {
            error_toast('Please select an address');
            return;
        }

        try {
            await post_login('/orders', {
                quantity: Number(qty),
                user: address.user,
                product: id,
                address: address.id
            });
            success_toast('Your order is confirmed.');
            navigate('/products');
        } catch (e) {
            error_toast('Something went wrong');
        }
    };

 const getAddresList = useCallback(async () => {
        try {
            const res = await get_login('/addresses');
            setAddressList(res.data.map(e => ({
                ...e,
                id: e.id,
                user: e.user
            })));
        } catch (e) {
            error_toast('Something went wrong');
        }
    }, []); // Empty dependency array if no dependencies needed


    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const nextstep = () => {
        if (!address) {
            error_toast('Please select an address');
            return;
        }
        setActiveKey(2);
        setFinalStep(true);
    };

    const goToOrder = () => {
        navigate('/product/' + id);
    };

    const midStep = () => {
        navigate('/addaddress/' + id + '/2');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            getAddresList();
        }
    }, [navigate, getAddresList]);

    const [details, setDetails] = useState(null);

    const getProductDetails = useCallback(async () => {
        try {
            const res = await get_login(`/products/${id}`);
            setDetails(res.data);
        } catch (e) {
            error_toast('Something went wrong');
        }
    }, [id]);

   useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getAddresList();
            getProductDetails();
        } else {
            navigate('/login');
        }
    }, [navigate, getAddresList, getProductDetails]);

    return (
        <div>
            <Box sx={{ width: '80%', margin: 'auto', marginY: '20px' }}>
                <Stepper activeStep={activeKey} alternativeLabel>
                    {steps.map(label => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            {!finalstep ? (
                <>
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: '20px' }}>Select address:</p>
                        <TextField
                            name='address'
                            id="outlined-select-currency"
                            select
                            label="Select"
                            defaultValue=""
                            value={address}
                            onChange={(e) => { setAddress(e.target.value) }}
                            style={{ width: '50%', textAlign: 'start' }}
                        >
                            <MenuItem value="">Select</MenuItem>
                            {addressList.map((e, i) => (
                                <MenuItem key={i} value={e}>
                                    {Object.values(e).join(' ')}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <p style={{ textAlign: 'center' }}>OR</p>
                    <form className='registerForm1' style={{ marginTop: '20px' }}>
                        <h3 style={{ marginTop: '5px', textAlign: 'center' }}>Add Address</h3>
                        {['name', 'contactNumber', 'street', 'city', 'state', 'landmark', 'zipcode'].map((field) => (
                            <TextField
                                key={field}
                                name={field}
                                variant='outlined'
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                onChange={handleChange}
                            />
                        ))}
                        <button type='button' onClick={addAddress} className='loginBtn'>Save Address</button>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                style={{ marginTop: '10px', marginRight: '20px', backgroundColor: "#3f51b5" }}
                                size="medium"
                                variant='contained'
                                onClick={goToOrder}
                            >
                                BACK
                            </Button>
                            <Button
                                style={{ marginTop: '10px', backgroundColor: "#3f51b5" }}
                                size="medium"
                                variant='contained'
                                color="primary"
                                onClick={nextstep}
                            >
                                NEXT
                            </Button>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <div className='finalStep'>
                        {details && (
                            <div style={{ width: '60%' }}>
                                <h2>{details.name}</h2>
                                <p>Quantity: {qty}</p>
                                <p>Category: {details.category.toUpperCase()}</p>
                                <p><em>{details.description}</em></p>
                                <h2 style={{ color: 'red' }}>Total Price: {details.price * qty}</h2>
                            </div>
                        )}
                        <div style={{ width: '40%', borderLeft: '2px solid #80808045' }}>
                            <h2>Address Details</h2>
                            <p>{address.street}</p>
                            <p>Contact Number: {address.contactNumber}</p>
                            <p>{address.landmark}</p>
                            <p>{address.state}</p>
                            <p>{address.zipcode}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            style={{ marginTop: '10px', marginRight: '20px', backgroundColor: "#3f51b5" }}
                            size="medium"
                            variant='contained'
                            onClick={midStep}
                        >
                            BACK
                        </Button>
                        <Button
                            style={{ marginTop: '10px', backgroundColor: "#3f51b5" }}
                            size="medium"
                            variant='contained'
                            onClick={placeOrder}
                        >
                            PLACE ORDER
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AddAddress;

/*AddAddress*/
