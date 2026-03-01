import { useState, useEffect, useCallback } from 'react';
import { WText } from '../ui';
import { AnimatedPressable } from '../ui';

interface CountdownTimerProps {
  seconds: number;
  onResend: () => void;
}

export function CountdownTimer({ seconds, onResend }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (remaining <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const handleResend = useCallback(() => {
    setRemaining(seconds);
    setCanResend(false);
    onResend();
  }, [seconds, onResend]);

  if (canResend) {
    return (
      <AnimatedPressable onPress={handleResend}>
        <WText variant="body" className="text-brand font-semibold">
          Resend OTP
        </WText>
      </AnimatedPressable>
    );
  }

  return (
    <WText variant="bodySmall">
      Resend in{' '}
      <WText variant="bodySmall" className="text-brand font-semibold">
        {remaining}s
      </WText>
    </WText>
  );
}
