import html2pdf from 'html2pdf.js';

export const exportResumeToPdf = async (element, filename = 'HireCraft_Resume') => {
  if (!element) return;

  const opt = {
    margin: [0, 0, 0, 0],
    filename: `${filename}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: ['.resume-item', '.resume-section', 'img'],
    },
  };

  await html2pdf().set(opt).from(element).save();
};

export const printResume = (element) => {
  if (!element) return;
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) => node.outerHTML)
    .join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HireCraft Resume</title>
        ${styles}
        <style>
          @page { size: A4; margin: 0; }
          body { margin: 0; padding: 0; background: white; }
          .resume-preview-root { width: 210mm; min-height: 297mm; }
        </style>
      </head>
      <body>${element.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
};
