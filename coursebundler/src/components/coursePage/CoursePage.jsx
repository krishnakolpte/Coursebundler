import { Box, Grid, Heading, Text, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { getCourseLectures } from '../../redux/Actions/course';
import Loader from '../layout/Loader';

function CoursePage({ user }) {
  const [lectureNumber, setLectureNumber] = useState(0);

  const { lectures, loading } = useSelector(state => state.course);

  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getCourseLectures(params.id));
  }, [dispatch, params.id]);

  if (
    user.role !== 'admin' &&
    (user.subscription === undefined || user.subscription.status !== 'active')
  ) {
    return <Navigate to={'/subscribe'} />;
  }

  return loading ? (
    <Loader />
  ) : (
    <Grid p={'4'} minH={'90vh'} templateColumns={['1fr', '3fr 1fr']}>
      {lectures && lectures.length > 0 ? (
        <>
          <Box>
            <video
              style={{ border: '1px solid black' }}
              width={'100%'}
              autoPlay
              controls
              controlsList="nodownload  noremoteplayback"
              src={lectures[lectureNumber].video.url}
              disablePictureInPicture
              disableRemotePlayback
            ></video>

            <Heading m={'4'}>{`#${lectureNumber + 1} ${
              lectures[lectureNumber].title
            }`}</Heading>

            <Text
              m={'4'}
              children={`${lectures[lectureNumber]?.description}`}
            />
          </Box>

          <VStack pl={'2'} alignItems={'start'}>
            <Heading children="Playlist#" />
            <div
              style={{
                width: '100%',
                overflowY: 'auto',
                display: 'block',
              }}
            >
              {lectures.map((item, index) => (
                <button
                  className="lecture-btn"
                  onClick={() => setLectureNumber(index)}
                  style={{
                    zIndex: '10',
                    width: '100%',
                    padding: '1rem',
                    margin: '0',
                    textAlign: 'left',
                    borderBottom: '1px solid rgba(0,0,0,0.3)',
                  }}
                  key={item._id}
                >
                  <Text
                    className="lecture-text"
                    noOfLines={'1'}
                    children={`#${index + 1} ${item.title} `}
                  />
                </button>
              ))}
            </div>
          </VStack>
        </>
      ) : (
        <Heading mt={'20'} textAlign={'center'} children="No lectures" />
      )}
    </Grid>
  );
}

export default CoursePage;
