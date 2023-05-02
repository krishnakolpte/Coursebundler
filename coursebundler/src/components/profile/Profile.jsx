import {
  Avatar,
  Button,
  Container,
  Heading,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { RiDeleteBinFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  removefromplaylist,
  updateProfilePicture,
} from '../../redux/Actions/profile';
import { cancelSubscription, loadUser } from '../../redux/Actions/user';
import { fileUploadCss } from '../auth/Register';

function Profile({ user }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { loading, message, error } = useSelector(state => state.profile);
  const {
    loading: subsLoading,
    message: subsMessage,
    error: subsError,
  } = useSelector(state => state.subscription);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (subsError) {
      toast.error(subsError);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
    if (subsMessage) {
      toast.success(subsMessage);
      dispatch({ type: 'clearMessage' });
      dispatch(loadUser());
    }
  }, [dispatch, error, message, subsError, subsMessage]);

  const CourseRemoveHandler = async id => {
    await dispatch(removefromplaylist(id));
    dispatch(loadUser());
  };

  const changeImageSubmitHandler = async (e, image) => {
    e.preventDefault();
    const myform = new FormData();

    myform.append('file', image);

    await dispatch(updateProfilePicture(myform));
    dispatch(loadUser());
  };

  const cancelSubscriptionHandler = () => {
    dispatch(cancelSubscription());
  };

  return (
    <Container minH={'95vh'} maxW={'container.lg'} py="8">
      <Heading m="8" children="Profile" textTransform={'uppercase'} />
      <Stack
        justifyContent={'flex-start'}
        direction={['column', 'row']}
        alignItems="center"
        spacing={['8', '16']}
        p="8"
      >
        <VStack>
          <Avatar boxSize={'48'} src={user.avatar.url} />
          <Button onClick={onOpen} colorScheme={'yellow'} variant="ghost">
            Change Photo
          </Button>
        </VStack>
        <VStack spacing={'4'} alignItems={['center', 'flex-start']}>
          <HStack>
            <Text children={'Name'} fontWeight={'bold'} />
            <Text children={user.name} />
          </HStack>
          <HStack>
            <Text children={'Email'} fontWeight={'bold'} />
            <Text children={user.email} />
          </HStack>
          <HStack>
            <Text children={'Created At'} fontWeight={'bold'} />
            <Text children={user.createdAt.split('T')[0]} />
          </HStack>
          {user.role !== 'admin' && (
            <HStack>
              <Text children={'Subscription'} fontWeight={'bold'} />
              {user.subscription && user.subscription.status === 'active' ? (
                <Button
                  isLoading={subsLoading}
                  onClick={cancelSubscriptionHandler}
                  colorScheme={'red'}
                  variant="ghost"
                >
                  Cancel Subscription
                </Button>
              ) : (
                <Link to={'/subscribe'}>
                  <Button colorScheme={'yellow'}>Subscribe</Button>
                </Link>
              )}
            </HStack>
          )}

          <Stack direction={['column', 'row']} alignItems={'center'}>
            <Link to="/updateprofile">
              <Button>Update Profile</Button>
            </Link>

            <Link to="/changepassword">
              <Button>Change Password</Button>
            </Link>
            <Link to="/deleteaccount">
              <Button colorScheme={'red'}>Delete Account</Button>
            </Link>
          </Stack>
        </VStack>
      </Stack>
      <Heading children="Playlist" size={'md'} my={'8'} />
      {user.playlist.length > 0 && (
        <Stack
          direction={['column', 'row']}
          alignItems="center"
          flexWrap={'wrap'}
          p="4"
        >
          {user.playlist.map(item => (
            <VStack w={'48'} m="2" key={item.course}>
              <Image boxSize={'full'} objectFit="contain" src={item.poster} />
              <HStack>
                <Link to={`/course/${item.course}`}>
                  <Button colorScheme={'yellow'} variant={'ghost'}>
                    Wathch Now
                  </Button>
                </Link>
                <Button
                  isLoading={loading}
                  onClick={() => CourseRemoveHandler(item.course)}
                >
                  <RiDeleteBinFill />
                </Button>
              </HStack>
            </VStack>
          ))}
        </Stack>
      )}
      <ChangePhotoBox
        changeImageSubmitHandler={changeImageSubmitHandler}
        isOpen={isOpen}
        onClose={onClose}
        loading={loading}
      />
    </Container>
  );
}

export default Profile;

function ChangePhotoBox({
  isOpen,
  onClose,
  changeImageSubmitHandler,
  loading,
}) {
  const [image, setImage] = useState('');
  const [imagePrev, setImagePrev] = useState('');
  const changeImageHandler = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const CloseHandler = () => {
    onClose();
    setImagePrev('');
    setImage('');
  };

  return (
    <Modal isOpen={isOpen} onClose={CloseHandler}>
      <ModalOverlay backdropFilter={'blur'} />
      <ModalContent>
        <ModalHeader>Change Photo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container>
            <form onSubmit={e => changeImageSubmitHandler(e, image)}>
              <VStack spacing={'8'}>
                {imagePrev && <Avatar src={imagePrev} boxSize={'48'} />}
                <Input
                  type={'file'}
                  css={{ '&::file-selector-button': fileUploadCss }}
                  onChange={changeImageHandler}
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
        </ModalBody>
        <ModalFooter>
          <Button mr={'3'} onClick={CloseHandler}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
