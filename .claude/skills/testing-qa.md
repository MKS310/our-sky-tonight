# Testing & QA Skill

## Purpose
Ensure quality, reliability, and accessibility of "Our Sky Tonight" through systematic testing and validation.

## Scope
This skill focuses on verifying that all features work correctly across devices, browsers, and accessibility scenarios.

---

## Responsibilities

### Responsive Design Testing
- Test at multiple breakpoints (mobile, tablet, desktop)
- Verify touch targets are adequate (44x44px minimum)
- Check horizontal scrolling and overflow issues
- Ensure readable text sizes

### Functional Testing
- Test all links (internal and external)
- Verify data displays correctly
- Check image loading and gallery behavior
- Test error scenarios (API failures)

### Build & Deployment Testing
- Verify build process completes successfully
- Check GitHub Actions workflow status
- Validate deployed site on GitHub Pages
- Monitor build performance

### Accessibility Testing
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios
- Validate semantic HTML structure

### Cross-Browser Testing
- Test in Chrome/Edge
- Test in Safari (desktop and iOS)
- Test in Firefox
- Check mobile browsers

---

## Testing Tools

### Built-in Browser Tools
- **Chrome DevTools**: Responsive design mode, Lighthouse, Console
- **Firefox Developer Tools**: Accessibility inspector
- **Safari Developer Tools**: iOS simulator

### Online Tools
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **WAVE Accessibility Checker**: https://wave.webaim.org/
- **Google Lighthouse**: Built into Chrome DevTools
- **Can I Use**: https://caniuse.com/ (browser compatibility)

### Command-Line Tools
- `npm run build` - Test build process
- `ls -lh dist/index.html` - Check output file size

---

## Testing Procedures

### 1. Responsive Design Testing

**Breakpoints to Test**:
- **320px**: Smallest mobile (iPhone SE)
- **375px**: Standard mobile (iPhone 12/13)
- **768px**: Tablet (iPad portrait)
- **1024px**: Tablet landscape / small desktop
- **1920px**: Desktop

**How to Test**:
1. Open site in Chrome
2. Open DevTools (F12)
3. Click device toolbar icon (Ctrl+Shift+M)
4. Test each breakpoint
5. Rotate to landscape mode

**Checklist**:
- [ ] No horizontal scrolling (unless intentional, like gallery)
- [ ] Text is readable without zooming
- [ ] Images scale proportionally
- [ ] Buttons/links are easy to tap (44x44px minimum)
- [ ] Navigation is accessible
- [ ] Cards/sections stack properly on mobile
- [ ] Weather widget displays correctly (2 columns on mobile)

---

### 2. Build Process Testing

**How to Test**:
```bash
# Fresh build
npm ci --omit=dev
npm run build

# Check output
ls -lh dist/
cat dist/index.html | head -n 50
```

**Checklist**:
- [ ] Build completes without errors
- [ ] `dist/index.html` is generated
- [ ] File size is reasonable (<500KB for HTML)
- [ ] No console errors during build
- [ ] API calls succeed (or fallback gracefully)
- [ ] RSS feeds parse correctly
- [ ] Images copied to `dist/images/`

---

### 3. GitHub Actions Testing

**How to Test**:
1. Go to GitHub repo → Actions tab
2. Review latest workflow run
3. Check each step for errors
4. Verify deployment to GitHub Pages

**Checklist**:
- [ ] Workflow triggers correctly (push to main)
- [ ] All steps complete successfully (green checkmarks)
- [ ] Build step completes in reasonable time (<5 minutes)
- [ ] Deployment succeeds
- [ ] Site is live on GitHub Pages URL
- [ ] Scheduled builds run daily

---

### 4. Functional Testing

**Features to Test**:

**Weather Widget**:
- [ ] Displays 4 forecast periods
- [ ] Icons load correctly
- [ ] Temperature and conditions shown
- [ ] Wind speed/direction displayed
- [ ] Links to detailed forecast work

**Aurora Forecast**:
- [ ] NOAA image loads
- [ ] Links to space weather dashboards work

**Clear Sky Chart**:
- [ ] Chart image loads
- [ ] Link to full chart works

**Photo Gallery**:
- [ ] Images load
- [ ] Horizontal scroll works
- [ ] Images don't distort
- [ ] Lazy loading (if implemented)

**RSS Feeds**:
- [ ] Feed items display (up to 10 per feed)
- [ ] Links open in new tab
- [ ] Timestamps are formatted correctly
- [ ] Visited links styled differently

**Moon/Sun Links**:
- [ ] All external links work
- [ ] Links open in new tab with `rel="noopener"`

**Quote Section**:
- [ ] Daily quote displays
- [ ] Author attribution shown
- [ ] ZenQuotes link works

**APOD (if present)**:
- [ ] Image or video displays
- [ ] Title and explanation shown
- [ ] Link to APOD archive works

**Horoscopes**:
- [ ] All 12 signs display
- [ ] Cards are evenly sized
- [ ] Text is readable

---

### 5. Accessibility Testing

**Keyboard Navigation**:
1. Open site
2. Press Tab key repeatedly
3. Verify focus indicator is visible
4. Ensure logical tab order
5. Test Enter key on links

**Checklist**:
- [ ] Focus indicator is visible (outline or border)
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] All interactive elements are keyboard accessible
- [ ] No keyboard traps
- [ ] Skip to content link (optional but recommended)

**Screen Reader Testing**:
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate through page
3. Listen to announcements

**Checklist**:
- [ ] Page title is announced
- [ ] Headings are announced correctly (h1, h2, h3)
- [ ] Links have descriptive text (not "click here")
- [ ] Images have alt text
- [ ] Form inputs have labels (if any)

**Color Contrast**:
1. Go to https://webaim.org/resources/contrastchecker/
2. Test text and background color combinations
3. Ensure minimum 4.5:1 ratio (WCAG AA)

**Checklist**:
- [ ] Body text meets 4.5:1 contrast ratio
- [ ] Heading text meets 4.5:1 contrast ratio
- [ ] Link text meets 4.5:1 contrast ratio
- [ ] Link hover/focus state is visible

**Lighthouse Audit**:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Accessibility" category
4. Run audit
5. Review and fix issues

**Target Score**: 90+ (out of 100)

---

### 6. Cross-Browser Testing

**Browsers to Test**:
- Chrome (latest)
- Safari (latest)
- Firefox (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

**How to Test**:
1. Open site in each browser
2. Verify layout and functionality
3. Check for console errors
4. Test interactive features

**Checklist**:
- [ ] Site loads correctly
- [ ] Layout is consistent
- [ ] No console errors
- [ ] Images load
- [ ] Links work
- [ ] Responsive design works
- [ ] No browser-specific bugs

---

### 7. Performance Testing

**Metrics to Check**:
- HTML file size (<500KB)
- CSS file size (<100KB)
- Image sizes (optimized)
- Build time (<30 seconds)
- Page load time (<3 seconds)

**How to Test**:
1. Open Chrome DevTools → Network tab
2. Reload page
3. Check total page size
4. Review load times

**Lighthouse Performance Audit**:
1. Open Chrome DevTools → Lighthouse
2. Select "Performance" category
3. Run audit
4. Review suggestions

**Target Score**: 80+ (out of 100)

**Common Issues**:
- Large unoptimized images
- Too many API calls
- Render-blocking CSS/JS
- Missing caching headers

---

### 8. Error Scenario Testing

**Scenarios to Test**:

**API Failure**:
- Simulate by disabling network
- Verify fallback data displays
- Check for console errors

**RSS Feed Failure**:
- Test with invalid feed URL in [sources.json](../sources.json)
- Verify build doesn't crash
- Check empty feed handling

**Missing Images**:
- Remove image from gallery folder
- Verify no broken image icons
- Check for graceful degradation

**Checklist**:
- [ ] Build succeeds even if APIs fail
- [ ] Fallback data is displayed
- [ ] Errors are logged (not shown to user)
- [ ] No broken images or links
- [ ] User experience is still functional

---

## Testing Workflow

### For New Features
1. **Local testing**: Test on development machine
2. **Build test**: Run `npm run build`
3. **Responsive test**: Check multiple breakpoints
4. **Accessibility test**: Run Lighthouse audit
5. **Browser test**: Test in Chrome and Safari
6. **Deploy test**: Push to GitHub and verify deployment

### For Bug Fixes
1. **Reproduce bug**: Verify bug exists
2. **Fix bug**: Make code changes
3. **Verify fix**: Confirm bug is resolved
4. **Regression test**: Ensure fix doesn't break other features
5. **Deploy**: Push to production

### Regular Audits (Monthly)
- [ ] Run full Lighthouse audit
- [ ] Check for broken links
- [ ] Verify API integrations still work
- [ ] Review GitHub Actions logs
- [ ] Test in latest browsers
- [ ] Check site analytics (if enabled)

---

## Common Issues & Solutions

### Issue: Layout breaks on mobile
**Cause**: Fixed widths, missing media queries

**Solution**: Use flexible layouts, test at breakpoints

---

### Issue: Images don't load
**Cause**: Incorrect paths, missing files

**Solution**: Verify file paths, check dist/images/ folder

---

### Issue: RSS feed shows no items
**Cause**: Feed URL changed, feed malformed

**Solution**: Test feed URL in browser, check console for errors

---

### Issue: Build fails in GitHub Actions
**Cause**: Dependency issues, API timeout

**Solution**: Review Actions logs, check for errors

---

### Issue: Text is too small on mobile
**Cause**: Fixed font sizes, no mobile optimization

**Solution**: Use responsive font sizes (rem, em), test on device

---

### Issue: Lighthouse score is low
**Cause**: Unoptimized images, large files

**Solution**: Compress images, minimize CSS/JS

---

## Test Coverage Goals

### Must Have (100% Coverage)
- Build process works
- Site deploys correctly
- All links work
- Mobile layout is functional
- Accessibility: keyboard navigation
- Accessibility: color contrast

### Should Have (80% Coverage)
- Cross-browser testing
- Performance optimization
- Error scenario handling
- Screen reader compatibility

### Nice to Have (50% Coverage)
- Automated testing
- Load testing
- User acceptance testing
- Analytics review

---

## Documentation

### Bug Reports
When finding bugs, document:
1. **Description**: What's wrong?
2. **Steps to reproduce**: How to see the bug?
3. **Expected behavior**: What should happen?
4. **Actual behavior**: What actually happens?
5. **Environment**: Browser, device, OS
6. **Screenshots**: Visual proof

**Template**:
```
Bug: [Short description]

Steps:
1. Go to [URL]
2. Click [element]
3. See error

Expected: [What should happen]
Actual: [What actually happens]

Browser: Chrome 120
Device: iPhone 12
Screenshot: [attach]
```

---

### Test Reports
After testing, document results:
- Date of testing
- Features tested
- Issues found
- Pass/fail status
- Recommendations

---

## Automated Testing (Future)

### Potential Tools
- **Playwright**: Browser automation
- **Jest**: JavaScript unit tests
- **Pa11y**: Accessibility testing
- **Cypress**: End-to-end testing

### Not Implemented Yet
Automated testing is a future enhancement. For now, manual testing is sufficient for this small project.

---

## Notes

- Test early and often
- Focus on user experience
- Accessibility is not optional
- Mobile experience is critical (stargazers use phones)
- Real devices > simulators when possible
- Test in real-world conditions (dark environment for astronomy use)
- Keep tests simple and repeatable
