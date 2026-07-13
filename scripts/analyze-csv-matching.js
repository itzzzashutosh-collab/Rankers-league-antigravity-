import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const EXAM_DATA_DIR = 'D:\\Antigravite -Rankers league (7 july)\\Exam data';

function loadCsv(fileName) {
  const filePath = path.join(EXAM_DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${fileName}`);
    return [];
  }
  return parse(fs.readFileSync(filePath, 'utf-8'), { columns: true, skip_empty_lines: true, trim: true });
}

function normalize(str) {
  return str ? str.trim().toLowerCase().replace(/\s+/g, ' ') : '';
}

const exams = loadCsv('exams_rows.csv');
const subjects = loadCsv('subjects_rows.csv');
const chapters = loadCsv('chapters_rows.csv');
const topics = loadCsv('topics_rows.csv');

console.log('--- Trimming & Matching Analysis ---');
const examNames = new Set(exams.map(e => normalize(e.exam_name)));
console.log('Exams count:', examNames.size);

const unmatchedSubjects = subjects.filter(s => !examNames.has(normalize(s.exam_name)));
console.log('Unmatched subjects to exams:', unmatchedSubjects.length, 'of', subjects.length);
if (unmatchedSubjects.length > 0) {
  console.log('Example unmatched subject exam name:', unmatchedSubjects[0].exam_name);
}

const subjectKeys = new Set(subjects.map(s => `${normalize(s.exam_name)}|${normalize(s.subject_name)}`));
const unmatchedChapters = chapters.filter(c => !subjectKeys.has(`${normalize(c.exam_name)}|${normalize(c.subject_name)}`));
console.log('Unmatched chapters to subjects:', unmatchedChapters.length, 'of', chapters.length);
if (unmatchedChapters.length > 0) {
  console.log('Example unmatched chapter keys:', `${unmatchedChapters[0].exam_name}|${unmatchedChapters[0].subject_name}`);
}

const chapterKeys = new Set(chapters.map(c => `${normalize(c.exam_name)}|${normalize(c.subject_name)}|${normalize(c.chapter_name)}`));
const unmatchedTopics = topics.filter(t => !chapterKeys.has(`${normalize(t.exam_name)}|${normalize(t.subject_name)}|${normalize(t.chapter_name)}`));
console.log('Unmatched topics to chapters:', unmatchedTopics.length, 'of', topics.length);
if (unmatchedTopics.length > 0) {
  console.log('Example unmatched topic keys:', `${unmatchedTopics[0].exam_name}|${unmatchedTopics[0].subject_name}|${unmatchedTopics[0].chapter_name}`);
}
