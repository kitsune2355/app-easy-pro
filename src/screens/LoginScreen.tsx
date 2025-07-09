import {
  VStack,
  FormControl,
  Center,
  Button,
  Pressable,
  Text,
  Image,
  Box,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useLoginForm } from "../hooks/useLoginForm";
import { ILoginForm } from "../interfaces/form/loginForm";
import { Controller } from "react-hook-form";
import Icons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackParamsList } from "../interfaces/navigation/navigationParamsList.interface";
import CryptoJS from "crypto-js";
import { LanguageButtonGroup } from "../components/LanguageButtonGroup";
import { useTranslation } from "react-i18next";

export const generateMd5 = (input: string): string => {
  let result = input;

  for (let i = 0; i < 3; i++) {
    result = CryptoJS.MD5(result).toString();
  }

  return result;
};

const LoginScreen = () => {
  const { i18n, t } = useTranslation();
  const { colorTheme } = useTheme();
  const navigation = useNavigation<StackNavigationProp<StackParamsList>>();
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState(i18n.language || "th");
  const { control, handleSubmit, setError, setValue } = useLoginForm();
  const { loginUser, isLoading, error, isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate("MainDrawer");
    }
  }, [isLoggedIn, navigation]);

  const handleLangChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLang(lang);
  };

  const onSubmit = useCallback(
    async (formValues: ILoginForm) => {
      try {
        const hashedPassword = generateMd5(formValues.password);
        await loginUser({
          username: formValues.username,
          password: hashedPassword,
        });
      } catch (e) {
        setError("username", { message: "ชื่อผู้ใช้งานหรือรหัสผ่านผิด" });
        setValue("password", "");
      }
    },
    [loginUser, setError, setValue]
  );

  const toggleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const getInputStyle = (hasError: boolean) => ({
    ...styles.input,
    borderColor: hasError ? "#ef4444" : "#d1d5db",
    color: colorTheme.colors.text,
  });

  return (
    <VStack
      flex={1}
      px={8}
      bg={{
        linearGradient: {
          colors: ["#006B9F", "#9fd7f3", "#fff", "#fff", "#9fd7f3", "#192f6a"],
          start: [1, 0],
          end: [1, 1],
        },
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <Box safeAreaTop>
          <LanguageButtonGroup
            langs={["th", "en"]}
            value={lang}
            onPress={handleLangChange}
          />
        </Box>
        <VStack flex={1} justifyContent="center" alignItems="center">
          <Image
            source={require("../../assets/images/logo_full.png")}
            alt="logo"
            size={48}
            mb={8}
          />

          <Controller
            control={control}
            name="username"
            render={({
              field: { value, onBlur, onChange },
              fieldState: { error },
            }) => (
              <FormControl isInvalid={!!error} width="100%" maxWidth={500}>
                <TextInput
                  placeholder={t("LOGIN.USERNAME")}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  style={getInputStyle(!!error)}
                  placeholderTextColor="#9ca3af"
                />
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
              <FormControl
                mt="4"
                isInvalid={!!error}
                width="100%"
                maxWidth={500}
              >
                <VStack position="relative">
                  <TextInput
                    placeholder={t("LOGIN.PASSWORD")}
                    secureTextEntry={!showPassword}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    style={getInputStyle(!!error)}
                    placeholderTextColor="#9ca3af"
                  />
                  <Pressable
                    onPress={toggleShowPassword}
                    position="absolute"
                    right={3}
                    top={3}
                    zIndex={1}
                  >
                    <Icons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={24}
                      color={colorTheme.colors.text}
                    />
                  </Pressable>
                </VStack>
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
            w="full"
            bg={colorTheme.colors.primary}
            _text={{ color: "#fff", fontSize: "md", fontWeight: "bold" }}
            isLoading={isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            {t("LOGIN.LOGIN_BTN")}
          </Button>
        </VStack>
      </KeyboardAvoidingView>

      <Center safeAreaBottom>
        <Text color="white" fontSize="xs">
          {t("PROACTIVE")}
        </Text>
      </Center>
    </VStack>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
});

export default LoginScreen;
