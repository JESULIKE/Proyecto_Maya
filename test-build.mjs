import { readFileSync, writeFileSync } from 'fs';

const full = readFileSync('components/textbook/Module4Lectura.vue', 'utf8');
const scriptStart = full.indexOf('<script');
const script = full.substring(scriptStart);
const template = full.substring(0, full.indexOf('</template>') + 11);
const lines = template.split('\n');

// Find PRACTICE section start
const practiceIdx = lines.findIndex(l => l.includes('PRACTICE PHASE'));
console.log('Practice starts at line:', practiceIdx);

if (practiceIdx > 0) {
  // Take LEARN phase + close the outer div properly
  const learnOnly = lines.slice(0, practiceIdx).join('\n');
  // The learn section ends with </div> for the learn phase, then we need to close the outer div
  const learnWithClose = learnOnly + '\n  </div>\n</template>';
  writeFileSync('components/textbook/Module4Lectura.vue', learnWithClose + '\n\n' + script);
  console.log('Wrote LEARN-only version with proper closing');
}
