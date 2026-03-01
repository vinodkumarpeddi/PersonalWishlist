import { forwardRef, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetProps,
} from '@gorhom/bottom-sheet';
import { WText } from './WText';

interface WBottomSheetProps extends Partial<BottomSheetProps> {
  title?: string;
  snapPoints?: (string | number)[];
  children: React.ReactNode;
}

export const WBottomSheet = forwardRef<BottomSheet, WBottomSheetProps>(
  ({ title, snapPoints: customSnapPoints, children, ...props }, ref) => {
    const snapPoints = useMemo(() => customSnapPoints || ['50%'], [customSnapPoints]);

    const renderBackdrop = useCallback(
      (backdropProps: React.ComponentProps<typeof BottomSheetBackdrop>) => (
        <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} appearsOnIndex={0} />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#12121A' }}
        handleIndicatorStyle={{ backgroundColor: '#6B7280' }}
        backdropComponent={renderBackdrop}
        {...props}
      >
        <View className="px-4 pb-4">
          {title && (
            <WText variant="h3" className="mb-4">
              {title}
            </WText>
          )}
          {children}
        </View>
      </BottomSheet>
    );
  },
);

WBottomSheet.displayName = 'WBottomSheet';
