import { Dialog, DialogContent, useMediaQuery, useTheme, Slide, IconButton } from '@mui/material';
import Comments from '../comments/Comments';
import { FaX } from 'react-icons/fa6';
import { X } from 'lucide-react';

export default function CommentModal({ open, setOpen, handleOpen, handleClose }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      disableScrollLock
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }} // Smooth slide-in effect
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#1f2937',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '8px 12px',
          height: fullScreen ? '100vh' : '90vh',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogContent
        sx={{
          overflow: 'hidden', // Disable scrolling
          padding: '16px',
          position: 'relative', // Allows absolute positioning inside
        }}
      >
        {/* Close Button */}
          <X size={28} onClick={handleClose}  className='absolute rounded-full bg-slate-500 cursor-pointer top-0 right-0 ' />

        {/* Comments Section */}
        <Comments />
      </DialogContent>
    </Dialog>
  );
}
