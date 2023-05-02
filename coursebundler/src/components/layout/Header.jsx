import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import { RiDashboardFill, RiLogoutBoxLine, RiMenu5Fill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/Actions/user';

const LinkButton = ({ url = '/', title = 'Home', onClose }) => (
  <Link onClick={onClose} to={url}>
    <Button variant={'ghost'}>{title}</Button>
  </Link>
);

function Header({ isAuthenticated = false, user }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();

  const logoutHndler = () => {
    onClose();
    dispatch(logout());
  };

  return (
    <>
      <ColorModeSwitcher zIndex={'overlay'} />
      <Button
        onClick={onOpen}
        colorScheme={'yellow'}
        width="12"
        height={'12'}
        rounded={'full'}
        position="fixed"
        top={'6'}
        left="6"
        zIndex={'overlay'}
      >
        <RiMenu5Fill />
      </Button>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay backdropFilter={'blur(3px)'} />
        <DrawerContent>
          <DrawerHeader children="COURSE BUNDLER" borderBottomWidth={'1px'} />
          <DrawerBody>
            <VStack spacing={'4'} alignItems="flex-start">
              <LinkButton url="/" title="Home" onClose={onClose} />
              <LinkButton
                url="/courses"
                title="Browse All Courses"
                onClose={onClose}
              />
              <LinkButton
                url="/request"
                title="Request A Course"
                onClose={onClose}
              />
              <LinkButton url="/contact" title="Contact Us" onClose={onClose} />
              <LinkButton url="/about" title="About Us" onClose={onClose} />
              <HStack
                justifyContent={'space-evenly'}
                position="absolute"
                bottom={'2rem'}
                width="80%"
              >
                {isAuthenticated ? (
                  <>
                    <VStack>
                      <HStack>
                        <Link onClick={onClose} to="/profile">
                          <Button onClick={onClose} variant={'ghost'}>
                            Profile
                          </Button>
                        </Link>
                        <Button variant={'ghost'} onClick={logoutHndler}>
                          <RiLogoutBoxLine style={{ margin: '4px' }} />
                          Log Out
                        </Button>
                      </HStack>
                      {user && user.role === 'admin' && (
                        <Link onClick={onClose} to="/admin/dashboard">
                          <Button variant={'ghost'} colorScheme={'purple'}>
                            <RiDashboardFill style={{ margin: '4px' }} />
                            Dashboard
                          </Button>
                        </Link>
                      )}
                    </VStack>
                  </>
                ) : (
                  <>
                    <Link onClick={onClose} to="/login">
                      <Button colorScheme={'yellow'}>Login</Button>
                    </Link>
                    <p>OR</p>
                    <Link onClick={onClose} to="/register">
                      <Button colorScheme={'yellow'}>Sign Up</Button>
                    </Link>
                  </>
                )}
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default Header;
