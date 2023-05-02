import { Box, Heading, HStack, Stack, VStack } from '@chakra-ui/react';
import React from 'react';
import { AiFillGithub, AiOutlineInstagram } from 'react-icons/ai';

function Footer() {
  return (
    <Box padding={'4'} bg="blackAlpha.900" minH={'10vh'}>
      <Stack direction={['column', 'row']}>
        <VStack alignItems={['center', 'flex-start']} width="full">
          <Heading children="All Right Reserved" color={'white'} />
          <Heading
            children="@krishna kolapte"
            color={'yellow.400'}
            fontFamily="body"
            size={'sm'}
          />
        </VStack>
        <HStack
          spacing={['2', '10']}
          justifyContent="center"
          color={'white'}
          fontSize="40"
        >
          <a href="https://www.instagram.com/its_krishnavk" target={'blank'}>
            <AiOutlineInstagram />
          </a>
          <a href="https://github.com/krishnakolpte" target={'blank'}>
            <AiFillGithub />
          </a>
        </HStack>
      </Stack>
    </Box>
  );
}

export default Footer;
