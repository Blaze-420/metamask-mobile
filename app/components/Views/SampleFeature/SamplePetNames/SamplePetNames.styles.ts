import { StyleSheet } from 'react-native';
import {Theme} from '../../../../util/theme/models';

const styleSheet = (params: {
    theme: Theme;
}) => {
    const { theme } = params;
    const { colors } = theme;
    return StyleSheet.create({
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
        wrapper: {
            backgroundColor: colors.background.default,
            flex: 1,
            marginTop: 16,
        },
        keyboardAvoidingView: {
            flex: 1,
            flexDirection: 'row',
            alignSelf: 'center',
        },
        formContainer: {
            marginTop: 24,
            paddingBottom: 24,
        },
        inputContainer: {
            marginBottom: 16,
        },
        buttonContainer: {
            marginTop: 8,
        },
        PetNameListItem: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            padding: 8,
        },
        textStack: {
            marginLeft: 12,
            flex: 1,
        },
    });
};

export default styleSheet;
