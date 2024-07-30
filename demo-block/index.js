import '../src/components/cc-block-new/cc-block-new.js';

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo
porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris
dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu.
Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris.
Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl,
molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante
ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit
venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue,
non rutrum lectus hendrerit a.
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque feugiat dui at leo
porta dignissim. Etiam ut purus ultrices, pulvinar tellus quis, cursus massa. Mauris
dignissim accumsan ex, at vestibulum lectus fermentum id. Quisque nec magna arcu.
Quisque in metus sed erat sodales euismod eget id purus. Sed sagittis rhoncus mauris.
Ut sit amet urna ac nunc semper porta. Nam ut felis eu velit luctus rutrum. Nam leo nisl,
molestie a varius non, ullamcorper sit amet tortor. Donec in convallis ex. Vestibulum ante
ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Praesent hendrerit
venenatis erat, eu malesuada nulla viverra eu. Curabitur porta risus augue,
non rutrum lectus hendrerit a.`;

let big = true;

document.querySelector('#expand').addEventListener('cc-button:click', () => {
  if (big) {
    document.querySelector('#expand-p').innerHTML = 'Foobar';
  }
  else {
    document.querySelector('#expand-p').innerHTML = lorem;
  }
  big = !big;
});
