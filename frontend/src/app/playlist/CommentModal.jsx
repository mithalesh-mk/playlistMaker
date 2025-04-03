import { Dialog, DialogContent, useMediaQuery, useTheme } from '@mui/material';
import Comments from '../comments/Comments';
import { FaX } from 'react-icons/fa6';

export default function CommentModal({ open, setOpen, handleOpen, handleClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={fullScreen}
        disableScrollLock={true}
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: '#1f2937',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '6px',
            height: '90vh',
            width: '100%',
          },
        }}
      >
        <DialogContent
          sx={{
            overflow: 'hidden', // Disable scrolling
            padding: 0, // Optional: Remove default padding if needed
          }}
        >
          <FaX
            className="float-end cursor-pointer hover:text-gray-400 transition-all duration-200"
            onClick={handleClose}
            size={18}
            aria-label="Close"
          />
          <Comments />
        </DialogContent>
      </Dialog>
    </>
  );
}