import { useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Copy, QrCode, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 350 },
  },
  exit: { opacity: 0, scale: 0.92, y: 12, transition: { duration: 0.18 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
const QRCodeModal = ({ isOpen, onClose, resumeId, resumeName = 'My Resume' }) => {
  const qrRef = useRef(null);
  const shareUrl = `${window.location.origin}/shared/${resumeId}`;

  /* Download QR as PNG via canvas */
  const handleDownloadQR = useCallback(() => {
    const svgEl = qrRef.current?.querySelector('svg');
    if (!svgEl) return;

    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    const size = 512; // High-res export
    canvas.width = size;
    canvas.height = size;

    img.onload = () => {
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const link = document.createElement('a');
      link.download = `${resumeName.replace(/\s+/g, '_')}_QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('QR code downloaded!');
    };

    img.onerror = () => toast.error('Failed to generate QR image.');
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  }, [resumeName]);

  /* Copy share link */
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      toast.success('Share link copied!');
    }
  }, [shareUrl]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="QR Code sharing"
            className="relative z-10 w-full max-w-sm glass-card rounded-2xl border border-white/10 p-6 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close QR modal"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15">
                <QrCode className="w-6 h-6 text-brand-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Share Resume</h2>
              <p className="text-sm text-gray-400 mt-1 truncate max-w-[250px] mx-auto">
                {resumeName}
              </p>
            </div>

            {/* QR Code */}
            <div
              ref={qrRef}
              className="mx-auto w-fit p-5 bg-white rounded-2xl shadow-lg mb-6"
            >
              <QRCodeSVG
                value={shareUrl}
                size={256}
                level="H"
                includeMargin={false}
                fgColor="#0a0a0a"
                bgColor="#ffffff"
              />
            </div>

            {/* Share URL display */}
            <div className="flex items-center gap-2 mb-6 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10">
              <ExternalLink className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="text-xs text-gray-400 truncate flex-1">
                {shareUrl}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleDownloadQR}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl
                           bg-brand-500 hover:bg-brand-400 text-white px-4 py-2.5
                           text-sm font-semibold transition-colors"
                aria-label="Download QR code as image"
              >
                <Download className="w-4 h-4" />
                Download QR
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl
                           border border-white/10 bg-white/5 hover:bg-white/10
                           text-gray-300 px-4 py-2.5 text-sm font-medium transition-colors"
                aria-label="Copy share link to clipboard"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QRCodeModal;
