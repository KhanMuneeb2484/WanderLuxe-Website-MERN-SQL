import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function BookingConfirmationDialog({ open, onClose, onViewBookings }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">Booking Confirmed!</DialogTitle>
      <DialogContent>
        <Box display="flex" justifyContent="center" my={3}>
          <CheckCircleIcon style={{ fontSize: 50, color: "green" }} />
        </Box>
        <Typography align="center" variant="body1">
          Your booking has been successfully created and confirmed. <br />
          You can view all your bookings in your profile.
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center", paddingBottom: "1rem" }}>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained" color="primary" onClick={onViewBookings}>
          View My Bookings
        </Button>
      </DialogActions>
    </Dialog>
  );
}
