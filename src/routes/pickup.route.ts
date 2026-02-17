import { Router } from 'express';
import { createPickupRequest, getPickups, updatePickupStatus } from '../controllers/pickup.controller';

const router = Router();

// Route for creating a pickup request (for users)
router.post('/', createPickupRequest);

// Route for getting the list of pickup requests (for users or recyclers)
router.get('/', getPickups);

// Route for updating the pickup status (recyclers accepting or completing)
router.patch('/:pickupId', updatePickupStatus);

export default router;
