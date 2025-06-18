import React from "react";
import { VStack, Text, Center, Icon, Flex, Box } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";

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
  },
  {
    title: "ประวัติ",
    icon: "time",
  },
  {
    title: "ส่งงาน",
    icon: "construct",
  },
];

const HomeScreen: React.FC = () => {
  const { colorTheme } = useTheme();

  const renderDashboardItem = (item: any) => (
    <Box key={item.title} width="30%" mb="4">
      <Center bg={colorTheme.colors.card} rounded="2xl" shadow={2} p="4" h="32">
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
        <Text
          color="gray.800"
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
        >
          {item.value}
        </Text>
      </Center>
    </Box>
  );

  const renderProcessItem = (item: any, key: number) => {
  const gradientcolorTheme = {
    0: ["#006289", "#26a69a"],
    1: ["#b13579", "#7e57c2"],
    2: ["#3598b1", "#6f35b1"],
  };

  return (
    <Box key={item.title} width="48%" mb="4">
      <Box
        bg={{
          linearGradient: {
            colors: gradientcolorTheme[key],
            start: [0, 0],
            end: [1, 1],
          },
        }}
        rounded='3xl'
        shadow={2}
        p="4"
        h="32"
      >
        <Center flex={1}>
          <Icon as={Ionicons} name={item.icon} size="12" color="white" />
          <Text
            color="white"
            fontSize="md"
            mb="1"
            textAlign="center"
            fontWeight="bold"
          >
            {item.title}
          </Text>
        </Center>
      </Box>
    </Box>
  );
};


  return (
    <VStack space={4}>
      <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
        ภาพรวมงานซ่อม
      </Text>
      <Flex direction="row" wrap="wrap" justify="space-between">
        {dashboard.map((item) => renderDashboardItem(item))}
      </Flex>

      <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
        ดำเนินการด่วน
      </Text>
      <Flex direction="row" wrap="wrap" justify="space-between">
        {process.map((item, key) => renderProcessItem(item, key))}
      </Flex>
    </VStack>
  );
};

export default HomeScreen;
