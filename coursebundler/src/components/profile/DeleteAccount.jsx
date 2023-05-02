import {
  Button,
  Container,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../../redux/Actions/profile';
import { loadUser } from '../../redux/Actions/user';

function DeleteAccount({ user }) {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { loading, error, message } = useSelector(state => state.profile);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearError' });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: 'clearMessage' });
    }
  }, [dispatch, error, message, onOpen]);

  const submitHandler = async e => {
    e.preventDefault();
    await dispatch(deleteAccount());
    dispatch(loadUser());
    navigate('/login');
  };
  return (
    <VStack h={'90vh'} justifyContent="center">
      <Heading>Delete your account</Heading>
      <Button mt={'8'} onClick={onOpen}>
        Conferm
      </Button>
      <DeleteAccountBox
        user={user?.name}
        submitHandler={submitHandler}
        isOpen={isOpen}
        onClose={onClose}
        loading={loading}
      />
    </VStack>
  );
}

export default DeleteAccount;

function DeleteAccountBox({ user, submitHandler, isOpen, onClose, loading }) {
  const CloseHandler = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={CloseHandler}>
      <ModalOverlay backdropFilter={'blur'} />
      <ModalContent>
        <ModalHeader>{user}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Container>
            <form onSubmit={submitHandler}>
              <VStack spacing={'8'}>
                <Button
                  isLoading={loading}
                  w="full"
                  colorScheme={'red'}
                  type="submit"
                >
                  Delete
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
