import React from "react";
import { useTheme } from "@react-navigation/native";
import {
  VStack,
  Text,
  Center,
  Icon,
  Flex,
  Box,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

const dashboard = [
  {
    title: "งานทั้งหมด",
    value: 150,
    icon: "reader-outline",
    iconColor: "blue.500",
  },
  {
    title: "รอดำเนินการ",
    value: 10,
    icon: "hourglass-outline",
    iconColor: "amber.500",
  },
  {
    title: "เสร็จสิ้น",
    value: 10,
    icon: "checkmark-circle-outline",
    iconColor: "green.500",
  },
];

const process = [
  {
    title: "แจ้งซ่อม",
    icon: "build",
    bgColor: "blue.500",
  },
  {
    title: "ประวัติ",
    icon: "time",
    bgColor: "amber.500",
  },
  {
    title: "ส่งงาน",
    icon: "construct",
    bgColor: "green.500",
  },
];

const HomeScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <VStack space={4}>
      <Text color={colors.text} fontSize="lg" fontWeight="bold">
        ภาพรวมงานซ่อม
      </Text>
      <Flex direction="row" wrap="wrap" justify="space-between">
        {dashboard.map((item) => (
          <Box
            key={item.title}
            width="30%"
            mb="4"
          >
            <Center
              bg={colors.card}
              rounded="lg"
              shadow={2}
              p="4"
              h="32"
            >
              <Icon
                as={Ionicons}
                name={item.icon}
                size="8"
                mb="2"
                color={item.iconColor}
              />
              <Text
                color="gray.500"
                fontSize="sm"
                fontWeight="medium"
                mb="1"
                textAlign="center"
              >
                {item.title}
              </Text>
              <Text color={colors.text} fontSize="2xl" fontWeight="bold">
                {item.value}
              </Text>
            </Center>
          </Box>
        ))}
      </Flex>


      <Text color={colors.text} fontSize="lg" fontWeight="bold">
        ดำเนินการด่วน
      </Text>
      <Flex direction="row" wrap="wrap" justify="space-between">
        {process.map((item) => (
          <Box
            key={item.title}
            width="48%"
            mb="4"
          >
            <Center
              bg={item.bgColor}
              rounded="lg"
              shadow={2}
              p="4"
              h="32"
            >
              <Icon
                as={Ionicons}
                name={item.icon}
                size="8"
                mb="2"
                color='white'
              />
              <Text
                color="white"
                fontSize="md"
                mb="1"
                textAlign="center"
              >
                {item.title}
              </Text>
            </Center>
          </Box>
        ))}
      </Flex>
    </VStack>
  );
};

export default HomeScreen;
