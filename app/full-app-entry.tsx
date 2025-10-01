import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
	NavigationContainer,
	type NavigationProp,
	useNavigation,
} from '@react-navigation/native'
import { Image } from 'expo-image'
import React from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import ChoptimaScreen from '@/components/Choptima/ChoptimaScreen'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import ReadmeScreen from '@/components/ReadmeScreen'
import Screen from './screens'

type RootTabParamList = {
	Home: undefined
	Choptima: undefined
	Overview: undefined
}

const Tabs = createBottomTabNavigator<RootTabParamList>()

function HomeScreen() {
	const navigation = useNavigation<NavigationProp<RootTabParamList>>()
	return (
		<ParallaxScrollView
			headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
			headerImage={
				<Image
					source={require('@/assets/images/partial-react-logo.png')}
					style={styles.reactLogo}
				/>
			}
		>
			<View style={styles.storybookButtons}>
				<Button
					title="Open Choptima"
					onPress={() => {
						navigation.navigate('Choptima')
					}}
				/>
			</View>
		</ParallaxScrollView>
	)
}

export default function FullAppEntry() {
	return (
		<NavigationContainer>
			<Tabs.Navigator initialRouteName={Screen.Overview}>
				{/* <Tabs.Screen name="Home" component={HomeScreen} /> */}
				<Tabs.Screen name="Overview" component={ReadmeScreen} />
				<Tabs.Screen
					name={Screen.Choptima}
					component={ChoptimaScreen}
					options={{
						headerLeft: () => {
							return (
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										paddingLeft: 8,
									}}
								>
									{/* <Text>Choptima</Text> */}
									<Image
										source={require('@/assets/images/choptima-image.png')}
										style={{ width: 48, height: 48 }}
										contentFit="contain"
									/>
								</View>
							)
						},
						tabBarIcon: ({ size }) => (
							<Image
								source={require('@/assets/images/choptima-image.png')}
								style={{ width: size ?? 26, height: size ?? 26 }}
								contentFit="contain"
							/>
						),
					}}
				/>
			</Tabs.Navigator>
		</NavigationContainer>
	)
}

const styles = StyleSheet.create({
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
	storybookButtons: { marginTop: 12, paddingHorizontal: 16 },
})
