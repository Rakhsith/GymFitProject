import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextInputProps,
  Pressable,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export default function Input({
  label,
  error,
  icon,
  rightIcon,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry !== undefined;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholderTextColor={Colors.dark.textTertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.iconRight}>
            {showPassword ? (
              <EyeOff size={20} color={Colors.dark.textTertiary} />
            ) : (
              <Eye size={20} color={Colors.dark.textTertiary} />
            )}
          </Pressable>
        )}
        {rightIcon && !isPassword && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: 'hidden',
  },
  inputFocused: {
    borderColor: Colors.dark.primary,
  },
  inputError: {
    borderColor: Colors.dark.error,
  },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: SPACING.lg,
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
  },
  inputWithIcon: {
    paddingLeft: SPACING.sm,
  },
  iconLeft: {
    paddingLeft: SPACING.lg,
  },
  iconRight: {
    paddingRight: SPACING.lg,
  },
  errorText: {
    color: Colors.dark.error,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});
