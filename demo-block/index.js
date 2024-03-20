import '../src/components/cc-block/cc-block.js';
import '../src/components/cc-env-var-form/cc-env-var-form.js';

const block = document.querySelector('cc-block');
block.innerHTML = `
  <div slot="title">My new cc-block</div>
  <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu. Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris. Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl, molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue, non rutrum lectus hendrerit a.</div>
  <!--<button slot="button">CLICK</button>-->
`;
block.image = 'https://assets.clever-cloud.com/logos/nodejs.svg';
// block.icon = iconInfo;
// block.noHead = true;
block.ribbon = 'new';
//block.state = 'open';
// block._overlay = true;
