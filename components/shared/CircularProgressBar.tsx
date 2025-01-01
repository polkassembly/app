import React from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircularProgressBarProps {
  percentage: number; // Progress percentage (0 to 100)
  radius?: number; // Radius of the circle
  strokeWidth?: number; // Thickness of the progress bar
  color?: string; // Color of the progress bar
  backgroundColor?: string; // Background circle color
  textStyle?: TextStyle; // Custom text styles
}

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  percentage,
  radius = 50,
  strokeWidth = 10,
  color = '#3498db',
  backgroundColor = '#e0e0e0',
  textStyle = {},
}) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = -(
    circumference - (percentage / 100) * circumference
  ); // Negate the offset for anti-clockwise fill

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* Background Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2} // Adjust for stroke width
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - strokeWidth / 2} // Adjust for stroke width
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${radius} ${radius})`} // Rotate for top start and anti-clockwise fill
        />
      </Svg>
      {/* Percentage Text */}
      <View style={[StyleSheet.absoluteFill, styles.textContainer]}>
        <Text
          style={[
            {
              fontSize: radius / 2.5, // Dynamic font size based on radius
              fontWeight: 'bold',
              color: '#000',
            },
            textStyle,
          ]}
        >
          {`${percentage}%`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CircularProgressBar;
