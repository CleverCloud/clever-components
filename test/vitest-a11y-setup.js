// Import default theme styles for consistent rendering
import '../src/styles/default-theme.css';

// Set up chai-a11y-axe for accessibility testing (runs axe directly in browser)
import chai from 'chai';
import { chaiA11yAxe } from 'chai-a11y-axe';

chai.use(chaiA11yAxe);
