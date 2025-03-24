import { StyleSheet } from 'react-native';

// TODO - implement proper styles for the SampleCounterPane component following our guidelines
const styleSheet = StyleSheet.create({
    card: {
        maxWidth: 500,
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
    },
    button: {
        backgroundColor: '#037DD6',
        padding: 12,
        borderRadius: 6,
        width: '100%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    }
});

export default styleSheet;
