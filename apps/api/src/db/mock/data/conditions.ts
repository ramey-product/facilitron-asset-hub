export interface MockConditionScale {
  conditionID: number;
  customerID: number;
  conditionName: string;
  conditionScore: number;
  colorCode: string;
  isActive: boolean;
}

export const mockConditionScales: MockConditionScale[] = [
  { conditionID: 1, customerID: 1, conditionName: "Excellent", conditionScore: 5, colorCode: "#22C55E", isActive: true },
  { conditionID: 2, customerID: 1, conditionName: "Good", conditionScore: 4, colorCode: "#84CC16", isActive: true },
  { conditionID: 3, customerID: 1, conditionName: "Fair", conditionScore: 3, colorCode: "#F59E0B", isActive: true },
  { conditionID: 4, customerID: 1, conditionName: "Poor", conditionScore: 2, colorCode: "#F97316", isActive: true },
  { conditionID: 5, customerID: 1, conditionName: "Critical", conditionScore: 1, colorCode: "#EF4444", isActive: true },
];
