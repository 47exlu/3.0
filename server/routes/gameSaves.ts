import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertGameSaveSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const router = Router();

// GET all saves for a user
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const gameSaves = await storage.getUserGameSaves(userId);
    res.json(gameSaves);
  } catch (error) {
    console.error(`Error getting game saves for user ID ${req.params.userId}:`, error);
    res.status(500).json({ error: "Failed to retrieve game saves" });
  }
});

// GET a specific save by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const gameSave = await storage.getGameSaveById(id);
    if (!gameSave) {
      return res.status(404).json({ error: "Game save not found" });
    }

    res.json(gameSave);
  } catch (error) {
    console.error(`Error getting game save with ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to retrieve game save" });
  }
});

// GET a save by user ID and save slot
router.get("/user/:userId/slot/:saveSlot", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const saveSlot = parseInt(req.params.saveSlot);
    
    if (isNaN(userId) || isNaN(saveSlot)) {
      return res.status(400).json({ error: "Invalid user ID or save slot format" });
    }

    const gameSave = await storage.getGameSaveBySlot(userId, saveSlot);
    if (!gameSave) {
      return res.status(404).json({ error: "Game save not found" });
    }

    res.json(gameSave);
  } catch (error) {
    console.error(`Error getting game save for user ID ${req.params.userId}, slot ${req.params.saveSlot}:`, error);
    res.status(500).json({ error: "Failed to retrieve game save" });
  }
});

// POST create a new game save
router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("Attempting to create game save with data");
    
    // Process the data
    const processedData = {
      ...req.body,
      lastSaved: req.body.lastSaved || new Date().toISOString()
    };
    
    const validatedData = insertGameSaveSchema.parse(processedData);
    const newGameSave = await storage.createGameSave(validatedData);
    res.status(201).json(newGameSave);
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedError = fromZodError(error);
      return res.status(400).json({ error: formattedError.message });
    }
    console.error("Error creating game save:", error);
    res.status(500).json({ error: "Failed to create game save" });
  }
});

// POST auto-save feature (special endpoint for auto-saving)
router.post("/auto-save", async (req: Request, res: Response) => {
  try {
    const { userId, saveData, saveSlot = 0 } = req.body;
    
    if (!userId || !saveData) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Check if there's an existing save in this slot
    const existingSave = await storage.getGameSaveBySlot(userId, saveSlot);
    
    if (existingSave) {
      // Update existing save
      const updatedSave = await storage.updateGameSave(existingSave.id, {
        saveData,
        lastSaved: new Date().toISOString()
      });
      return res.json(updatedSave);
    } else {
      // Create new save
      const newSave = await storage.createGameSave({
        userId,
        saveData,
        saveSlot,
        active: true,
        lastSaved: new Date().toISOString()
      });
      return res.status(201).json(newSave);
    }
  } catch (error) {
    console.error("Error auto-saving game:", error);
    res.status(500).json({ error: "Failed to auto-save game" });
  }
});

// PATCH update a game save
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const existingSave = await storage.getGameSaveById(id);
    if (!existingSave) {
      return res.status(404).json({ error: "Game save not found" });
    }

    // Update the lastSaved timestamp
    const updates = { 
      ...req.body,
      lastSaved: new Date().toISOString()
    };
    
    const updatedGameSave = await storage.updateGameSave(id, updates);
    res.json(updatedGameSave);
  } catch (error) {
    console.error(`Error updating game save with ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to update game save" });
  }
});

// DELETE a game save
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    const success = await storage.deleteGameSave(id);
    if (!success) {
      return res.status(404).json({ error: "Game save not found or could not be deleted" });
    }

    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting game save with ID ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to delete game save" });
  }
});

export default router;