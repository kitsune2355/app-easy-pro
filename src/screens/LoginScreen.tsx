import {
  VStack,
  FormControl,
  Center,
  Button,
  Input,
  Pressable,
  Text,
  Spinner,
  Image,
} from "native-base";
import React, { useCallback, useState } from "react";
import { useLoginForm } from "../hooks/useLoginForm";
import { ILoginForm } from "../interfaces/form/loginForm";
import { Controller } from "react-hook-form";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";

const LoginScreen = () => {
  const { colorTheme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, setError, setValue } = useLoginForm();
  const { loginUser, isLoading, error, isLoggedIn } = useAuth();

  const onSubmit = useCallback(
    async (formValues: ILoginForm) => {
      try {
        await loginUser({
          username: formValues.username,
          password: formValues.password,
        });

        if (isLoggedIn) {
          navigation.navigate("MainDrawer");
        }
      } catch (e) {
        setError("username", { message: "ชื่อผู้ใช้งานหรือรหัสผ่านผิด" });
        setValue("password", "");
      }
    },
    [loginUser, isLoggedIn, navigation, setError, setValue]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <VStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      px={8}
      bg={{
        linearGradient: {
          colors: ["#006B9F", "#9fd7f3", "#fff","#fff","#9fd7f3", "#192f6a"],
          start: [1, 0],
          end: [1, 1],
        },
      }}
    >
      <Image
        source={require("../../assets/logo_full.png")}
        alt="logo"
        size='xl'
        mb={8}
      />
      <Controller
        control={control}
        name="username"
        render={({
          field: { value, onBlur, onChange },
          fieldState: { error },
        }) => (
          <FormControl isInvalid={!!error}>
            <Center>
              <Input
                type="text"
                placeholder="ชื่อผู้ใช้"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                maxWidth={500}
              />
            </Center>
            {error && (
              <FormControl.ErrorMessage>
                {error.message}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({
          field: { value, onBlur, onChange },
          fieldState: { error },
        }) => (
          <FormControl mt="4" isInvalid={!!error}>
            <Center>
              <Input
                placeholder="รหัสผ่าน"
                type={showPassword ? "text" : "password"}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                maxWidth={500}
                InputRightElement={
                  <Pressable onPress={toggleShowPassword}>
                    <Icons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={24}
                      color={colorTheme.colors.text}
                      style={{ marginRight: 12 }}
                    />
                  </Pressable>
                }
              />
            </Center>
            {error && (
              <FormControl.ErrorMessage>
                {error.message}
              </FormControl.ErrorMessage>
            )}
          </FormControl>
        )}
      />

      {error && (
        <Center mt={2}>
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        </Center>
      )}

        <Button
          mt="4"
          w='full'
          bg={colorTheme.colors.primary}
          _text={{ color: '#fff',fontSize: 'md', fontWeight: 'bold' }}
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          เข้าสู่ระบบ
        </Button>
    </VStack>
  );
};

export default LoginScreen;
