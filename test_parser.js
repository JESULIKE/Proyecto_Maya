const fs = require('fs');
const { JSDOM } = require('jsdom');

const xml = `
<TEI xmlns="http://www.tei-c.org/ns/1.0">
        <ab xml:id="Fp3" type="glyph-block" n="[5006:[1500bv°??]].[??:??:??]">
          <seg corresp="#Fp3S3" xml:id="Fp3S1" type="glyph-group" rend="left_beside">
            <g ref="textgrid:3rb7k" corresp="#Fp3S2" xml:id="Fp3G1" rend="above" n="5006"></g>
            <seg corresp="#Fp3G1" xml:id="Fp3S2" type="glyph-group" rend="beneath">
              <g ref="textgrid:3rcg1" corresp="#Fp3G3" xml:id="Fp3G2" rend="encloses" n="1500bv"></g>
              <damage agent="environment" unit="g" quantity="1" degree="0.5">
                <g corresp="#Fp3G2" xml:id="Fp3G3" rend="infixed_in"></g>
              </damage>
            </seg>
          </seg>
          <seg corresp="#Fp3S1" xml:id="Fp3S3" type="glyph-group" rend="right_beside">
            <damage agent="environment" unit="g" quantity="1" degree="0.5">
              <g corresp="#Fp3G5" xml:id="Fp3G4" rend="above"></g>
            </damage>
            <damage agent="environment" unit="g" quantity="1" degree="0.5">
              <g corresp="#Fp3G6" xml:id="Fp3G5" rend="above"></g>
            </damage>
            <damage agent="environment" unit="g" quantity="1" degree="0.5">
              <g corresp="#Fp3G5" xml:id="Fp3G6" rend="beneath"></g>
            </damage>
          </seg>
        </ab>
</TEI>
`;

const doc = new JSDOM(xml, { contentType: "text/xml" }).window.document;
const node = doc.getElementsByTagNameNS('*', 'ab')[0];
let result = '';

const parseSegNode = (segNode) => {
  const glyphs = [];
  const gatherGlyphs = (n) => {
    for (const child of Array.from(n.children)) {
      const tag = child.tagName.toLowerCase();
      if (tag === 'damage' || tag === 'supplied') {
        gatherGlyphs(child);
      } else if (tag === 'gap') {
        glyphs.push({ code: '###', rend: child.getAttribute('rend') });
      } else if (tag === 'g') {
        let code = child.getAttribute('n') || '';
        if (code === '') code = '??';
        glyphs.push({ code, rend: child.getAttribute('rend') });
      } else if (tag === 'seg') {
        const segDSL = parseSegNode(child);
        glyphs.push({ code: segDSL, rend: child.getAttribute('rend') });
      }
    }
  };
  
  gatherGlyphs(segNode);

  if (glyphs.length === 0) return '';
  if (glyphs.length === 1) return glyphs[0].code;

  let r = '';
  glyphs.forEach(g => {
    const childDSL = g.code;
    if (r === '') r = childDSL;
    else {
      if (g.rend === 'above') r = `${r}^${childDSL}`;
      else if (g.rend === 'beneath') r = `${r}_${childDSL}`;
      else if (g.rend === 'infixed_in') r = `${r}<${childDSL}>`;
      else if (g.rend === 'encloses') r = `${r}+${childDSL}`;
      else if (g.rend === 'left_beside') r = `${childDSL}+${r}`;
      else r = `${r} + ${childDSL}`;
    }
  });

  const segRend = segNode.getAttribute('rend');
  if (segRend === 'above_beneath' || (glyphs[0].rend === 'above' && glyphs[1].rend === 'beneath')) {
    r = r.replace(/_/g, ' / ');
    r = r.replace(/\^/g, ' / '); 
  }
  return `[${r}]`;
};

const processChildren = (parent) => {
  const children = Array.from(parent.children);
  for (const child of children) {
    const tag = child.tagName.toLowerCase();
    
    if (tag === 'damage' || tag === 'supplied') {
      processChildren(child);
    } else if (tag === 'gap') {
      addToken('###', child.getAttribute('rend'));
    } else if (tag === 'g') {
      let childDSL = child.getAttribute('n') || '';
      if (childDSL === '') childDSL = '??';
      addToken(childDSL, child.getAttribute('rend'));
    } else if (tag === 'seg') {
      const segDSL = parseSegNode(child);
      addToken(segDSL, child.getAttribute('rend'));
    }
  }
};

const addToken = (childDSL, rend) => {
  if (!childDSL) return;
  if (result === '') result = childDSL;
  else {
    if (rend === 'above') result = `${result}^${childDSL}`;
    else if (rend === 'beneath') result = `${result}_${childDSL}`;
    else if (rend === 'infixed_in') result = `${result}<${childDSL}>`;
    else if (rend === 'encloses') result = `${result}+${childDSL}`;
    else if (rend === 'left_beside') result = `${childDSL}+${result}`;
    else result = `${result} + ${childDSL}`;
  }
};

processChildren(node);
console.log("FINAL RESULT:", result);
