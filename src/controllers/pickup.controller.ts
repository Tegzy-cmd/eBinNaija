import { Request, Response } from 'express';
import pickup from '../models/pickup';
import wallet from '../models/wallet';
import {creditWallet} from '../services/wallet.service';
import { Types } from 'mongoose';

// **1. Create a Pickup Request (User submits waste)**
export const createPickupRequest = async (req: Request, res: Response) => {
  const { wasteType, location, userId } = req.body;

  try {
    // Validate input
    if (!wasteType || !location || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newPickup = new pickup({
      userId,
      wasteType,
      location,
      status: 'requested', // Initial status when user submits the request
      scheduledAt: new Date(), // Scheduled time, can be adjusted
    });

    await newPickup.save();

    // Optionally, credit the user wallet for submitting waste
    // Example: Assign reward for submitting waste
    const rewardAmount = 5; // Example fixed reward for submitting waste (can be dynamic)
    await creditWallet(userId, rewardAmount, 'waste_submission_reward');

    return res.status(201).json({ message: 'Pickup request created successfully', pickup });
  } catch (error) {
    console.error('Error creating pickup request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// **2. Get Pickup Requests (for Users or Recyclers)**
export const getPickups = async (req: Request, res: Response) => {
  const { userId, recyclerId } = req.query;

  try {
    const filter: any = {};

    // If the userId is provided, show only their requests
    if (userId) {
      filter.userId = userId;
    }

    // If the recyclerId is provided, show only requests assigned to the recycler
    if (recyclerId) {
      filter.recyclerId = recyclerId;
    }

    const newPickup = await pickup.find(filter).populate('userId recyclerId');

    return res.status(200).json(newPickup);
  } catch (error) {
    console.error('Error retrieving pickups:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// **3. Update Pickup Status (Recycler Accepting or Completing Pickup)**
export const updatePickupStatus = async (req: Request, res: Response) => {
  const { pickupId } = req.params;
  const { status, recyclerId } = req.body;

  try {
    // Validate the status update
    if (!['accepted', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const newPickup = await pickup.findById(pickupId);
    if (!newPickup) {
      return res.status(404).json({ message: 'Pickup request not found' });
    }

    // If the status is 'accepted', assign the recycler
    if (status === 'accepted' && recyclerId) {
      newPickup.recyclerId = recyclerId;
    }

    newPickup.status = status;
    await newPickup.save();

    // If the pickup is completed, credit the recycler’s wallet for completing the pickup
    if (status === 'completed' && recyclerId) {
      const rewardAmount = 10; // Example fixed reward for recycler completing the pickup
      await creditWallet(recyclerId, rewardAmount, 'pickup_completed');
    }

    return res.status(200).json({ message: 'Pickup status updated successfully', pickup: newPickup });
  } catch (error) {
    console.error('Error updating pickup status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};