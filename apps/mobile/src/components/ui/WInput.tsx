import { useState } from 'react';
import { View, TextInput, type TextInputProps } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { WText } from './WText';

interface WInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function WInput({ label, error, leftIcon, rightIcon, ...props }: WInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(error ? '#FF6B6B' : isFocused ? '#6C5CE7' : '#1A1A25', {
      duration: 200,
    }),
  }));

  return (
    <View className="gap-1.5">
      {label && <WText variant="label">{label}</WText>}
      <Animated.View
        style={borderStyle}
        className="flex-row items-center rounded-xl border-2 bg-surface px-4"
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 py-3.5 text-base text-white"
          placeholderTextColor="#6B7280"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </Animated.View>
      {error && (
        <WText variant="caption" className="text-danger ml-1">
          {error}
        </WText>
      )}
    </View>
  );
}
