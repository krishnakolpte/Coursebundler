import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { RiSecurePaymentFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import ImageSrc from '../../assets/images/founder.jpg';
import introVideo from '../../assets/vidios/intro.mp4';
import termsAndCondition from '../../assets/docs/termsAndCondition';

const Founder = () => (
  <Stack direction={['column', 'row']} spacing={['4', '16']} padding={'8'}>
    <VStack>
      <Avatar src={ImageSrc} boxSize={['40', '48']} />
      <Text children="Co-Founder" opacity={'0.7'} />
    </VStack>
    <VStack justifyContent={'center'} alignItems={['center', 'flex-start']}>
      <Heading children="Krishna Kolapte" size={['md', 'xl']} />
      <Text
        textAlign={['center', 'left']}
        children={`Hi, I Am A Full Stack Web Devoloper.
        Our Mission Is To Provide Quality Conttent At Reasonable Price.`}
      />
    </VStack>
  </Stack>
);

const VideoPlayer = () => (
  <Box>
    <video
      autoPlay
      muted
      controls
      controlsList="nodownload nofullscreen noremoteplayback"
      src={introVideo}
      disablePictureInPicture
      disableRemotePlayback
    ></video>
  </Box>
);

const TermC = ({ termsAndCondition }) => (
  <Box>
    <Heading
      size={'md'}
      children="Terms & Conditions"
      my={'4'}
      textAlign={['center', 'left']}
    />
    <Box h={'sm'} p="4" overflowY={'scroll'}>
      <Text
        textAlign={['center', 'left']}
        children={termsAndCondition}
        letterSpacing="widest"
        fontFamily={'heading'}
      />
    </Box>
    <Heading
      my={'4'}
      size="xs"
      children="Refond only applicable for cancellation within 7 days"
    />
  </Box>
);

function About() {
  return (
    <Container maxW={'container.lg'} padding="16" boxShadow={'lg'}>
      <Heading children="About Us" textAlign={['center', 'left']} />
      <Founder />
      <Stack m={'8'} direction={['column', 'row']} alignItems="center">
        <Text
          fontFamily={'cursive'}
          textAlign={['center', 'left']}
          children="We are a video streaming platform with some premium courses avalable only for premium user."
        />
        <Link to={'/subscribe'}>
          <Button variant={'ghost'} colorScheme="yellow">
            ChekOut Our Plans
          </Button>
        </Link>
      </Stack>
      <VideoPlayer />
      <TermC termsAndCondition={termsAndCondition} />
      <HStack m={'4'} p="4">
        <RiSecurePaymentFill color="green" fontSize={'50'} />
        <Heading
          size={'sm'}
          fontFamily="sans-serif"
          textTransform={'uppercase'}
          children="Payment Is Secured By RazerPay"
        />
      </HStack>
    </Container>
  );
}

export default About;
