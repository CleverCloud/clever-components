import '../../components/atoms/cc-loader.js';
import notes from '../../.components-docs/cc-loader.md';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '1. Atoms|<cc-loader>',
  parameters: { notes },
};

export const defaultStory = () => {
  return `
    <div class="title">Small container:</div>
    <cc-loader style="background: #eee; width: 1rem; height: 1rem;"></cc-loader>
    
    <div class="title">Big container (horizontally centered):</div>
    <cc-loader style="background: #eee; width: 12rem; height: 6rem;"></cc-loader>
    
    <div class="title">Big container (vertically centered):</div>
    <cc-loader style="background: #eee; width: 6rem; height: 10rem;"></cc-loader>
    
    <div class="title">Change color with CSS custom prop:</div>
    <div style="--cc-loader-color: red">
      <cc-loader style="background: black; width: 12rem; height: 6rem;"></cc-loader>
    </div>
  `;
};

enhanceStoriesNames({ defaultStory });
