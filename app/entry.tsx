import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Image } from 'expo-image';
import React, { useMemo, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';

const NullComponent = () => null;

export default function Entry() {
	const [showStorybook, setShowStorybook] = useState(false)

	const StorybookUIRoot: any = useMemo(() => {
		if (showStorybook) {
			const Component = require('../../.rnstorybook/index');

			console.log("DynamicRequire", Component);

			return Component?.default ?? NullComponent; 
		}
		return NullComponent
	}, [showStorybook])

	return showStorybook && StorybookUIRoot ? (
		<StorybookUIRoot />
	) : (
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
				<Button title="Open Demo (Screens)" onPress={() => setShowStorybook(true)} />
			</View>
			<View style={styles.storybookButtons}>
				<Button title="Open Full App" onPress={() => setShowStorybook(true)} />
			</View>
		</ParallaxScrollView>
	)
}

const styles = StyleSheet.create({
	titleContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 8,
	},
	stepContainer: {
		gap: 8,
		marginBottom: 8,
	},
	reactLogo: {
		height: 178,
		width: 290,
		bottom: 0,
		left: 0,
		position: 'absolute',
	},
	storybookButtons: {
		marginTop: 12,
		paddingHorizontal: 16,
	},
	storybookButtonsBottom: {
		marginVertical: 20,
		paddingHorizontal: 16,
	},
})
