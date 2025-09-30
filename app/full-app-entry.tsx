import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { Image } from 'expo-image'
import React from 'react'
import { Button, StyleSheet, View } from 'react-native'
import ChoptimaScreen from '@/components/Choptima/ChoptimaScreen'
import ParallaxScrollView from '@/components/parallax-scroll-view'
import ReadmeScreen from '@/components/ReadmeScreen'
import Screen from './screens'

const Tabs = createBottomTabNavigator()

function HomeScreen() {
	const navigation = useNavigation()
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
						navigation.navigate(Screen.Choptima as any)
					}}
				/>
			</View>
		</ParallaxScrollView>
	)
}

export default function FullAppEntry() {
	return (
		<NavigationContainer>
			<Tabs.Navigator initialRouteName="Home">
				<Tabs.Screen name="Home" component={HomeScreen} />
				<Tabs.Screen name="Choptima" component={ChoptimaScreen} />
				<Tabs.Screen name="Overview" component={ReadmeScreen} />
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
