import React from 'react';
import './Home.css';
import {
  Heading,
  Stack,
  VStack,
  Text,
  Button,
  Image,
  Box,
  HStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/bg.png';
import { SiMongodb } from 'react-icons/si';
import { FaNodeJs, FaReact, FaCss3Alt } from 'react-icons/fa';
import introVideo from '../../assets/vidios/intro.mp4';

const Home = () => {
  return (
    <section className="Home">
      <div className="container">
        <Stack
          direction={['column', 'row']}
          height="100%"
          justifyContent={['center', 'space-between']}
          alignItems="center"
          spacing={['16', '56']}
        >
          <VStack
            width={'full'}
            alignItems={['center', 'flex-end']}
            spacing="8"
          >
            <Heading children="LEARN FROM THE EXPERTS" size={'2xl'} />
            <Text
              textAlign={['center', 'left']}
              children="Experience exponential growth with our comprehensive learning platform."
              fontSize={'2xl'}
              fontFamily="cursive"
            />
            <Link to="/courses">
              <Button children="Explore Now" size={'lg'} colorScheme="yellow" />
            </Link>
          </VStack>

          <Image
            className="vector-grafics"
            boxSize={'md'}
            src={logo}
            objectFit="contain"
          />
        </Stack>
      </div>
      <Box padding={'8'} bg="blackAlpha.800">
        <Heading
          children="OUR BRANDS"
          textAlign={'center'}
          fontFamily={'body'}
          color={'yellow.400'}
        />
        <HStack
          className="brandsIcons"
          justifyContent={'space-evenly'}
          marginTop="4"
        >
          <SiMongodb />
          <FaCss3Alt />
          <FaReact />
          <FaNodeJs />
        </HStack>
      </Box>
      <div className="container2">
        <video
          autoPlay
          controls
          controlsList="nodownload nofullscreen noremoteplayback"
          src={introVideo}
          disablePictureInPicture
          disableRemotePlayback
        ></video>
      </div>
    </section>
  );
};

export default Home;
