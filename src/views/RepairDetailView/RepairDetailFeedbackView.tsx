import { VStack, Text, TextArea, Button, Spinner } from "native-base";
import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Rating } from "react-native-ratings";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { submitFeedback, IFeedbackForm } from "../../service/feedbackService";
import { useAlertDialog } from "../../components/AlertDialogComponent";

interface RepairDetailFeedbackViewProps {
  repairId: number;
}

const RepairDetailFeedbackView: React.FC<RepairDetailFeedbackViewProps> = ({
  repairId,
}) => {
  const { t } = useTranslation();
  const { colorTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { showAlertDialog, AlertDialogComponent } = useAlertDialog();
  const { repairDetail } = useSelector((state: RootState) => state.repair);
  const hasFeedback = repairDetail?.has_feedback || 0;

  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDark = colorTheme.colors.background === "#121212";

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      showAlertDialog(
        t("ALERT.REQ_TXT"),
        t("ALERT.PLS_SELECT_RATING"),
        "warning"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const feedbackForm: IFeedbackForm = {
        repair_id: repairId,
        rating: rating,
        comments: comment.trim() || undefined,
      };

      const result = await dispatch(submitFeedback(feedbackForm) as any);

      if (result.status === "success") {
        showAlertDialog(t("ALERT.SUCCESS"), t("ALERT.FEEDBACK_SUBMITTED"), "success");
        // Reset form after successful submission
        setRating(3);
        setComment("");
      } else {
        showAlertDialog(t("ALERT.ERROR"), t("ALERT.ERROR"), "error");
        console.error("result", result.message);
      }
    } catch (error: any) {
      showAlertDialog(
        t("ALERT.ERROR"),
        error.message || t("ALERT.NETWORK_ERROR"),
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <VStack bg={colorTheme.colors.card} rounded="xl" p={4} shadow={1}>
        <Text color={colorTheme.colors.primary} fontSize="lg" fontWeight="bold">
          {t("COMMON.FEEDBACK")}
        </Text>
        <VStack
          mt={3}
          pt={3}
          borderTopWidth={1}
          borderTopColor={colorTheme.colors.border}
          space={3}
        >
          <Rating
            type="star"
            ratingCount={5}
            imageSize={45}
            onFinishRating={handleRatingChange}
            startingValue={rating}
            readonly={isSubmitting}
            tintColor={isDark ? colorTheme.colors.card : undefined}
          />
          <Text color={colorTheme.colors.text} fontSize="sm" mt={2}>
            {t("COMMON.COMMENT")}
          </Text>
          <TextArea
            placeholder={t("COMMON.COMMENT_PLACEHOLDER")}
            value={comment}
            onChangeText={setComment}
            isDisabled={isSubmitting}
            tvParallaxProperties={undefined}
            onTextInput={undefined}
            autoCompleteType={undefined}
          />
          {hasFeedback == 0 && (
            <Button
              variant="outline"
              rounded="xl"
              size="sm"
              borderColor={colorTheme.colors.primary}
              _text={{ color: colorTheme.colors.primary, fontWeight: "bold" }}
              onPress={handleSubmitFeedback}
              leftIcon={
                isSubmitting ? <Spinner size="sm" color="white" /> : undefined
              }
            >
              {isSubmitting ? t("COMMON.SUBMITTING") : t("COMMON.SUBMIT")}
            </Button>
          )}
        </VStack>
      </VStack>
      <AlertDialogComponent />
    </>
  );
};

export default RepairDetailFeedbackView;
