// ============================================================
// Recycling Suggestions Data — Tips per waste type
// ============================================================

export interface RecyclingSuggestion {
  type: "Wet" | "Dry" | "Hazardous";
  recycle: string;
  diy: string;
  safety: string;
  color: string;
  icon: string;
}

export const recyclingSuggestions: Record<string, RecyclingSuggestion> = {
  Wet: {
    type: "Wet",
    recycle: "Compost wet waste like food scraps, fruit peels, and vegetable trimmings. Use a compost bin or community composting facility.",
    diy: "Create nutrient-rich compost for your garden. Use banana peels as plant fertilizer. Make citrus peel cleaner by soaking in vinegar.",
    safety: "Store in sealed containers to prevent odor and pest attraction. Drain excess liquid before disposal. Wash hands after handling.",
    color: "bg-eco-wet",
    icon: "💧",
  },
  Dry: {
    type: "Dry",
    recycle: "Sort dry waste into paper, plastic, metal, and glass. Rinse containers before recycling. Flatten cardboard boxes to save space.",
    diy: "Turn glass jars into storage containers or candle holders. Create artwork from old magazines. Use cardboard for DIY organizers.",
    safety: "Watch for sharp edges on metal cans and broken glass. Ensure containers are clean and dry. Remove non-recyclable caps and labels.",
    color: "bg-eco-dry",
    icon: "📦",
  },
  Hazardous: {
    type: "Hazardous",
    recycle: "Never mix with regular waste! Take to designated hazardous waste collection centers. Contact local authorities for e-waste and chemical disposal.",
    diy: "Recharge rechargeable batteries instead of disposing. Donate working electronics. Use eco-friendly alternatives for household chemicals.",
    safety: "⚠️ Wear gloves when handling. Never burn hazardous materials. Keep away from children and pets. Store in original labeled containers.",
    color: "bg-eco-hazardous",
    icon: "☢️",
  },
};
