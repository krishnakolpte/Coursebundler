import {
  Box,
  Button,
  Container,
  FormLabel,
  Heading,
  Input,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/Actions/user';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Container h={'90vh'}>
      <VStack h={'full'} justifyContent="center" spacing={'16'}>
        <Heading children="Wel Come To CourseBundler" />
        <form onSubmit={submitHandler} style={{ width: '100%' }}>
          <Box my={'4'}>
            <FormLabel htmlFor="email" children="Email Address" />
            <Input
              required
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              type={'email'}
              focusBorderColor="yellow.500"
            />
          </Box>
          <Box my={'4'}>
            <FormLabel htmlFor="password" children="Password" />
            <Input
              required
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Your Password"
              type={'password'}
              focusBorderColor="yellow.500"
            />
          </Box>
          <Box>
            <Link to={'/forgetpassword'}>
              <Button fontSize={'sm'} variant="link">
                Forget Password?
              </Button>
            </Link>
          </Box>

          <Button my={'4'} colorScheme="yellow" type="submit">
            Login
          </Button>
          <Box>
            New User?{' '}
            <Link to={'/register'}>
              <Button colorScheme={'yellow'} variant="link">
                Sign Up
              </Button>{' '}
              Here
            </Link>
          </Box>
        </form>
      </VStack>
    </Container>
  );
}

export default Login;
