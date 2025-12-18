import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    StyleSheet
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { Google } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');

    return (
        <View
            className='flex-1 bg-background'
            style={styles.scrollContent}
        >
            <View className='flex-1  pt-12 pb-8'>
                {/* Masked Robot Image */}
                <Animated.View
                    entering={FadeInUp.delay(200).springify()}
                    className='mb-8'
                    style={styles.maskedContainer}
                >
                    <MaskedView
                        style={styles.maskedView}
                        maskElement={
                            <View style={styles.maskShape}>
                                {/* Large circle mask positioned from left corner */}
                                <View style={styles.circleMask} />
                            </View>
                        }
                    >
                        <Image
                            source={require('../../assets/images/robot-signup.png')}
                            style={styles.robotImage}
                            resizeMode='cover'
                        />
                    </MaskedView>
                </Animated.View>

                <View className='px-6'>
                    {/* Heading */}
                    <Animated.View entering={FadeInDown.delay(400).springify()}>
                        <Text className='text-4xl font-bold text-foreground mb-8 leading-tight'>
                            We have a free{'\n'}plan for you
                        </Text>
                    </Animated.View>

                    {/* Email Input */}
                    <Animated.View entering={FadeInDown.delay(600).springify()} className='mb-6'>
                        <Text className='text-sm font-medium text-foreground mb-2'>
                            E-mail
                        </Text>
                        <TextInput
                            className='bg-card border border-border rounded-xl px-4 py-4 text-base text-foreground'
                            placeholder='Your email address'
                            placeholderTextColor='rgb(161, 161, 170)'
                            value={email}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                    </Animated.View>

                    {/* OR Divider */}
                    <Animated.View
                        entering={FadeInDown.delay(800).springify()}
                        className='flex-row items-center mb-6'
                    >
                        <View className='flex-1 h-px bg-border' />
                        <Text className='px-4 text-muted-foreground text-sm'>or</Text>
                        <View className='flex-1 h-px bg-border' />
                    </Animated.View>

                    {/* Social Login Buttons */}
                    <Animated.View
                        entering={FadeInDown.delay(1000).springify()}
                        className='flex-row justify-center gap-4 mb-8'
                    >
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className='w-16 h-16 rounded-2xl bg-card border border-border items-center justify-center'
                            style={styles.socialButton}
                            onPress={async () => {
                                await AsyncStorage.setItem('hasOnboarded', 'true');
                                router.replace('/onboarding/reminders');
                            }}
                        >
                            <Google size="28" color="rgb(24, 24, 27)" variant="Bold" />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Register Button */}
                    <Animated.View entering={FadeInDown.delay(1200).springify()} className='mb-6'>
                        <TouchableOpacity
                            className='rounded-full py-5 items-center bg-primary'
                            style={styles.registerButton}
                        >
                            <Text className='text-white font-bold text-lg'>
                                Register Now!
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Sign In Link */}
                    <Animated.View
                        entering={FadeInDown.delay(1400).springify()}
                        className='flex-row justify-center'
                    >
                        <Text className='text-muted-foreground text-base'>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity>
                            <Text className='text-base font-semibold' style={{ color: 'rgb(79, 70, 229)' }}>
                                Sign In
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flexGrow: 1,
    },
    socialButton: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    registerButton: {
        shadowColor: 'rgba(238, 226, 114, 1)',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    maskedContainer: {
        width: '100%',
        height: 280,
        overflow: 'hidden',
    },
    maskedView: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    maskShape: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    circleMask: {
        width: 600,
        height: 600,
        borderRadius: 225,
        backgroundColor: 'black',
        position: 'absolute',
        top: -100,
        left: -50,
    },
    robotImage: {
        width: '100%',
        height: '100%',
    },
});
