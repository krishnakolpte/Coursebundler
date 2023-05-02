import { Button, Container, Heading, Input, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { resetPassword } from '../../redux/Actions/profile';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const { loading, message, error } = useSelector(state => state.profile);
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const submitHandler = async e => {
    e.preventDefault();
    await dispatch(resetPassword(params.token, password));
    navigate('/login');
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [dispatch, error, message]);

  return (
    <Container py={'16'} h="90vh">
      <form onSubmit={submitHandler}>
        <Heading
          children="Reset Password"
          my={'16'}
          textTransform="uppercase"
          textAlign={['center', 'left']}
        />
        <VStack spacing={'8'}>
          <Input
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter New Password"
            type={'password'}
            focusBorderColor="yellow.500"
          />
          <Button
            isLoading={loading}
            w={'full'}
            colorScheme="yellow"
            type="submit"
          >
            Reset Password
          </Button>
        </VStack>
      </form>
    </Container>
  );
};

export default ResetPassword;
