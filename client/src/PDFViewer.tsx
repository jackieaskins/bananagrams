import React, { useState } from 'react';
import { Box, IconButton, Modal } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import { PDFDocumentProxy } from 'pdfjs-dist';

import { useStyles } from './styles';

type PDFViewerProps = {
  file: string;
  open: boolean;
  onHide: () => void;
};

const PDFViewer: React.FC<PDFViewerProps> = ({ file, open, onHide }) => {
  const classes = useStyles();
  const [numPages, setNumPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadDocumentSuccess = (pdf: PDFDocumentProxy): void => {
    setNumPages(pdf.numPages);
    setIsLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={onHide}
      keepMounted
      style={{ overflow: 'scroll' }}
    >
      <>
        <Document
          className={classes.pdfViewer}
          file={file}
          onLoadSuccess={handleLoadDocumentSuccess}
        >
          {isLoading ? (
            <Page pageIndex={0} />
          ) : (
            Array.from(new Array(numPages), (_, index) => (
              <Box my={1} key={index}>
                <Page pageIndex={index} />
              </Box>
            ))
          )}
        </Document>
        {open && (
          <IconButton className={classes.closeButton} onClick={onHide}>
            <Close />
          </IconButton>
        )}
      </>
    </Modal>
  );
};

export default PDFViewer;
