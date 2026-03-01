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
    borderColor: withTiming(
      error ? '#FF6B6B' : isFocused ? '#6C5CE7' : 'rgba(255,255,255,0.06)',
      { duration: 200 },
    ),
  }));

  return (
    <View className="gap-2">
      {label && (
        <WText variant="label" className="ml-1 uppercase tracking-widest text-xs">
          {label}
        </WText>
      )}
      <Animated.View
        style={[
          borderStyle,
          isFocused
            ? {
                // @ts-expect-error web shadow
                boxShadow: '0 0 20px rgba(108, 92, 231, 0.15)',
              }
            : undefined,
        ]}
        className="flex-row items-center rounded-2xl border-2 bg-surface/90 px-4"
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 py-4 text-base text-white"
          placeholderTextColor="#4A4A5A"
          selectionColor="#6C5CE7"
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
