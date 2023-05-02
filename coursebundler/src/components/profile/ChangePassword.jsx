import { Button, Container, Heading, Input, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useDispatch, useSelector } from 'react-redux';
import { changePassword } from '../../redux/Actions/profile';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { loading, error, message } = useSelector(state => state.profile);
  const dispatch = useDispatch();

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

  const submitHandler = async e => {
    e.preventDefault();

    await dispatch(changePassword(oldPassword, newPassword));
  };
  return (
    <Container py={'16'} minH="90vh">
      <form onSubmit={submitHandler}>
        <Heading
          children="Change Password"
          my={'16'}
          textAlign={['center', 'left']}
          textTransform="uppercase"
        />
        <VStack spacing={'8'}>
          <Input
            required
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder="Old Password"
            type={'password'}
            focusBorderColor="yellow.500"
          />

          <Input
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New Password"
            type={'password'}
            focusBorderColor="yellow.500"
          />
          <Button
            isLoading={loading}
            w="full"
            colorScheme={'yellow'}
            type="submit"
          >
            Change
          </Button>
        </VStack>
      </form>
    </Container>
  );
}

export default ChangePassword;
