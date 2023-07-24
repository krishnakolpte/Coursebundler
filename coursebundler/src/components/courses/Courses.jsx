import {
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../../redux/Actions/course';
import { addToPlaylist } from '../../redux/Actions/course';
// import { loadUser } from '../../redux/Actions/user';

const Course = ({
  loading,
  views,
  title,
  imageSrc,
  id,
  addToPlaylistHandler,
  creator,
  discription,
  lectureCount,
}) => {
  return (
    <VStack className="course" alignItems={['center', 'flex-start']}>
      <Image src={imageSrc} boxSize="60" objectFit={'contain'} />
      <Heading
        textAlign={['center', 'left']}
        size="sm"
        maxW="200px"
        fontFamily={'sans-serif'}
        noOfLines={3}
        children={title}
      />
      <Text noOfLines={3} children={discription} />
      <HStack>
        <Text
          fontWeight={'bold'}
          textTransform="uppercase"
          children={'creator'}
        />
        <Text
          fontFamily={'body'}
          textTransform="uppercase"
          children={creator}
        />
      </HStack>
      <Heading
        textAlign={'center'}
        size="xs"
        children={`Lectures - ${lectureCount}`}
        textTransform="uppercase"
      />
      <Heading
        textAlign={'center'}
        size="xs"
        children={`Views - ${views}`}
        textTransform="uppercase"
      />
      <Stack direction={['column', 'row']} alignItems="center">
        <Link to={`/course/${id}`}>
          <Button colorScheme={'yellow'}>Watch Now</Button>
        </Link>
        <Button
          isLoading={loading}
          colorScheme={'yellow'}
          variant="ghost"
          onClick={() => addToPlaylistHandler(id)}
        >
          Add To Playlist
        </Button>
      </Stack>
    </VStack>
  );
};

const Courses = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const categores = [
    'web devolopment',
    'Artificial Inteligence',
    'Androide Devolopment',
  ];

  const dispatch = useDispatch();
  const { loading, courses, error, message } = useSelector(
    state => state.course
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
    dispatch(getAllCourses(category, keyword));
  }, [dispatch, category, keyword, error, message]);

  const addToPlaylistHandler = async id => {
    await dispatch(addToPlaylist(id));
    // dispatch(loadUser());
  };

  return (
    <Container minHeight={'95vh'} maxWidth="container.lg" paddingY={'8'}>
      <Heading children="All Courses" margin={'8'} />
      <Input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="Search A Course..."
        type={'text'}
        focusBorderColor="yellow.500"
      />
      <HStack
        overflow={'auto'}
        paddingY="8"
        css={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {categores.map((item, index) => (
          <Button key={index} onClick={() => setCategory(item)} minWidth={'60'}>
            <Text children={item} />
          </Button>
        ))}
      </HStack>
      <Stack
        direction={['column', 'row']}
        flexWrap="wrap"
        justifyContent={['flex-start', 'space-evenly']}
        alignItems={['center', 'flex-start']}
      >
        {courses?.length > 0 ? (
          courses.map(item => (
            <Course
              loading={loading}
              key={item._id}
              title={item.title}
              discription={item.description}
              views={item.views}
              imageSrc={item.poster.url}
              id={item._id}
              creator={item.createdBy}
              lectureCount={item.numOfVideos}
              addToPlaylistHandler={addToPlaylistHandler}
            />
          ))
        ) : (
          <Heading mt={'16'} children="Courses not found!" />
        )}
      </Stack>
    </Container>
  );
};

export default Courses;
