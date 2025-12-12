import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AvatarPlaceholder from '../components/AvatarPlaceholder';
import RecommendationCard from '../components/RecommendationCard';
import HealthBar from '../components/HealthBar';
import useStore from '../store/useStore';
import { colors } from '../theme/colors';
import { fonts, fontSizes } from '../theme/fonts';
import strings from '../locales/strings.json';

const { width, height } = Dimensions.get('window');

const ChatScreen = ({ navigation }) => {
  const { avatarUrl, healthScore, chatHistory, addChatMessage } = useStore();
  const [inputText, setInputText] = React.useState('');
  const [showRecommendation, setShowRecommendation] = React.useState(false);
  const [currentRecommendation, setCurrentRecommendation] = React.useState(null);
  const scrollViewRef = React.useRef();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);

    // Check if it's a purchase query
    if (inputText.toLowerCase().includes('phone') && inputText.toLowerCase().includes('70')) {
      // Show recommendation after a delay
      setTimeout(() => {
        const recommendation = {
          pros: [
            'No need to buy again for next 4 years',
            'You will get a premium resale value',
          ],
          cons: [
            "Your usse is basic, don't need to spend so much",
            'Goal completion will get delayed by 21 days',
          ],
          overall:
            'If you continue to invest and save according to our plan, you will be able to comfortably buy it after 4 months.',
        };
        setCurrentRecommendation(recommendation);
        setShowRecommendation(true);

        const botMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          text: 'Maybe you switch to a cheaper alternative',
          timestamp: new Date(),
        };
        addChatMessage(botMessage);
      }, 1000);
    } else {
      // Generic response
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          text: "I'm here to help you with your financial decisions!",
          timestamp: new Date(),
        };
        addChatMessage(botMessage);
      }, 500);
    }

    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Background gradient */}
      <LinearGradient
        colors={[colors.backgroundDark, colors.backgroundNavy, colors.backgroundTeal]}
        style={styles.gradient}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.teal} />
        </TouchableOpacity>
      </View>

      {/* Avatar at top */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <AvatarPlaceholder avatarUrl={avatarUrl} healthScore={healthScore} />
        </View>
      </View>

      {/* Chat messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {chatHistory.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.type === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.type === 'user' ? styles.userText : styles.assistantText,
              ]}
            >
              {message.text}
            </Text>
          </View>
        ))}

        {/* Recommendation card */}
        {showRecommendation && currentRecommendation && (
          <RecommendationCard
            pros={currentRecommendation.pros}
            cons={currentRecommendation.cons}
            overall={currentRecommendation.overall}
          />
        )}
      </ScrollView>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        {/* Health bar */}
        <HealthBar score={healthScore} />

        {/* Input area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder={strings.en.chat.inputPlaceholder}
              placeholderTextColor={colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Ionicons name="person-circle" size={32} color={colors.teal} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  avatarSection: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  avatarContainer: {
    width: width * 0.5,
    height: height * 0.3,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingVertical: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.teal,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(77, 208, 225, 0.3)',
  },
  messageText: {
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
  },
  userText: {
    color: colors.textDark,
  },
  assistantText: {
    color: colors.textPrimary,
  },
  bottomSection: {
    backgroundColor: 'rgba(26, 29, 58, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    paddingVertical: 8,
  },
  sendButton: {
    padding: 4,
  },
});

export default ChatScreen;
