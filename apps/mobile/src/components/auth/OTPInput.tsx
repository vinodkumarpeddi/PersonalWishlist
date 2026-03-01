import { useRef, useState, useEffect } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeInDown,
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
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputs = useRef<(TextInput | null)[]>([]);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (error) {
      shakeX.value = withSequence(
        withTiming(-12, { duration: 50 }),
        withTiming(12, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
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
      const digits = text.replace(/\D/g, '').split('').slice(0, length);
      digits.forEach((d, i) => {
        if (index + i < length) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
      if (newCode.every((d) => d !== '')) onComplete(newCode.join(''));
      return;
    }
    newCode[index] = text;
    setCode(newCode);
    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
    if (newCode.every((d) => d !== '')) onComplete(newCode.join(''));
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  return (
    <View>
      <Animated.View style={shakeStyle} className="flex-row justify-center gap-3">
        {Array.from({ length }).map((_, i) => {
          const isFilled = code[i] !== '';
          const isFocused = focusedIndex === i;
          return (
            <Animated.View
              key={i}
              entering={FadeInDown.delay(i * 60).springify()}
            >
              <Pressable onPress={() => { inputs.current[i]?.focus(); setFocusedIndex(i); }}>
                <View
                  className={`w-12 h-14 rounded-2xl items-center justify-center border-2 ${
                    error
                      ? 'border-danger/50 bg-danger/5'
                      : isFilled
                        ? 'border-brand bg-brand/10'
                        : isFocused
                          ? 'border-brand/50 bg-surface-light'
                          : 'border-white/5 bg-surface'
                  }`}
                  style={
                    isFocused
                      ? {
                          // @ts-expect-error web shadow
                          boxShadow: '0 0 16px rgba(108, 92, 231, 0.2)',
                        }
                      : undefined
                  }
                >
                  <TextInput
                    ref={(ref) => { inputs.current[i] = ref; }}
                    value={code[i]}
                    onChangeText={(text) => handleChange(text, i)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                    onFocus={() => setFocusedIndex(i)}
                    keyboardType="number-pad"
                    maxLength={i === 0 ? length : 1}
                    className="text-white text-xl font-bold text-center w-full h-full"
                    selectionColor="#6C5CE7"
                    autoFocus={i === 0}
                  />
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>
      {error && (
        <WText variant="caption" className="text-danger text-center mt-4 font-medium">
          {error}
        </WText>
      )}
    </View>
  );
}
