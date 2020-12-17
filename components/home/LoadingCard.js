import React from 'react';
import { View } from 'react-native';
import { styles } from '../styles/HomeStyles';

const LoadingCard = () => {
    return (
        <View style={styles.loadingCardContainer}>
            <View style={styles.loadingCardThumbnail} />
            <View style={styles.loadingDataContainer}>
                <View style={styles.loadingCardTitle} />
                <View style={styles.loadingCardArtist} />
            </View>
        </View>
    );
}

export default LoadingCard;
