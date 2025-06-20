import React, { use, useEffect } from "react";
import {
  VStack,
  Text,
  Center,
  Icon,
  Flex,
  Box,
  HStack,
  Badge,
  Pressable,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "../context/ThemeContext";
import {
  gradientcolorTheme,
  processItem,
  statusAll,
  statusItems,
} from "../constant/ConstantItem";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepairs } from "../service/repairService";
import { AppDispatch } from "../store";
import { useDoubleBackExit } from "../hooks/useDoubleBackExit";
import { useNavigation } from "@react-navigation/native";

const HomeScreen: React.FC = () => {
  useDoubleBackExit();
  const { colorTheme } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { repairs, loading, error } = useSelector((state: any) => state.repair);

  useEffect(() => {
    dispatch(fetchRepairs());
  }, [dispatch]);

  const renderDashboardItem = () => (
    <>
      {statusAll.map((st) => {
        let count = 0;
        if (st.text === "งานทั้งหมด") {
          count = repairs.length;
        } else if (st.text === "รอดำเนินการ") {
          count = repairs.filter(
            (repair: any) => repair.status === "pending"
          ).length;
        } else if (st.text === "เสร็จสิ้น") {
          count = repairs.filter(
            (repair: any) => repair.status === "completed"
          ).length;
        }

        return (
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
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {st.text}
              </Text>
              <Text
                color="gray.800"
                fontSize="2xl"
                fontWeight="medium"
                textAlign="center"
              >
                {count}
              </Text>
            </Center>
          </Box>
        );
      })}
    </>
  );

  const renderProcessItem = (item: any, key: number) => {
    return (
      <Pressable
        key={item.title}
        width="48%"
        mb="4"
        onPress={() => navigation.navigate(item.screen as never)}
        _pressed={{
          style: {
            transform: [{ scale: 0.88 }]
          }
        }}
      >
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
      </Pressable>
    );
  };

  const renderActivityAll = () => {
    return (
      <>
        {repairs.slice(0, 5).map((item, key) => {
          const status =
            statusItems[item.status as keyof typeof statusItems] ||
            statusItems.pending;

          return (
            <Box
              bg={colorTheme.colors.card}
              rounded="2xl"
              shadow={2}
              p="4"
              key={key}
            >
              <HStack alignItems="flex-start" space={3}>
                <Center bg="amber.50" rounded="full" size="10">
                  <Icon
                    as={Ionicons}
                    name={status.icon}
                    size="5"
                    color={status.color}
                  />
                </Center>

                <VStack flex={1} space={1}>
                  <HStack>
                    <Text
                      color={colorTheme.colors.text}
                      fontSize="md"
                      fontWeight="bold"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      flex={1}
                    >
                      #{item.id}
                    </Text>

                    <Badge
                      bgColor={status.color}
                      variant="solid"
                      px={2}
                      py={0.5}
                      rounded="full"
                      _text={{
                        fontSize: "2xs",
                        fontWeight: "bold",
                        color: "white",
                      }}
                    >
                      {status.text}
                    </Badge>
                  </HStack>

                  <Text
                    color={colorTheme.colors.text}
                    fontSize="sm"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.problem_detail}
                  </Text>
                  <Text
                    color={colorTheme.colors.text}
                    fontSize="sm"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    อาคาร {item.building} ชั้น {item.floor} ห้อง {item.room}
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    2025/06/18 12:00
                  </Text>
                </VStack>
              </HStack>
            </Box>
          );
        })}
      </>
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

      <HStack space={4} justifyContent="space-between" alignItems="center">
        <Text color={colorTheme.colors.text} fontSize="lg" fontWeight="bold">
          กิจกรรมล่าสุด
        </Text>
        <Text color="gray.500" fontSize="sm" fontWeight="bold">
          ดูทั้งหมด
        </Text>
      </HStack>

      {renderActivityAll()}
    </VStack>
  );
};

export default HomeScreen;
