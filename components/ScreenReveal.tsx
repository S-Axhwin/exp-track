import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    interpolate,
    Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// Calculate max radius to cover the screen from bottom-center
const MAX_RADIUS = Math.hypot(SCREEN_WIDTH, SCREEN_HEIGHT);

interface ScreenRevealProps {
    children: React.ReactNode;
    duration?: number;
}

export const ScreenReveal: React.FC<ScreenRevealProps> = ({ children, duration = 600 }) => {
    const revealAnim = useSharedValue(0);

    useEffect(() => {
        // Start reveal animation immediately on mount
        revealAnim.value = withTiming(1, {
            duration,
            easing: Easing.out(Easing.quad),
        });
    }, []);

    const maskStyle = useAnimatedStyle(() => {
        const radius = interpolate(revealAnim.value, [0, 1], [0, MAX_RADIUS]);
        return {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
        };
    });

    const contentStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(revealAnim.value, [0, 0.1, 1], [0, 1, 1]),
        };
    });

    // Mask Element
    const renderMask = () => (
        <View style={styles.maskWrapper} pointerEvents="none">
            <Animated.View style={[styles.maskCircle, maskStyle]} />
        </View>
    );

    return (
        <View style={styles.container}>
            <MaskedView
                style={styles.flex1}
                maskElement={renderMask()}
            >
                <View style={styles.contentContainer}>
                    <Animated.View style={[styles.flex1, contentStyle]}>
                        {children}
                    </Animated.View>
                </View>
            </MaskedView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    flex1: {
        flex: 1,
    },
    maskWrapper: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    maskCircle: {
        backgroundColor: 'black',
        position: 'absolute',
        bottom: -50,
    },
    contentContainer: {
        flex: 1,
    },
});
