import '../src/components/cc-block/cc-block.js';
import '../src/components/cc-env-var-form/cc-env-var-form.js';
import '../src/components/cc-addon-admin/cc-addon-admin.js';
import { makeStory } from '../src/stories/lib/make-story.js';

const block = document.querySelector('cc-block');
block.innerHTML = `
  <div>
    <div slot="header">
      <h1 slot="title">My new cc-block</h1>
      <div slot="ribbon">'new'</div>
    </div>
      <p slot="content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo 
      porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris 
      dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. 
      Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. 
      Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, 
      molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante 
      ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit 
      venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, 
      non rutrum lectus hendrerit a.</p>
    <!--<button slot="button">CLICK</button>-->
    <div slot="footer">
      <a href="https://developers.clever-cloud.com/">Documentation</a>
      <a href="#">CCAPI</a>
      <a href="#">CLI</a>
    </div>
  </div>
  

`;
// block.image = 'https://assets.clever-cloud.com/logos/nodejs.svg';
// block.icon = iconInfo;
// block.noHead = true;
// block.ribbon = 'new';
// block.state = 'open';
// block._overlay = true;

/*
const blockAddon = document.querySelector('cc-addon-admin');
blockAddon.innerHTML = `

`;
blockAddon.addon = {
  name: 'Awesome addon (PROD)',
  tags: ['foo:bar', 'simple-tag'],
};
 */
