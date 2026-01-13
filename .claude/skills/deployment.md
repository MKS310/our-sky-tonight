# Deployment Skill

## Purpose
Manage CI/CD pipeline, GitHub Actions workflow, build scripts, and deployment processes for "Our Sky Tonight".

## Scope
This skill focuses on the automation layer, ensuring reliable builds, deployments, and integration with external services.

---

## Responsibilities

### GitHub Actions Workflow
- Update workflow configuration in [.github/workflows/build.yml](../.github/workflows/build.yml)
- Modify build triggers and schedules
- Add or update workflow steps
- Manage workflow secrets and environment variables

### Build Process
- Maintain build script in [package.json](../package.json)
- Optimize build performance
- Handle build failures and errors
- Ensure reproducible builds

### Deployment
- Manage GitHub Pages deployment
- Update deployment branches (currently `gh-pages`)
- Handle deployment errors
- Monitor deployment status

### External Integrations
- Mastodon API notifications
- Future webhook integrations
- Third-party service connections

---

## Primary Files

### Workflow Configuration
- [.github/workflows/build.yml](../.github/workflows/build.yml) - GitHub Actions workflow

### Build Scripts
- [package.json](../package.json) - npm scripts and dependencies
- [index.js](../index.js) - Main build script

---

## Current GitHub Actions Workflow

### Workflow: "Build and Deploy to GitHub Pages"

**File**: [.github/workflows/build.yml](../.github/workflows/build.yml)

**Triggers**:
```yaml
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 7 * * 1-5'  # 7 AM UTC, weekdays
```

**Steps**:
1. **Checkout code**: Uses `actions/checkout@v4`
2. **Setup Node.js**: Uses `actions/setup-node@v4` (Node 20.x)
3. **Install dependencies**: `npm ci --omit=dev`
4. **Build site**: `npm run build`
5. **Deploy to GitHub Pages**: Uses `peaceiris/actions-gh-pages@v3`
6. **Notify Mastodon**: (If configured)

---

## Build Script

### npm Commands

**Install dependencies**:
```bash
npm ci --omit=dev
```
- Uses `package-lock.json` for reproducible builds
- Skips devDependencies (none in this project)

**Build site**:
```bash
npm run build
```
- Defined in [package.json](../package.json)
- Runs: `node index.js`
- Fetches RSS feeds and APIs
- Generates `dist/index.html`

---

## Common Tasks

### Task: Update Build Schedule
1. Read [.github/workflows/build.yml](../.github/workflows/build.yml)
2. Find `schedule` trigger with `cron` expression
3. Update cron schedule (uses UTC time):
   ```yaml
   schedule:
     - cron: '0 13 * * *'  # 1 PM UTC daily (8 AM EST)
   ```
4. Commit and push to main
5. Verify in Actions tab

**Cron Helper**: https://crontab.guru/

### Task: Add Build Step
1. Read [.github/workflows/build.yml](../.github/workflows/build.yml)
2. Add new step in `steps` array:
   ```yaml
   - name: Step description
     run: command to execute
   ```
3. Consider dependencies (runs sequentially)
4. Test workflow with push to main

### Task: Add Workflow Secret
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add secret name and value
4. Reference in workflow:
   ```yaml
   env:
     SECRET_NAME: ${{ secrets.SECRET_NAME }}
   ```

### Task: Update Node Version
1. Read [.github/workflows/build.yml](../.github/workflows/build.yml)
2. Find `actions/setup-node@v4` step
3. Update `node-version`:
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '22.x'
   ```
4. Test build locally with same Node version

### Task: Debug Build Failure
1. Go to GitHub repo → Actions tab
2. Click failed workflow run
3. Review logs for each step
4. Common issues:
   - Missing dependencies
   - API timeouts
   - Permission errors
   - Network failures
5. Fix issue and re-trigger build

---

## Deployment Configuration

### GitHub Pages Settings
- **Source branch**: `gh-pages`
- **Source folder**: `/` (root)
- **Deploy action**: `peaceiris/actions-gh-pages@v3`

### Deployment Options
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    publish_branch: gh-pages
```

**Key parameters**:
- `publish_dir`: Source folder to deploy (`./dist`)
- `publish_branch`: Target branch (`gh-pages`)
- `github_token`: Automatically provided by GitHub

---

## Mastodon Integration

### Current Implementation
Sends notification to Mastodon after successful build.

**Step** (if configured):
```yaml
- name: Notify Mastodon
  env:
    MASTODON_TOKEN: ${{ secrets.MASTODON_TOKEN }}
    MASTODON_URL: ${{ secrets.MASTODON_URL }}
  run: |
    if [ -n "$MASTODON_TOKEN" ]; then
      # Post update notification
      curl -X POST "$MASTODON_URL/api/v1/statuses" \
        -H "Authorization: Bearer $MASTODON_TOKEN" \
        -d "status=Our Sky Tonight has been updated! 🌌"
    fi
```

**Required Secrets**:
- `MASTODON_TOKEN`: API access token
- `MASTODON_URL`: Mastodon instance URL

---

## Workflow Best Practices

### Keep Builds Fast
- Use `npm ci` instead of `npm install` (faster, reproducible)
- Cache dependencies if build is slow
- Minimize API calls during build

### Handle Failures Gracefully
- Don't fail entire build if optional API fails
- Log errors for debugging
- Provide fallback data

### Security
- Never commit secrets to repository
- Use GitHub Secrets for sensitive data
- Limit token permissions (read-only when possible)

### Testing
- Test workflow changes in a branch first
- Use workflow dispatch for manual testing
- Monitor build logs regularly

---

## Troubleshooting

### Build Fails: "ENOENT: no such file or directory"
**Cause**: Missing file or directory

**Solution**: Ensure all required files exist, check file paths

---

### Build Fails: "API request failed"
**Cause**: External API timeout or error

**Solution**: Check error handling in [index.js](../index.js), ensure fallback data

---

### Deployment Fails: "Permission denied"
**Cause**: GitHub token lacks permissions

**Solution**: Check repository settings → Actions → General → Workflow permissions

---

### Build Timeout
**Cause**: Long-running API calls or network issues

**Solution**: Add timeout to workflow:
```yaml
timeout-minutes: 10
```

---

### Scheduled Build Doesn't Run
**Cause**: Repository inactive, workflow disabled

**Solution**:
- Ensure workflow is enabled (Actions tab)
- Scheduled workflows stop if repo inactive for 60 days
- Push a commit to re-enable

---

## Monitoring & Maintenance

### Check Build Status
1. Go to GitHub repo → Actions tab
2. View recent workflow runs
3. Green checkmark = success, red X = failure

### View Build Logs
1. Click on workflow run
2. Click on job name (e.g., "build")
3. Expand steps to see detailed logs

### Monitor Performance
- Track build duration over time
- Identify slow steps
- Optimize data fetching if needed

---

## Future Enhancements

### Potential Workflow Improvements
1. **Add caching**: Cache npm dependencies to speed up builds
   ```yaml
   - uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

2. **Multiple environments**: Separate staging and production deployments

3. **Automated testing**: Add test step before deployment

4. **Preview deployments**: Deploy PRs to preview URLs

5. **Notifications**: Send email/Slack/Discord notifications

6. **Performance checks**: Run Lighthouse audit on deployed site

---

## Workflow Triggers Reference

### Push Trigger
```yaml
on:
  push:
    branches: [ main ]
    paths:
      - '**.js'
      - '**.json'
```

### Pull Request Trigger
```yaml
on:
  pull_request:
    branches: [ main ]
```

### Schedule Trigger
```yaml
on:
  schedule:
    - cron: '0 7 * * 1-5'  # Weekdays at 7 AM UTC
```

### Manual Trigger
```yaml
on:
  workflow_dispatch:
```

### Multiple Triggers
```yaml
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 7 * * *'
  workflow_dispatch:
```

---

## Notes

- GitHub Actions minutes are free for public repositories
- Workflow runs have 6-hour timeout limit (configurable)
- Scheduled workflows may have slight delay (not exact cron)
- GitHub token permissions managed in repo settings
- Deployment happens automatically on successful build
- No manual deployment process needed
