import express from "express";
import Stock from "../models/Stock.model.js";

const router = express.Router();

// GET all active stocks
router.get("/", async (req, res) => {
  try {
    const stocks = await Stock.find({ isActive: true })
      .select("_id symbol name keywords")
      .sort({ symbol: 1 });

    res.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({
      error: "Failed to fetch stocks",
      message: error.message,
    });
  }
});

// GET single stock by ID
router.get("/:id", async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.json(stock);
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({
      error: "Failed to fetch stock",
      message: error.message,
    });
  }
});

// GET stock by symbol
router.get("/symbol/:symbol", async (req, res) => {
  try {
    const stock = await Stock.findOne({
      symbol: req.params.symbol.toUpperCase(),
    });

    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    res.json(stock);
  } catch (error) {
    console.error("Error fetching stock by symbol:", error);
    res.status(500).json({
      error: "Failed to fetch stock",
      message: error.message,
    });
  }
});

// POST - Add new stock (for testing/admin)
router.post("/", async (req, res) => {
  try {
    const { symbol, name, keywords, isActive } = req.body;

    const newStock = new Stock({
      symbol: symbol.toUpperCase(),
      name,
      keywords: keywords || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Stock with this symbol already exists",
      });
    }

    console.error("Error creating stock:", error);
    res.status(500).json({
      error: "Failed to create stock",
      message: error.message,
    });
  }
});

// POST - Seed WITCH companies (run once)
router.post("/seed-witch", async (req, res) => {
  const witchStocks = [
    {
      symbol: "INFY",
      name: "Infosys",
      keywords: [
        "Infosys",
        "INFY",
        "Infosys Limited",
        "Infosys stock",
        "Infosys earnings",
      ],
      isActive: true,
    },
    {
      symbol: "WIPRO",
      name: "Wipro",
      keywords: ["Wipro", "Wipro Limited", "Wipro stock", "Wipro earnings"],
      isActive: true,
    },
    {
      symbol: "HCLTECH",
      name: "HCL Technologies",
      keywords: [
        "HCL",
        "HCL Technologies",
        "HCLTECH",
        "HCL Tech",
        "HCL stock",
        "HCL earnings",
      ],
      isActive: true,
    },
    {
      symbol: "TECHM",
      name: "Tech Mahindra",
      keywords: [
        "Tech Mahindra",
        "TECHM",
        "Tech Mahindra stock",
        "Tech Mahindra earnings",
      ],
      isActive: true,
    },
  ];

  try {
    const result = await Stock.insertMany(witchStocks, { ordered: false });
    res.json({
      success: true,
      message: `Added ${result.length} WITCH stocks`,
      stocks: result,
    });
  } catch (error) {
    if (error.code === 11000) {
      res.json({
        success: true,
        message: "Some stocks already exist, added new ones only",
      });
    } else {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
});

export default router;
