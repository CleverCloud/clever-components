import { css } from 'lit-element';

// NOTES:
// * This is undocumented and private for now
// * Users won't be able to override these without setting it on each custom elements (if and when they have access to them)

// language=CSS
export const defaultThemeStyles = css`
  :host {
    --cc-ff-monospace: "SourceCodePro", "monaco", monospace;
    
    /*region Color choices*/
    /* color choices - these should not be referenced inside components (use decisions below instead)
      tool used for grey shades: https://mdigi.tools/color-shades/#333333 (10 or 11 steps)    
    */
    --color-blue: #3569aa;
    --color-blue-dark: #012a51;
    --color-blue-highlight: #0061bd;
    --color-blue-light: #f1f5ff;
    --color-green: #098846;
    --color-green-light: #e3ffd6;
    --color-grey-100: #0d0d0d;
    --color-grey-90: #262626;
    --color-grey-80: #404040;
    --color-grey-70: #595959;
    --color-grey-60: #737373;
    --color-grey-50: #8c8c8c;
    --color-grey-40: #a6a6a6;
    --color-grey-30: #bfbfbf;
    --color-grey-20: #d9d9d9;
    --color-grey-15: #e7e7e7;
    --color-grey-10: #f5f5f5;
    /* do not use except inside cc-tile-instances*/
    --color-legacy-blue: #1ea2f1;
    /* do not use except inside cc-tile-instances*/
    --color-legacy-green: #2faa60;
    /* do not use except inside cc-tile-instances*/
    --color-legacy-red: #ff0032;
    --color-orange-light: #fff9cb;
    --color-orange: #c15807;
    --color-purple-light: #e0e0ff;
    --color-red: #be242d;
    --color-red-light: #ffe4e1;
    --color-white: #ffffff;
    --color-yellow: #e9e138;
    /*endregion*/
    
    /*region Color Decisions (text)*/
    /* Usage: Sensitive information that require attention.
    For instance: error messages */
    --color-text-danger: var(--color-red);

    /* Usage: regular text.
    -- Not used at the moment - will be when we allow theme override. -- */
    --color-text-default: var(--color-grey-90);
    
    /* Usage: Opposite of default text color - use this with plain backgrounds like primary / success / danger, etc.
    For instance: text inside primary cc-button. */
    --color-text-inverted: var(--color-white);
    
    /* Usage: text less important than normal text.
    For instance: sidenotes, the required mention inside forms. */
    --color-text-light: var(--color-grey-80);
    
    /* Usage: info, main color used through the application.
    For instance: text color inside outlined primary cc-button. */
    --color-text-primary: var(--color-blue);
    
    /* Usage: information that need to stand out a little bit more than the rest of the text.
    For instance: links. */
    --color-text-primary-highlight: var(--color-blue-highlight);

    /* Usage: Very contrasted text but not black and not default text color.
    For instance: headings. */
    --color-text-strong: var(--color-blue-dark);

    /* Usage: bold text that needs to stand out from normal / light variants.
    For instance: text inside <strong> tags. */
    --color-text-strongest: var(--color-grey-100);
    
    /* Usage: success or valid feedback.
    For instance: text saying an app is running correctly */
    --color-text-success: var(--color-green);

    /* Usage: cautionnary text.
    For instance: text saying an app is stopped. */
    --color-text-warning: var(--color-orange);
    /*endregion*/

    /*region Color Decisions (background)*/
    /* Usage: Usually interactive, used for sensitive actions.
    -- Use this with --color-text-inverted --
    For instance: delete / remove buttons. */
    --color-bg-danger: var(--color-red);

    /* Usage: default background color
    -- Not used at the moment - will be when we allow theme override. -- */
    --color-bg-default: var(--color-white);

    /* Usage: neutral background that stands out a little bit from the default one.
    For instance: blocks, cards, table rows. */
    --color-bg-neutral: var(--color-grey-10);

    /* Usage: another shade neutral background that stands out a little bit from the default background and neutral one.
    For instance: blocks, cards, table rows. */
    --color-bg-neutral-alt: var(--color-grey-15);
    
    /* Usage: element with a neutral background with active status.
    For instance: When being clicked, + / - button backgrounds inside cc-input-text */
    --color-bg-neutral-active: var(--color-grey-20);

    /* Usage: element with neutral background is disabled.
    For instance: disabled text / number input */
    --color-bg-neutral-disabled: var(--color-grey-15);
    
    /* Usage: element with a neutral background is hovered.
    For instance: Card or table row being hovered. */
    --color-bg-neutral-hovered: var(--color-grey-15);

    /* Usage: element with a neutral background is hovered.
    For instance: Card or table row being hovered. */
    --color-bg-neutral-readonly: var(--color-grey-10);

    /* Usage: Usually interactive, used to trigger basic actions that are not submit, delete, reset, etc.
    -- Use this with --color-text-inverted --
    For instance: Modal opening button, add an element without refreshing the page. */
    --color-bg-primary: var(--color-blue);

    /* Usage: notice ? */
    --color-bg-primary-light: var(--color-blue-light);

    /* Usage: content that needs to stand out a little more than primary content.
    For instance: some icons. */
    --color-bg-primary-highlight: var(--color-blue-highlight);
    
    /* Usage: content that needs a plain but very soft background.
    For instance: tags, pieces of text that need to stand out but not too much */
    --color-bg-soft: var(--color-purple-light);
    
    /* Usage: header background when something needs to stand out
    -- Use this with --color-text-inverted -- 
    For instance: table header, ribbon. */
    --color-bg-strong: var(--color-blue-dark);

    /* Usage: Usually interactive, used to trigger submit forms / data, validate something.
    -- Use this with --color-text-inverted --
    For instance: submit buttons */
    --color-bg-success: var(--color-green);
    
    /* Usage: elements containing short texts with a "caution" / "warning" meaning and usually interactive.
    For instance: ? */
    --color-bg-warning: var(--color-orange);

    /* Usage: elements containing texts with a "caution" / "warning" meaning with text in --color-text-default */
    --color-bg-warning-light: var(--color-orange-light);
    /*endregion*/

    /*region Color Decisions(border)*/
    /* Usage: with default background for an "outlined" style or warning background for "plain" style" ? */
    --border-warning: 1px solid var(--color-yellow);
    /*endregion*/
      
    /*region Margin Decisions*/
    /* Usage: 
    *   - in an horizontal form
    *   - use flex and align-items: start; on the form
    *   - use margin-top: var(--margin-top-btn-horizontal-form); on the <cc-button> element so that it aligns 
    *   horizontally even when error / help messages are displayed. 
    *  See the All Controls Story - Horizontal form section
    *  
    *  The 1.6em value comes from the label line-height (1.25em) and bottom padding (0.35em)
    */
    --margin-top-btn-horizontal-form: 1.6em;
    /*endregion*/
  }
`;
