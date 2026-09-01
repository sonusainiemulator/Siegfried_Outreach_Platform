import { InteractionMessage } from '@/types';
import { stripMarkdown } from './chatUtils';

export const exportToText = async (messages: InteractionMessage[], botName: string) => {
  const { saveAs } = await import('file-saver');
  const content = messages
    .map((msg) => `${msg.role === 'bot' ? botName : 'You'}: ${stripMarkdown(msg.text)}`)
    .join('\n\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `chat-with-${botName.toLowerCase().replace(/\s+/g, '-')}.txt`);
};

export const exportToPDF = async (messages: InteractionMessage[], botName: string) => {
  const jspdfModule = await import('jspdf');
  const jsPDF = jspdfModule.jsPDF || (jspdfModule as any).default;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const maxLineWidth = pageWidth - margin * 2;
  let cursorY = 22;

  
  doc.setFontSize(20);
  doc.setTextColor(124, 58, 237); 
  doc.text(`Chat with ${botName}`, margin, cursorY);
  cursorY += 8;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Exported on ${new Date().toLocaleString()}`, margin, cursorY);
  cursorY += 15;

  messages.forEach((msg) => {
    const isBot = msg.role === 'bot';
    const roleName = isBot ? botName : 'You';

    // Role Name
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isBot ? 124 : 0, isBot ? 58 : 0, isBot ? 237 : 0);
    doc.text(`${roleName}:`, margin, cursorY);
    cursorY += 6;

    // Message Text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50);

    const lines = msg.text.split('\n');
    lines.forEach((line) => {
      
      if (cursorY > 280) {
        doc.addPage();
        cursorY = 20;
      }

      const trimmedLine = line.trim();
      const isBullet = /^[*-]\s/.test(trimmedLine);
      const isNumbered = /^\d+\.\s/.test(trimmedLine);
      
      let currentMargin = margin;
      let lineText = line;

      if (isBullet || isNumbered) {
        currentMargin = margin + 5;
        
        const marker = isBullet ? '•' : trimmedLine.split(' ')[0];
        doc.setFont('helvetica', 'bold');
        doc.text(marker, margin, cursorY);
        lineText = trimmedLine.replace(/^[*-]\s|^\d+\.\s/, '');
      }

      const parts = lineText.split(/(\*\*.*?\*\*)/g);
      let cursorX = currentMargin;

      parts.forEach((part) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          doc.setFont('helvetica', 'bold');
          const cleanPart = part.slice(2, -2);
          const partWidth = doc.getTextWidth(cleanPart);
          
          if (cursorX + partWidth > pageWidth - margin) {
            cursorY += 5;
            cursorX = currentMargin;
          }
          
          doc.text(cleanPart, cursorX, cursorY);
          cursorX += partWidth;
        } else if (part) {
          doc.setFont('helvetica', 'normal');
          const wrappedText = doc.splitTextToSize(part, pageWidth - cursorX - margin);
          wrappedText.forEach((textLine: string, index: number) => {
            if (index > 0) {
              cursorY += 5;
              cursorX = currentMargin;
            }
            doc.text(textLine, cursorX, cursorY);
            if (index === wrappedText.length - 1) {
              cursorX += doc.getTextWidth(textLine);
            }
          });
        }
      });
      
      cursorY += 6;
    });

    cursorY += 4; 
  });

  doc.save(`chat-with-${botName.toLowerCase().replace(/\s+/g, '-')}.pdf`);
};

export const exportToWord = async (messages: InteractionMessage[], botName: string) => {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
  const { saveAs } = await import('file-saver');

  // Helper to parse simple markdown bold and convert to TextRuns
  const parseMarkdownToTextRuns = (text: string, isBot: boolean) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return new TextRun({
          text: part.slice(2, -2),
          bold: true,
          color: isBot ? '7C3AED' : '000000',
        });
      }
      return new TextRun({
        text: part.replace(/^[*-]\s/, ''), 
        color: isBot ? '333333' : '000000',
      });
    });
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: `Chat with ${botName}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Exported on ${new Date().toLocaleString()}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...messages.flatMap((msg) => {
            const isBot = msg.role === 'bot';
            const lines = msg.text.split('\n');
            
            const contentParagraphs = lines.map(line => {
              const isBullet = /^[*-]\s/.test(line.trim());
              return new Paragraph({
                children: parseMarkdownToTextRuns(line, isBot),
                spacing: { after: 120 },
                bullet: isBullet ? { level: 0 } : undefined,
              });
            });

            return [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${isBot ? botName : 'You'}:`,
                    bold: true,
                    color: isBot ? '7C3AED' : '000000',
                  }),
                ],
                spacing: { before: 200 },
              }),
              ...contentParagraphs,
            ];
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `chat-with-${botName.toLowerCase().replace(/\s+/g, '-')}.docx`);
};


