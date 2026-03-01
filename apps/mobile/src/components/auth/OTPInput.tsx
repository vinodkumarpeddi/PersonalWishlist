import { useRef, useState, useEffect } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { WText } from '../ui';
import { APP_CONSTANTS } from '@wishpal/shared';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  error?: string;
}

export function OTPInput({ length = APP_CONSTANTS.OTP_LENGTH, onComplete, error }: OTPInputProps) {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [error, shakeX]);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];

    if (text.length > 1) {
      // Handle paste
      const digits = text.replace(/\D/g, '').split('').slice(0, length);
      digits.forEach((d, i) => {
        if (index + i < length) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputs.current[nextIndex]?.focus();

      if (newCode.every((d) => d !== '')) {
        onComplete(newCode.join(''));
      }
      return;
    }

    newCode[index] = text;
    setCode(newCode);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every((d) => d !== '')) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View>
      <Animated.View style={shakeStyle} className="flex-row justify-center gap-3">
        {Array.from({ length }).map((_, i) => {
          const isFilled = code[i] !== '';
          return (
            <Pressable key={i} onPress={() => inputs.current[i]?.focus()}>
              <View
                className={`w-13 h-14 rounded-xl border-2 items-center justify-center ${
                  isFilled ? 'border-brand bg-brand/10' : 'border-surface-light bg-surface'
                }`}
              >
                <TextInput
                  ref={(ref) => {
                    inputs.current[i] = ref;
                  }}
                  value={code[i]}
                  onChangeText={(text) => handleChange(text, i)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                  keyboardType="number-pad"
                  maxLength={i === 0 ? length : 1}
                  className="text-white text-2xl font-bold text-center w-full h-full"
                  selectionColor="#6C5CE7"
                  autoFocus={i === 0}
                />
              </View>
            </Pressable>
          );
        })}
      </Animated.View>
      {error && (
        <WText variant="caption" className="text-danger text-center mt-3">
          {error}
        </WText>
      )}
    </View>
  );
}
