import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { buySubscription } from '../../redux/Actions/user';
import { server } from '../../redux/Store';
// import logo from '../../assets/images/logo.png';

function Subscibe({ user }) {
  const dispatch = useDispatch();
  const [key, setKey] = useState();

  const { loading, error, subscriptionId } = useSelector(
    state => state.subscription
  );
  const { error: courseError } = useSelector(state => state.course);

  const subscribeHandler = async () => {
    const {
      data: { key },
    } = await axios.get(`${server}/razorpaykey`);
    setKey(key);
    dispatch(buySubscription());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (courseError) {
      toast.error(courseError);
      dispatch({ type: 'clearError' });
    }
    if (subscriptionId) {
      const openPopUp = () => {
        const options = {
          key,
          name: 'Course Bundler',
          description: 'Get access to all Premium content',
          image:
            'https://res.cloudinary.com/do3egmobd/image/upload/v1682762237/c2ol9ewpkwrklu8me2gt.png',
          subscription_id: subscriptionId,
          callback_url: `${server}/paymentverification`,
          prefill: {
            name: user.name,
            email: user.email,
            contact: '',
          },
          notes: {
            address: '6 pack programmer',
          },
          theme: {
            color: '#FFC80',
          },
        };
        const razor = new window.Razorpay(options);
        razor.open();
      };
      openPopUp();
    }
  }, [
    dispatch,
    error,
    user.name,
    user.email,
    key,
    subscriptionId,
    courseError,
  ]);

  return (
    <Container h={'90vh'} p="16">
      <Heading children="Welcome" my={'8'} textAlign="center" />
      <VStack
        boxShadow={'lg'}
        spacing="0"
        alignItems="stretch"
        borderRadius={'lg'}
      >
        <Box bg={'yellow.400'} p="4" css={{ borderRadius: '8px 8px 0 0' }}>
          <Text color={'black'} children={`Pro Pack - ₹299.00`} />
        </Box>
        <Box p={'4'}>
          <VStack textAlign={'center'} px="8" mt={'4'} spacing={'8'}>
            <Text
              //   color={'black'}
              children={`Joine Pro Pack And  Get Access To All Content`}
            />
            <Heading size={'m'} children="₹299 Only" />
          </VStack>
          <Button
            isLoading={loading}
            my={'8'}
            colorScheme="green"
            w={'full'}
            onClick={subscribeHandler}
          >
            <RiSecurePaymentFill fontSize={'30'} /> Buy Now
          </Button>
        </Box>
        <Box bg={'blackAlpha.600'} p="4" css={{ borderRadius: '0 0 8px 8px' }}>
          <Heading
            color={'white'}
            textTransform="uppercase"
            size={'sm'}
            children={`100% Refund At Cancellation`}
          />
          <Text
            color={'white'}
            size={'xs'}
            children={`Terms And Condition Applay`}
          />
        </Box>
      </VStack>
    </Container>
  );
}

export default Subscibe;
