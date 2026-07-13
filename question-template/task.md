# Tasks

- [x] Create `scripts/seed-latest-10x.js` pipeline
  - [x] Implement concepts load, merge, and deduplication
  - [x] Implement templates parse, filter, and content deduplication
  - [x] Implement multi-concept chapter-based lookup
  - [x] Generate 2 templates per level (total 10 templates) per concept
    - [x] Integrate multi-concept merging logic for Pro & Legend levels
  - [x] Implement parallel bulk uploads for hierarchy, concepts, and templates
- [x] Update `package.json` to configure npm script `seed:latest`
- [x] Run `npm run seed:latest` to seed the expanded template bank
- [x] Update `scripts/validate-templates.js` for 10x checks (minimum 2 templates per difficulty level)
- [x] Run validation script to verify 100% pass rate
- [x] Sync/copy files to `/question-template` directory
- [ ] Commit and push changes to GitHub
