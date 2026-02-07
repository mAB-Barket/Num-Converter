/**
 * SEO Page Generator for NumConvert
 * Generates 12 dedicated conversion landing pages, each targeting specific search queries.
 * Run: node generate-seo-pages.js
 */
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mab-barket.github.io/Num-Converter';

const conversions = [
  {
    slug: 'bin-to-dec',
    from: 'Binary', to: 'Decimal',
    fromBase: 2, toBase: 10,
    fromShort: 'BIN', toShort: 'DEC',
    title: 'Binary to Decimal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert binary numbers to decimal instantly with this free online tool. Enter any binary value and get the decimal equivalent in real time. Step-by-step explanation included.',
    howToIntro: 'Binary (base 2) uses only the digits 0 and 1. Each position represents an increasing power of 2. To convert binary to decimal, you multiply each bit by its corresponding power of 2 and add the results together.',
    steps: [
      'Write down the binary number.',
      'Label each bit with its position power, starting from 0 on the right.',
      'Multiply each bit (0 or 1) by 2 raised to its position.',
      'Sum all the products to obtain the decimal value.'
    ],
    example: 'For binary <code>1011</code>: (1\u00d72\u00b3) + (0\u00d72\u00b2) + (1\u00d72\u00b9) + (1\u00d72\u2070) = 8 + 0 + 2 + 1 = <strong>11</strong> in decimal.',
    tableData: [
      ['1', '1'], ['1010', '10'], ['11001', '25'], ['1100100', '100'], ['11111111', '255'], ['10000000000', '1024']
    ],
    faqs: [
      { q: 'What is binary?', a: 'Binary is the base-2 numeral system used internally by virtually all modern computers. It uses only two symbols: 0 and 1, called bits. Each bit position represents a power of 2.' },
      { q: 'How do I convert large binary numbers to decimal?', a: 'The process is the same regardless of size. Assign positional powers of 2 from right to left (2\u2070, 2\u00b9, 2\u00b2, \u2026), multiply each bit, and sum the results. For very large numbers, an online converter like this one saves time and avoids errors.' },
      { q: 'Why do computers use binary instead of decimal?', a: 'Digital circuits have two voltage states (high/low), making binary a natural fit. Each circuit can represent one bit. Decimal would require hardware distinguishing 10 different states, which is far more prone to error.' }
    ]
  },
  {
    slug: 'bin-to-oct',
    from: 'Binary', to: 'Octal',
    fromBase: 2, toBase: 8,
    fromShort: 'BIN', toShort: 'OCT',
    title: 'Binary to Octal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert binary numbers to octal instantly. Group binary digits into sets of three and get the octal equivalent in real time with step-by-step explanation.',
    howToIntro: 'Because 8 is a power of 2 (8 = 2\u00b3), converting binary to octal is straightforward: group the bits in sets of three from right to left, then map each group to its octal digit.',
    steps: [
      'Starting from the right, group the binary digits into sets of 3.',
      'Pad the leftmost group with leading zeros if needed to make a full group of 3.',
      'Convert each 3-bit group to its octal digit (000=0, 001=1, 010=2, 011=3, 100=4, 101=5, 110=6, 111=7).',
      'Concatenate the octal digits for the final result.'
    ],
    example: 'For binary <code>110101</code>: group as <code>110 101</code> \u2192 6 and 5 \u2192 octal <strong>65</strong>.',
    tableData: [
      ['1', '1'], ['1010', '12'], ['110101', '65'], ['1100100', '144'], ['11111111', '377'], ['10000000000', '2000']
    ],
    faqs: [
      { q: 'Why group binary bits in threes for octal?', a: 'Octal is base 8, and 8 = 2\u00b3. Each octal digit maps perfectly to exactly 3 binary bits, making the conversion a simple grouping exercise without any arithmetic.' },
      { q: 'What is octal used for?', a: 'Octal is commonly used in Unix/Linux file permissions (e.g., chmod 755), older computing systems, and some programming contexts as a compact representation of binary data.' },
      { q: 'What if the number of binary digits is not divisible by 3?', a: 'Pad the leftmost group with leading zeros. For example, binary 10110 becomes 010 110, which converts to octal 26.' }
    ]
  },
  {
    slug: 'bin-to-hex',
    from: 'Binary', to: 'Hexadecimal',
    fromBase: 2, toBase: 16,
    fromShort: 'BIN', toShort: 'HEX',
    title: 'Binary to Hexadecimal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert binary to hexadecimal instantly. Group binary digits into sets of four and get the hex result in real time. Free online tool with step-by-step guide.',
    howToIntro: 'Hexadecimal (base 16) is widely used in programming and web development. Since 16 = 2\u2074, each hex digit maps to exactly 4 binary bits, making binary-to-hex conversion fast and direct.',
    steps: [
      'Starting from the right, group the binary digits into sets of 4.',
      'Pad the leftmost group with zeros if needed.',
      'Convert each 4-bit group using: 0000=0, 0001=1, \u2026, 1001=9, 1010=A, 1011=B, 1100=C, 1101=D, 1110=E, 1111=F.',
      'Concatenate the hex digits for the final result.'
    ],
    example: 'For binary <code>11010110</code>: group as <code>1101 0110</code> \u2192 D and 6 \u2192 hexadecimal <strong>D6</strong>.',
    tableData: [
      ['1', '1'], ['1010', 'A'], ['11001', '19'], ['1100100', '64'], ['11111111', 'FF'], ['10000000000', '400']
    ],
    faqs: [
      { q: 'Why is hexadecimal popular in programming?', a: 'Hex provides a compact, human-readable way to represent binary data. One hex digit replaces 4 binary bits, so a byte (8 bits) is just 2 hex characters. It is used for memory addresses, color codes (#FF5733), and debugging.' },
      { q: 'What do the letters A\u2013F mean in hexadecimal?', a: 'Hex needs 16 symbols. After 0\u20139, it uses A=10, B=11, C=12, D=13, E=14, F=15. Upper and lower case are interchangeable.' },
      { q: 'How many binary digits fit in one hex digit?', a: 'Exactly 4 binary digits (bits). This clean mapping is why hex is the preferred shorthand for binary data in computing.' }
    ]
  },
  {
    slug: 'dec-to-bin',
    from: 'Decimal', to: 'Binary',
    fromBase: 10, toBase: 2,
    fromShort: 'DEC', toShort: 'BIN',
    title: 'Decimal to Binary Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert decimal numbers to binary instantly. Enter any decimal value and get the binary representation in real time with a step-by-step division method explained.',
    howToIntro: 'Decimal (base 10) is the standard number system for everyday counting. Converting to binary involves repeatedly dividing by 2 and collecting the remainders, which form the binary digits in reverse order.',
    steps: [
      'Divide the decimal number by 2.',
      'Record the remainder (0 or 1).',
      'Replace the number with the quotient (result of the division).',
      'Repeat until the quotient is 0.',
      'Read the remainders from bottom to top \u2014 that\u2019s the binary number.'
    ],
    example: 'For decimal <code>25</code>: 25\u00f72=12 r<strong>1</strong>, 12\u00f72=6 r<strong>0</strong>, 6\u00f72=3 r<strong>0</strong>, 3\u00f72=1 r<strong>1</strong>, 1\u00f72=0 r<strong>1</strong>. Reading remainders upward: <strong>11001</strong>.',
    tableData: [
      ['1', '1'], ['10', '1010'], ['25', '11001'], ['42', '101010'], ['100', '1100100'], ['255', '11111111']
    ],
    faqs: [
      { q: 'What is the division-by-2 method?', a: 'It is the standard algorithm for decimal-to-binary conversion. You divide the number by 2 repeatedly, collect each remainder, and read them in reverse order to get the binary equivalent.' },
      { q: 'How do I convert 0 in decimal to binary?', a: 'Decimal 0 is simply 0 in binary. No division steps are needed.' },
      { q: 'Is there a shortcut for powers of 2?', a: 'Yes! Powers of 2 (1, 2, 4, 8, 16, 32, \u2026) are always a 1 followed by zeros in binary. For example, 16 in decimal is 10000 in binary (1 followed by four zeros, since 16 = 2\u2074).' }
    ]
  },
  {
    slug: 'dec-to-oct',
    from: 'Decimal', to: 'Octal',
    fromBase: 10, toBase: 8,
    fromShort: 'DEC', toShort: 'OCT',
    title: 'Decimal to Octal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert decimal numbers to octal easily. Enter a decimal value and get the octal equivalent instantly. Step-by-step division-by-8 method explained.',
    howToIntro: 'Octal (base 8) uses digits 0 through 7. To convert a decimal number to octal, repeatedly divide by 8 and collect the remainders, then read them in reverse order.',
    steps: [
      'Divide the decimal number by 8.',
      'Record the remainder (a digit 0\u20137).',
      'Replace the number with the quotient.',
      'Repeat until the quotient is 0.',
      'Read the remainders from bottom to top for the octal result.'
    ],
    example: 'For decimal <code>156</code>: 156\u00f78=19 r<strong>4</strong>, 19\u00f78=2 r<strong>3</strong>, 2\u00f78=0 r<strong>2</strong>. Reading upward: octal <strong>234</strong>.',
    tableData: [
      ['1', '1'], ['8', '10'], ['10', '12'], ['42', '52'], ['100', '144'], ['255', '377']
    ],
    faqs: [
      { q: 'Why would I need octal numbers?', a: 'Octal is primarily used in computing for Unix/Linux file permissions (e.g., 755, 644). It also appears in older programming languages and some digital electronics contexts.' },
      { q: 'How is octal related to binary?', a: 'Each octal digit maps to exactly 3 binary bits (since 8 = 2\u00b3). This makes octal a convenient shorthand for binary, though hexadecimal (4 bits per digit) is more commonly used today.' },
      { q: 'What is the largest single octal digit?', a: 'The digit 7, which represents 111 in binary. Octal uses digits 0 through 7 exclusively.' }
    ]
  },
  {
    slug: 'dec-to-hex',
    from: 'Decimal', to: 'Hexadecimal',
    fromBase: 10, toBase: 16,
    fromShort: 'DEC', toShort: 'HEX',
    title: 'Decimal to Hexadecimal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert decimal to hexadecimal instantly. Enter any decimal number and get the hex value in real time. Complete guide with examples and division-by-16 method.',
    howToIntro: 'Hexadecimal (base 16) uses digits 0\u20139 and letters A\u2013F (representing 10\u201315). To convert decimal to hex, divide by 16 repeatedly and collect the remainders, mapping those \u2265 10 to their letter equivalents.',
    steps: [
      'Divide the decimal number by 16.',
      'Record the remainder. If it is 10\u201315, write A\u2013F respectively.',
      'Replace the number with the quotient.',
      'Repeat until the quotient is 0.',
      'Read the remainders from bottom to top to form the hex number.'
    ],
    example: 'For decimal <code>255</code>: 255\u00f716=15 r<strong>15(F)</strong>, 15\u00f716=0 r<strong>15(F)</strong>. Reading upward: hexadecimal <strong>FF</strong>.',
    tableData: [
      ['1', '1'], ['10', 'A'], ['42', '2A'], ['100', '64'], ['255', 'FF'], ['1024', '400']
    ],
    faqs: [
      { q: 'Where is hexadecimal used in everyday computing?', a: 'Hex is used extensively in web development for colors (#FF5733), in memory addresses, MAC addresses, error codes, Unicode characters (U+0041), and low-level programming and debugging.' },
      { q: 'Why are letters used in hexadecimal?', a: 'Base 16 requires 16 unique symbols. Digits 0\u20139 provide ten, so letters A\u2013F supply the remaining six, representing values 10 through 15.' },
      { q: 'How do CSS hex color codes work?', a: 'CSS colors like #FF5733 are three hex byte values: FF (red=255), 57 (green=87), 33 (blue=51). Each pair converts to a decimal 0\u2013255 for the RGB color channel.' }
    ]
  },
  {
    slug: 'oct-to-bin',
    from: 'Octal', to: 'Binary',
    fromBase: 8, toBase: 2,
    fromShort: 'OCT', toShort: 'BIN',
    title: 'Octal to Binary Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert octal numbers to binary instantly. Each octal digit maps directly to 3 binary bits. Free online tool with real-time results and step-by-step explanation.',
    howToIntro: 'Since octal is base 8 and 8 = 2\u00b3, every octal digit translates directly into a 3-bit binary group. This makes octal-to-binary conversion one of the simplest base conversions.',
    steps: [
      'Take each octal digit individually.',
      'Convert each digit to its 3-bit binary equivalent (0=000, 1=001, 2=010, 3=011, 4=100, 5=101, 6=110, 7=111).',
      'Concatenate all 3-bit groups from left to right.',
      'Remove leading zeros from the result if desired.'
    ],
    example: 'For octal <code>752</code>: 7=<code>111</code>, 5=<code>101</code>, 2=<code>010</code> \u2192 binary <strong>111101010</strong>.',
    tableData: [
      ['1', '1'], ['7', '111'], ['12', '1010'], ['77', '111111'], ['377', '11111111'], ['2000', '10000000000']
    ],
    faqs: [
      { q: 'Why does each octal digit equal exactly 3 binary bits?', a: 'Because 2\u00b3 = 8. Three binary bits can represent values 0\u20137, which are exactly the digits used in octal. This mathematical relationship creates a perfect 1-to-3 mapping.' },
      { q: 'Can I convert octal to binary without a calculator?', a: 'Absolutely. It is one of the easiest base conversions to do by hand. Just memorize the eight 3-bit patterns (000 through 111) and substitute each octal digit.' },
      { q: 'What if my octal number contains the digit 8 or 9?', a: 'Digits 8 and 9 do not exist in octal (base 8). If you see them, the number is not valid octal. Check your input for errors.' }
    ]
  },
  {
    slug: 'oct-to-dec',
    from: 'Octal', to: 'Decimal',
    fromBase: 8, toBase: 10,
    fromShort: 'OCT', toShort: 'DEC',
    title: 'Octal to Decimal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert octal to decimal instantly. Enter an octal number and get the decimal equivalent with real-time results. Includes positional value method explanation.',
    howToIntro: 'Octal (base 8) uses digits 0\u20137. To convert to decimal, multiply each digit by 8 raised to its positional power (starting from 0 on the right), then sum all the products.',
    steps: [
      'Write down the octal number.',
      'Assign positional powers of 8, starting with 8\u2070 on the rightmost digit.',
      'Multiply each digit by its corresponding power of 8.',
      'Add all the products together to get the decimal value.'
    ],
    example: 'For octal <code>347</code>: (3\u00d78\u00b2) + (4\u00d78\u00b9) + (7\u00d78\u2070) = 192 + 32 + 7 = decimal <strong>231</strong>.',
    tableData: [
      ['1', '1'], ['7', '7'], ['10', '8'], ['12', '10'], ['77', '63'], ['377', '255']
    ],
    faqs: [
      { q: 'What is positional notation?', a: 'In positional notation, the value of a digit depends on its position. In octal, the rightmost digit has a weight of 8\u2070=1, the next 8\u00b9=8, then 8\u00b2=64, and so on. Each position is 8 times the previous.' },
      { q: 'How do Unix file permissions relate to octal?', a: 'Unix permissions use three octal digits: owner, group, others. Each digit (0\u20137) encodes read (4), write (2), and execute (1) permissions. For example, 755 means owner has all permissions (7=4+2+1) while group and others have read+execute (5=4+1).' },
      { q: 'Is octal still relevant today?', a: 'While less common than hex, octal remains important in Unix/Linux systems for file permissions and in some legacy systems. It also appears in programming languages (e.g., 0o17 in Python, 017 in C).' }
    ]
  },
  {
    slug: 'oct-to-hex',
    from: 'Octal', to: 'Hexadecimal',
    fromBase: 8, toBase: 16,
    fromShort: 'OCT', toShort: 'HEX',
    title: 'Octal to Hexadecimal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert octal to hexadecimal instantly. Free online converter that bridges octal and hex via binary. Real-time results with step-by-step method explained.',
    howToIntro: 'There is no direct digit-to-digit mapping between octal and hexadecimal because 8 is not a power of 16 (nor vice versa). The standard method uses binary as an intermediate step: convert octal to binary (3 bits per digit), then convert binary to hex (4 bits per digit).',
    steps: [
      'Convert each octal digit to its 3-bit binary representation.',
      'Concatenate all binary groups.',
      'Re-group the binary digits into sets of 4, starting from the right.',
      'Pad the leftmost group with zeros if needed.',
      'Convert each 4-bit group to its hex digit.',
      'Concatenate for the hex result.'
    ],
    example: 'For octal <code>755</code>: 7=<code>111</code>, 5=<code>101</code>, 5=<code>101</code> \u2192 <code>111101101</code> \u2192 regroup: <code>0001 1110 1101</code> \u2192 hex <strong>1ED</strong>.',
    tableData: [
      ['1', '1'], ['7', '7'], ['12', 'A'], ['77', '3F'], ['377', 'FF'], ['2000', '400']
    ],
    faqs: [
      { q: 'Why does octal-to-hex conversion go through binary?', a: 'Octal and hex do not share a direct power-of-base relationship. Binary is the common link: octal groups into 3 bits, hex into 4 bits. Going through binary makes the conversion systematic and error-free.' },
      { q: 'Can I convert octal directly to hex without binary?', a: 'You could convert octal to decimal first, then decimal to hex, but the binary intermediate method is faster and less error-prone. Most professionals prefer the binary bridge approach.' },
      { q: 'When would I need to convert octal to hex?', a: 'When working with Unix systems (octal permissions) and need to express the same values in hex for debugging, memory inspection, or low-level programming contexts.' }
    ]
  },
  {
    slug: 'hex-to-bin',
    from: 'Hexadecimal', to: 'Binary',
    fromBase: 16, toBase: 2,
    fromShort: 'HEX', toShort: 'BIN',
    title: 'Hexadecimal to Binary Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert hexadecimal to binary instantly. Each hex digit maps to 4 binary bits. Free online tool with real-time results and complete step-by-step guide.',
    howToIntro: 'Hexadecimal (base 16) and binary (base 2) have a natural relationship: 16 = 2\u2074, so each hex digit maps perfectly to a group of 4 binary bits. This makes hex-to-binary one of the easiest conversions.',
    steps: [
      'Take each hexadecimal digit individually.',
      'Convert each digit to its 4-bit binary equivalent (0=0000, 1=0001, \u2026, 9=1001, A=1010, B=1011, C=1100, D=1101, E=1110, F=1111).',
      'Concatenate all 4-bit groups from left to right.',
      'Remove leading zeros if desired.'
    ],
    example: 'For hex <code>2F</code>: 2=<code>0010</code>, F=<code>1111</code> \u2192 binary <strong>00101111</strong> (or <strong>101111</strong>).',
    tableData: [
      ['1', '1'], ['A', '1010'], ['2A', '101010'], ['64', '1100100'], ['FF', '11111111'], ['400', '10000000000']
    ],
    faqs: [
      { q: 'Why does each hex digit equal 4 binary bits?', a: 'Because 2\u2074 = 16. Four binary bits can hold values from 0000 (0) to 1111 (15), covering all 16 hex digits exactly. This perfect mapping makes hex the preferred shorthand for binary.' },
      { q: 'How do I memorize the hex-to-binary mappings?', a: 'Start with 0\u20139 (regular counting in 4-bit binary). Then remember A=1010, B=1011, C=1100, D=1101, E=1110, F=1111. The letters continue the count from 10 to 15.' },
      { q: 'Is hex-to-binary conversion lossless?', a: 'Yes, completely. Each hex digit has a unique 4-bit pattern. Converting back and forth between hex and binary yields the exact same values every time.' }
    ]
  },
  {
    slug: 'hex-to-dec',
    from: 'Hexadecimal', to: 'Decimal',
    fromBase: 16, toBase: 10,
    fromShort: 'HEX', toShort: 'DEC',
    title: 'Hexadecimal to Decimal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert hexadecimal to decimal instantly. Enter any hex value (with A\u2013F) and get the decimal number in real time. Free online tool with full step-by-step guide.',
    howToIntro: 'Hexadecimal uses 16 symbols: 0\u20139 for values zero through nine, and A\u2013F for values ten through fifteen. To convert to decimal, multiply each digit by 16 raised to its positional power and sum the results.',
    steps: [
      'Write down the hex number.',
      'Assign positional powers of 16, starting with 16\u2070 on the rightmost digit.',
      'Convert any letters to their numeric values: A=10, B=11, C=12, D=13, E=14, F=15.',
      'Multiply each digit\u2019s value by its corresponding power of 16.',
      'Add all the products together for the decimal result.'
    ],
    example: 'For hex <code>1A3</code>: (1\u00d716\u00b2) + (10\u00d716\u00b9) + (3\u00d716\u2070) = 256 + 160 + 3 = decimal <strong>419</strong>.',
    tableData: [
      ['1', '1'], ['A', '10'], ['2A', '42'], ['64', '100'], ['FF', '255'], ['400', '1024']
    ],
    faqs: [
      { q: 'How do I handle letters (A\u2013F) in the conversion?', a: 'Simply replace each letter with its decimal equivalent: A=10, B=11, C=12, D=13, E=14, F=15. Then proceed with positional multiplication by powers of 16 as normal.' },
      { q: 'Are uppercase and lowercase hex digits different?', a: 'No. In hexadecimal, A and a both equal 10, FF and ff are both 255. Case does not affect the value, though uppercase is more common in formal notation.' },
      { q: 'Why is hex FF equal to decimal 255?', a: 'FF = (15\u00d716) + (15\u00d71) = 240 + 15 = 255. This is the largest value representable with two hex digits, and it equals one byte (8 bits) fully set to 1 in binary (11111111).' }
    ]
  },
  {
    slug: 'hex-to-oct',
    from: 'Hexadecimal', to: 'Octal',
    fromBase: 16, toBase: 8,
    fromShort: 'HEX', toShort: 'OCT',
    title: 'Hexadecimal to Octal Converter \u2013 Free Online Tool | NumConvert',
    description: 'Convert hexadecimal to octal instantly. Free online converter that bridges hex and octal via binary. Real-time results with step-by-step method explained.',
    howToIntro: 'Hexadecimal and octal don\u2019t share a direct digit-to-digit relationship. The most efficient method uses binary as a bridge: convert each hex digit to 4 binary bits, then re-group into 3-bit octal groups.',
    steps: [
      'Convert each hex digit to its 4-bit binary equivalent.',
      'Concatenate all the binary groups.',
      'Re-group the binary string into sets of 3 bits, starting from the right.',
      'Pad the leftmost group with zeros if needed.',
      'Convert each 3-bit group to its octal digit (0\u20137).',
      'Concatenate for the final octal result.'
    ],
    example: 'For hex <code>FF</code>: F=<code>1111</code>, F=<code>1111</code> \u2192 <code>11111111</code> \u2192 regroup: <code>011 111 111</code> \u2192 octal <strong>377</strong>.',
    tableData: [
      ['1', '1'], ['A', '12'], ['2A', '52'], ['64', '144'], ['FF', '377'], ['400', '2000']
    ],
    faqs: [
      { q: 'Why use binary as an intermediate step?', a: 'Hex (base 16 = 2\u2074) and octal (base 8 = 2\u00b3) both have a clean relationship with binary but not with each other. Binary serves as the common language between them, making the conversion systematic and accurate.' },
      { q: 'Can I convert hex to octal through decimal instead?', a: 'Yes, but the binary bridge method is typically faster for manual calculation. Converting through decimal involves multiplication and division, while the binary method is just pattern replacement and regrouping.' },
      { q: 'What is the hex equivalent of octal 777?', a: 'Octal 777 = binary 111 111 111 = regroup as 0001 1111 1111 = hex 1FF. This is decimal 511. In Unix, this represents full permissions for all users.' }
    ]
  }
];

// ─── HTML Template ──────────────────────────────────────────────
function generatePage(conv) {
  const otherConverters = conversions
    .filter(c => c.slug !== conv.slug)
    .map(c => `        <a href="${c.slug}.html" class="all-converters__link">${c.from} to ${c.to}</a>`)
    .join('\n');

  const tableRows = conv.tableData
    .map(([from, to]) => `            <tr><td>${from}</td><td>${to}</td></tr>`)
    .join('\n');

  const faqJsonLd = conv.faqs.map(f => `    {
      "@type": "Question",
      "name": "${f.q}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "${f.a.replace(/"/g, '\\"')}"
      }
    }`).join(',\n');

  const stepsHtml = conv.steps.map((s, i) => `            <li>${s}</li>`).join('\n');

  const faqHtml = conv.faqs.map(f => `          <div class="faq-item">
            <h4 class="faq-item__q">${f.q}</h4>
            <p class="faq-item__a">${f.a}</p>
          </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${conv.title}</title>
  <meta name="description" content="${conv.description}" />
  <meta name="keywords" content="${conv.from.toLowerCase()} to ${conv.to.toLowerCase()}, ${conv.from.toLowerCase()} to ${conv.to.toLowerCase()} converter, convert ${conv.from.toLowerCase()} to ${conv.to.toLowerCase()}, ${conv.from.toLowerCase()} ${conv.to.toLowerCase()} conversion, base ${conv.fromBase} to base ${conv.toBase}" />
  <link rel="canonical" href="${BASE_URL}/${conv.slug}.html" />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="mAB-Barket" />
  <meta name="theme-color" content="#0071e3" />
  <link rel="icon" type="image/svg+xml" href="favicon.svg" />

  <!-- Open Graph -->
  <meta property="og:title" content="${conv.from} to ${conv.to} Converter \u2013 Free Online Tool" />
  <meta property="og:description" content="${conv.description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${BASE_URL}/${conv.slug}.html" />
  <meta property="og:site_name" content="NumConvert" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${conv.from} to ${conv.to} Converter \u2013 Free Online Tool" />
  <meta name="twitter:description" content="${conv.description}" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />

  <!-- JSON-LD: WebApplication -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "${conv.from} to ${conv.to} Converter \u2013 NumConvert",
    "description": "${conv.description}",
    "url": "${BASE_URL}/${conv.slug}.html",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "mAB-Barket"
    }
  }
  </script>

  <!-- JSON-LD: FAQPage -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
${faqJsonLd}
    ]
  }
  </script>

  <!-- JSON-LD: BreadcrumbList -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "NumConvert",
        "item": "${BASE_URL}/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "${conv.from} to ${conv.to} Converter",
        "item": "${BASE_URL}/${conv.slug}.html"
      }
    ]
  }
  </script>
</head>
<body>
  <!-- ====== HEADER ====== -->
  <header class="header">
    <div class="header__inner">
      <a href="index.html" class="logo" aria-label="NumConvert Home">
        <svg class="logo__icon" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
          <line x1="12" y1="2" x2="12" y2="22" opacity=".4"></line>
        </svg>
        <span class="logo__text">NumConvert</span>
      </a>
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <svg class="theme-toggle__sun" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg class="theme-toggle__moon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>
    </div>
  </header>

  <!-- ====== MAIN ====== -->
  <main class="main">
    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="index.html">Home</a>
      <span class="breadcrumb__sep">/</span>
      <span>${conv.from} to ${conv.to}</span>
    </nav>

    <!-- Converter Card -->
    <section class="converter-card" aria-label="${conv.from} to ${conv.to} converter">
      <h1 class="converter-card__title">${conv.from} to ${conv.to} Converter</h1>
      <p class="converter-card__subtitle">Convert ${conv.from.toLowerCase()} (base ${conv.fromBase}) to ${conv.to.toLowerCase()} (base ${conv.toBase}) instantly.</p>

      <div class="converter">
        <!-- Input Side -->
        <div class="converter__group">
          <label class="converter__label" for="inputValue">Input (${conv.from})</label>
          <div class="display">
            <div class="display__bezel">
              <span class="display__badge" id="inputBadge">${conv.fromShort}</span>
              <div class="converter__input-wrap">
                <input type="text" id="inputValue" class="converter__input" placeholder="Enter a ${conv.from.toLowerCase()} number\u2026" autocomplete="off" spellcheck="false" />
                <button class="converter__clear-btn" id="clearBtn" aria-label="Clear input" title="Clear">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
          </div>
          <select id="inputBase" class="converter__select" aria-label="Input base" title="Input base">
            <option value="2"${conv.fromBase === 2 ? ' selected' : ''}>Binary (Base 2)</option>
            <option value="10"${conv.fromBase === 10 ? ' selected' : ''}>Decimal (Base 10)</option>
            <option value="8"${conv.fromBase === 8 ? ' selected' : ''}>Octal (Base 8)</option>
            <option value="16"${conv.fromBase === 16 ? ' selected' : ''}>Hexadecimal (Base 16)</option>
          </select>
        </div>

        <!-- Swap Button -->
        <button class="converter__swap" id="swapBtn" aria-label="Swap input and output" title="Swap">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
        </button>

        <!-- Output Side -->
        <div class="converter__group">
          <label class="converter__label" for="outputValue">Output (${conv.to})</label>
          <div class="display">
            <div class="display__bezel">
              <span class="display__badge" id="outputBadge">${conv.toShort}</span>
              <div class="converter__input-wrap">
                <input type="text" id="outputValue" class="converter__input converter__input--readonly" readonly placeholder="Result will appear here\u2026" />
                <button class="converter__copy-btn" id="copyBtn" aria-label="Copy result" title="Copy">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                </button>
              </div>
            </div>
          </div>
          <select id="outputBase" class="converter__select" aria-label="Output base" title="Output base">
            <option value="2"${conv.toBase === 2 ? ' selected' : ''}>Binary (Base 2)</option>
            <option value="10"${conv.toBase === 10 ? ' selected' : ''}>Decimal (Base 10)</option>
            <option value="8"${conv.toBase === 8 ? ' selected' : ''}>Octal (Base 8)</option>
            <option value="16"${conv.toBase === 16 ? ' selected' : ''}>Hexadecimal (Base 16)</option>
          </select>
        </div>
      </div>

      <!-- Validation message -->
      <p class="converter__error" id="errorMsg" role="alert"></p>

      <!-- All-bases quick reference -->
      <div class="quickref" id="quickRef">
        <div class="quickref__item">
          <span class="quickref__label">BIN</span>
          <span class="quickref__value" id="qrBin" data-base="2">&mdash;</span>
          <button class="quickref__copy" data-target="qrBin" aria-label="Copy binary" title="Copy"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
        </div>
        <div class="quickref__item">
          <span class="quickref__label">OCT</span>
          <span class="quickref__value" id="qrOct" data-base="8">&mdash;</span>
          <button class="quickref__copy" data-target="qrOct" aria-label="Copy octal" title="Copy"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
        </div>
        <div class="quickref__item">
          <span class="quickref__label">DEC</span>
          <span class="quickref__value" id="qrDec" data-base="10">&mdash;</span>
          <button class="quickref__copy" data-target="qrDec" aria-label="Copy decimal" title="Copy"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
        </div>
        <div class="quickref__item">
          <span class="quickref__label">HEX</span>
          <span class="quickref__value" id="qrHex" data-base="16">&mdash;</span>
          <button class="quickref__copy" data-target="qrHex" aria-label="Copy hex" title="Copy"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
        </div>
        <div class="quickref__meta" id="quickRefMeta"></div>
      </div>
    </section>

    <!-- Keyboard hints -->
    <div class="kbd-hints">
      <span class="kbd-hint"><kbd>Esc</kbd> Clear</span>
      <span class="kbd-hint"><kbd>Tab</kbd> Next field</span>
      <span class="kbd-hint">Click history to reload</span>
    </div>

    <!-- History Section -->
    <section class="history" aria-label="Conversion history">
      <div class="history__header">
        <div class="history__title-group">
          <h2 class="history__title">
            <svg class="history__icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            Conversion History
          </h2>
          <span class="history__count" id="historyCount">0</span>
        </div>
        <button class="history__clear" id="clearHistoryBtn">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Clear All
        </button>
      </div>
      <ul class="history__list" id="historyList">
        <li class="history__empty" id="historyEmpty">
          <svg class="history__empty-icon" viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="3" ry="3"></rect><line x1="2" y1="8" x2="22" y2="8"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="8" y1="16" x2="14" y2="16"></line></svg>
          <span>No conversions yet</span>
          <small>Start typing to see your history here</small>
        </li>
      </ul>
    </section>

    <!-- SEO: How to Convert Section -->
    <section class="seo-content" aria-label="How to convert ${conv.from.toLowerCase()} to ${conv.to.toLowerCase()}">
      <h2 class="seo-content__title">How to Convert ${conv.from} to ${conv.to}</h2>
      <p>${conv.howToIntro}</p>

      <h3>Step-by-Step Method</h3>
      <ol>
${stepsHtml}
      </ol>

      <h3>Example</h3>
      <p>${conv.example}</p>

      <h3>${conv.from} to ${conv.to} Conversion Table</h3>
      <table class="conversion-table">
        <thead>
          <tr>
            <th>${conv.from} (Base ${conv.fromBase})</th>
            <th>${conv.to} (Base ${conv.toBase})</th>
          </tr>
        </thead>
        <tbody>
${tableRows}
        </tbody>
      </table>

      <!-- FAQ -->
      <div class="faq-section">
        <h3 class="faq-section__title">Frequently Asked Questions</h3>
${faqHtml}
      </div>
    </section>

    <!-- SEO: Other Converters -->
    <section class="all-converters" aria-label="Other conversion tools">
      <h2 class="all-converters__title">Other Number Converters</h2>
      <p class="all-converters__subtitle">Need a different conversion? Try one of these:</p>
      <div class="all-converters__grid">
        <a href="index.html" class="all-converters__link all-converters__link--active">All-in-One Converter</a>
${otherConverters}
      </div>
    </section>
  </main>

  <!-- ====== FOOTER ====== -->
  <footer class="footer">
    <p>&copy; 2026 NumConvert &mdash; Built with Vibes.</p>
    <p>Made by <a href="https://github.com/mAB-Barket" rel="noopener" target="_blank">mAB-Barket</a></p>
  </footer>

  <!-- Toast notification -->
  <div class="toast" id="toast"></div>

  <script>window.NUMCONVERT_DEFAULTS = { fromBase: '${conv.fromBase}', toBase: '${conv.toBase}' };</script>
  <script src="script.js"></script>
</body>
</html>`;
}

// ─── Generate All Pages ─────────────────────────────────────────
conversions.forEach(conv => {
  const html = generatePage(conv);
  const filePath = path.join(__dirname, `${conv.slug}.html`);
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`\u2713 Generated: ${conv.slug}.html`);
});

console.log(`\nDone! Generated ${conversions.length} conversion landing pages.`);
