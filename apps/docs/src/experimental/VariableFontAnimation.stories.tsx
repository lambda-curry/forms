import type { Meta, StoryObj } from '@storybook/react';
import { VariableFontAnimation } from './VariableFontAnimation';

const meta: Meta<typeof VariableFontAnimation> = {
  title: 'Experimental/Variable Font Animation',
  component: VariableFontAnimation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Variable Font Animation Demo

This component demonstrates an interactive "gooey" text distortion effect using variable fonts and CSS animations. 

## Features

- **Variable Font Technology**: Uses Google Fonts' Recursive font with multiple axes (weight, slant, casual)
- **Real-time Interaction**: Text distorts based on cursor proximity with smooth animations
- **Performance Optimized**: Uses requestAnimationFrame for smooth 60fps animations
- **Responsive Design**: Adapts to different screen sizes
- **Visual Effects**: Combines font variations with CSS transforms, shadows, and blur effects

## How It Works

1. **Cursor Tracking**: JavaScript tracks mouse movement and calculates distance to each letter
2. **Distance Mapping**: Distance is converted to intensity values (closer = higher intensity)
3. **Font Variation**: Intensity controls multiple font axes:
   - **Weight**: 300-1000 (thin to ultra-bold)
   - **Slant**: 0 to -15 degrees (upright to italic)
   - **Casual**: 0-1 (geometric to casual style)
4. **CSS Transforms**: Additional scale and skew transforms for enhanced distortion
5. **Visual Effects**: Dynamic text shadows, blur, and glow effects

## Technical Implementation

- **Font Loading**: Dynamically loads Recursive variable font from Google Fonts
- **Performance**: Debounced with requestAnimationFrame for smooth animations
- **Accessibility**: Maintains readability while providing engaging interactions
- **Fallbacks**: Graceful degradation if variable fonts aren't supported

## Inspiration

This effect replicates the "liquid typography" trend seen in modern web design, where text behaves like a viscous fluid responding to user interaction.

Try hovering over the letters to see the effect in action! 🎨
        `,
      },
    },
  },
  argTypes: {
    text: {
      control: 'text',
      description: 'The text to display and animate',
    },
    fontSize: {
      control: { type: 'range', min: 20, max: 200, step: 5 },
      description: 'Font size in pixels',
    },
    maxInfluenceRadius: {
      control: { type: 'range', min: 50, max: 300, step: 10 },
      description: 'Maximum distance in pixels where cursor affects letters',
    },
    animationSpeed: {
      control: { type: 'range', min: 0.05, max: 0.5, step: 0.05 },
      description: 'Animation transition speed in seconds',
    },
    distortionIntensity: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Intensity multiplier for distortion effects',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'LAMBDA CURRY',
    fontSize: 80,
    maxInfluenceRadius: 120,
    animationSpeed: 0.1,
    distortionIntensity: 1,
  },
};

export const LargeText: Story = {
  args: {
    text: 'GOOEY',
    fontSize: 120,
    maxInfluenceRadius: 150,
    animationSpeed: 0.08,
    distortionIntensity: 1.5,
  },
};

export const SubtleEffect: Story = {
  args: {
    text: 'Subtle Animation',
    fontSize: 60,
    maxInfluenceRadius: 80,
    animationSpeed: 0.15,
    distortionIntensity: 0.5,
  },
};

export const IntenseDistortion: Story = {
  args: {
    text: 'EXTREME',
    fontSize: 100,
    maxInfluenceRadius: 200,
    animationSpeed: 0.05,
    distortionIntensity: 2.5,
  },
};

export const CustomMessage: Story = {
  args: {
    text: 'HELLO WORLD',
    fontSize: 70,
    maxInfluenceRadius: 100,
    animationSpeed: 0.12,
    distortionIntensity: 1.2,
  },
};

export const SmallText: Story = {
  args: {
    text: 'Variable Fonts Rock!',
    fontSize: 40,
    maxInfluenceRadius: 60,
    animationSpeed: 0.2,
    distortionIntensity: 0.8,
  },
};

// Interactive playground story
export const Playground: Story = {
  args: {
    text: 'PLAY WITH ME',
    fontSize: 90,
    maxInfluenceRadius: 140,
    animationSpeed: 0.1,
    distortionIntensity: 1.3,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to experiment with different settings and see how they affect the animation!',
      },
    },
  },
};

