import React from "react";
import {
  VStack,
  Text,
  Center,
  Icon,
  Flex,
  Box,
  HStack,
  Badge,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import { gradientcolorTheme, processItem, statusAll } from "../constant/ConstantItem";

const HomeScreen: React.FC = () => {
  const { colorTheme } = useTheme();

  const renderDashboardItem = () => (
    <>
      {statusAll.map((st) => (
        <Box key={st.text} width="30%" mb="4">
          <Center
            bg={colorTheme.colors.card}
            rounded="2xl"
            shadow={2}
            p="4"
            h="32"
          >
            <Icon
              as={Ionicons}
              name={st.icon}
              size="8"
              mb="2"
              color={st.color}
            />
            <Text
              color="gray.500"
              fontSize="sm"
              fontWeight="medium"
              mb="1"
              textAlign="center"
            >
              {st.text}
            </Text>
            <Text
              color="gray.800"
              fontSize="lg"
              fontWeight="bold"
              textAlign="center"
            >
              15
            </Text>
          </Center>
        </Box>
      ))}
    </>
  );

  const renderProcessItem = (item: any, key: number) => {
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
          rounded="3xl"
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

  const renderActivityAll = () => {
    return (
      <Box bg={colorTheme.colors.card} rounded="2xl" shadow={2} p="4">
        <HStack alignItems="flex-start" space={3}>
          <Center bg="amber.50" rounded="full" size="10">
            <Icon as={Ionicons} name="home" size="5" color="amber.500" />
          </Center>

          <VStack flex={1} space={2}>
            <HStack>
              <Text
                color={colorTheme.colors.text}
                fontSize="md"
                fontWeight="bold"
                numberOfLines={2}
                ellipsizeMode="tail"
                flex={1}
              >
                title
              </Text>

              <Badge
                bgColor="amber.500"
                variant="solid"
                px={2}
                py={0.5}
                rounded="full"
                _text={{ fontSize: "2xs", fontWeight: "bold", color: "white" }}
              >
                รอดำเนินการ
              </Badge>
            </HStack>

            <Text
              color={colorTheme.colors.text}
              fontSize="sm"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo fugit
              sequi, exercitationem animi tempore harum ipsa dolore quasi
              asperiores, eos tempora voluptatum iste ea vitae distinctio
              delectus totam veritatis consequatur?
            </Text>
            <Text color="gray.500" fontSize="xs">
              2025/06/18 12:00
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  };

  return (
    <VStack space={4}>
      <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
        ภาพรวมงานซ่อม
      </Text>
      <Flex direction="row" wrap="wrap" justify="space-between">
        {renderDashboardItem()}
      </Flex>

      <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
        ดำเนินการด่วน
      </Text>
      <Flex direction="row" wrap="wrap" justify="space-between">
        {processItem.map((item, key) => renderProcessItem(item, key))}
      </Flex>

      <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
        กิจกรรมล่าสุด
      </Text>
      {renderActivityAll()}
    </VStack>
  );
};

export default HomeScreen;
