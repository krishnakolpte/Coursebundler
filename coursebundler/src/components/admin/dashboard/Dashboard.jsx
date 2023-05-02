import {
  Box,
  Grid,
  Heading,
  HStack,
  Progress,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import cursorPng from '../../../assets/images/cursor.png';
import { getDashboardStats } from '../../../redux/Actions/admin';
import Loader from '../../layout/Loader';
import SideBar from '../SideBar';
import { DoughnutChart, LineChart } from './Chart';

const DataBox = ({ title, qty, qtyPercentage, profit }) => (
  <Box
    w={['full', '20%']}
    boxShadow={'-2px 0 10px rgba(107,70,193,0.5)'}
    p="8"
    borderRadius={'lg'}
  >
    <Text children={title} />
    <HStack spacing={'6'}>
      <Text fontSize={'2xl'} fontWeight="bold" children={qty} />
      <HStack>
        <Text children={`${qtyPercentage}% `} />
        {profit ? (
          <RiArrowUpLine color="green" />
        ) : (
          <RiArrowDownLine color="red" />
        )}
      </HStack>
    </HStack>
    <Text opacity={'0.5'} children={'Since last month'} />
  </Box>
);

const Bar = ({ title, value, profit }) => (
  <Box py={'4'} px={['0', '20']}>
    <Heading size={'sm'} children={title} mb="2" />
    <HStack w={'full'} alignItems="center">
      <Text children={profit ? '0%' : `-${value}%`} />
      <Progress w={'full'} value={profit ? value : 0} colorScheme="purple" />
      <Text children={`${value > 100 ? value : 100}%`} />
    </HStack>
  </Box>
);

function Dashboard() {
  const dispatch = useDispatch();

  const {
    loading,
    stats,
    usersCount,
    subscriptionCount,
    viewsCount,
    subscriptionPercentage,
    viewsPercentage,
    usersPercentage,
    subscriptionProfit,
    viewsProfit,
    usersProfit,
  } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <Grid
      css={{ cursor: `url(${cursorPng}),default` }}
      minH={'100vh'}
      templateColumns={['1fr', '5fr 1fr']}
    >
      {loading || !stats ? (
        <Loader color="purple.500" />
      ) : (
        <Box boxSizing="border-box" py={'16'} px={['4', '0']}>
          <Text
            textAlign={'center'}
            opacity="0.5"
            children={`Last change was on ${
              String(new Date(stats[11].createdAt)).split('G')[0]
            }`}
          />
          <Heading
            textAlign={['center', 'left']}
            children="Dashboard"
            ml={['0', '16']}
            mb="16"
          />
          <Stack
            direction={['column', 'row']}
            justifyContent="space-evenly"
            minH={'24'}
          >
            <DataBox
              title="Views"
              qty={viewsCount}
              qtyPercentage={viewsPercentage}
              profit={viewsProfit}
            />
            <DataBox
              title="Users"
              qty={usersCount}
              qtyPercentage={usersPercentage}
              profit={usersProfit}
            />
            <DataBox
              title="Subscription"
              qty={subscriptionCount}
              qtyPercentage={subscriptionPercentage}
              profit={subscriptionProfit}
            />
          </Stack>
          <Box
            m={['0', '16']}
            borderRadius={'lg'}
            p={['0', '16']}
            mt={['4', '16']}
            boxShadow={'-2px 0 10px rgba(107,70,193,0.5)'}
          >
            <Heading
              textAlign={['center', 'left']}
              size="md"
              children="Views Graph"
              pt={['8', '0']}
              ml={['0', '16']}
            />
            {/* Line Graph Here */}
            <LineChart views={stats.map(item => item.views)} />
          </Box>

          <Grid templateColumns={['1fr', '2fr 1fr']}>
            <Box p={'4'}>
              <Heading
                textAlign={['center', 'left']}
                size="md"
                children="Progress Bar"
                my={'8'}
                ml={['0', 16]}
              />
              <Box>
                <Bar
                  title={'Views'}
                  value={viewsPercentage}
                  profit={viewsProfit}
                />
                <Bar
                  title={'Users'}
                  value={usersPercentage}
                  profit={usersProfit}
                />
                <Bar
                  title={'Subscriptions'}
                  value={subscriptionPercentage}
                  profit={subscriptionProfit}
                />
              </Box>
            </Box>
            <Box p={['0', '16']} boxSize="border-box" py={'4'}>
              <Heading
                textAlign={'center'}
                size="md"
                mb={'4'}
                children="Users"
              />
              {/* Doughnut  graph */}
              <DoughnutChart
                users={[subscriptionCount, usersCount - subscriptionCount]}
              />
            </Box>
          </Grid>
        </Box>
      )}

      <SideBar />
    </Grid>
  );
}

export default Dashboard;
